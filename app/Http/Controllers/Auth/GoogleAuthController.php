<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\CreateUserForSignup;
use App\Http\Controllers\Controller;
use App\Models\BranchStaff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

/**
 * Unified Google sign-in. There is exactly one "Continue with Google" entry
 * point for returning users of ANY role (customer/vendor/admin/branch_staff)
 * — no role is asserted by the client, the account's stored role is
 * authoritative. A `role` query param is only meaningful for brand-new
 * signups from the /signup role picker, and only customer/vendor may ever be
 * requested that way — admin is hand-provisioned, branch_staff is
 * invite-only, neither can self-signup regardless of what a client sends.
 */
class GoogleAuthController extends Controller
{
    private const SIGNUP_ROLES = ['customer', 'vendor'];

    public function redirect(Request $request): RedirectResponse
    {
        $role = $request->query('role');

        if ($role !== null) {
            abort_unless(in_array($role, self::SIGNUP_ROLES, true), 400, 'Invalid role.');
        }

        $driver = Socialite::driver('google')->stateless();

        return $role !== null
            ? $driver->with(['state' => $role])->redirect()
            : $driver->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontendUrl = rtrim(config('app.url'), '/').'/auth/google/complete';
        $requestedRole = $request->query('state');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            Log::error('Google OAuth callback failed', [
                'exception' => $e::class,
                'message' => $e->getMessage(),
                'query' => $request->query(),
            ]);

            return redirect($frontendUrl.'#error=google_auth_failed');
        }

        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Revoke + reinvite: a branch_staff user can exist with no live
            // branch assignment. Re-link if a fresh pending invite exists;
            // if not, let them in anyway — VendorAccessResolver already
            // handles "no assigned branch" gracefully downstream.
            if ($user->role === 'branch_staff' && ! $user->branchStaff) {
                $invite = BranchStaff::where('email', $googleUser->getEmail())->whereNull('accepted_at')->first();
                $invite?->update(['user_id' => $user->id, 'accepted_at' => now()]);
            }

            if (! $user->google_id) {
                $user->forceFill([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $user->avatar ?? $googleUser->getAvatar(),
                ])->save();
            }

            $token = $user->createToken('google-login')->plainTextToken;

            return redirect($frontendUrl.'#token='.$token);
        }

        // No existing account. A pending staff invite for this exact email
        // always wins over whatever (if anything) was requested.
        $invite = BranchStaff::where('email', $googleUser->getEmail())->whereNull('accepted_at')->first();

        if ($invite) {
            $user = User::create([
                'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: $googleUser->getEmail(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'branch_staff',
            ]);

            $invite->update(['user_id' => $user->id, 'accepted_at' => now()]);

            $token = $user->createToken('google-login')->plainTextToken;

            return redirect($frontendUrl.'#token='.$token);
        }

        // Genuinely new signup. Requires an explicit, valid role from the
        // /signup flow — a plain "Continue with Google" click, or a
        // tampered/garbage state, is never enough to create an account.
        if (! in_array($requestedRole, self::SIGNUP_ROLES, true)) {
            Log::info('Google sign-in with no matching account', [
                'email' => $googleUser->getEmail(),
                'requested_role' => $requestedRole,
            ]);

            return redirect($frontendUrl.'#error=no_account');
        }

        $user = CreateUserForSignup::run(
            $requestedRole,
            $googleUser->getName() ?: $googleUser->getNickname() ?: $googleUser->getEmail(),
            $googleUser->getEmail(),
            $googleUser->getId(),
            $googleUser->getAvatar(),
        );

        $token = $user->createToken('google-login')->plainTextToken;

        return redirect($frontendUrl.'#token='.$token);
    }
}
