<?php

namespace App\Http\Controllers\Api\Auth;

use App\Actions\Auth\CreateUserForSignup;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\BranchStaff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Dev-only fallback for the real Google OAuth flow (GoogleAuthController) —
 * used when GOOGLE_CLIENT_ID/SECRET aren't configured yet, or for testing
 * account flows without needing a real Google account. Issues a genuine
 * Sanctum token by email alone, no password. Guarded to local/testing
 * environments so it can never be reachable in a real deployment.
 */
class DevLoginController extends Controller
{
    public function store(Request $request)
    {
        abort_unless(app()->environment(['local', 'testing']), 404);

        $request->validate(['email' => ['required', 'email']]);

        $email = $request->string('email')->toString();
        $user = User::where('email', $email)->first();

        if ($user) {
            // Revoke + reinvite: an existing branch_staff user can have no
            // live branch assignment. Re-link a fresh pending invite if one
            // exists, mirroring GoogleAuthController's callback().
            if ($user->role === 'branch_staff' && ! $user->branchStaff) {
                $invite = BranchStaff::where('email', $email)->whereNull('accepted_at')->first();
                $invite?->update(['user_id' => $user->id, 'accepted_at' => now()]);
            }
        } else {
            // Mirrors the real Google flow: a pending branch-staff invite
            // for this exact email is enough to sign in without an
            // existing account, so that path is testable without OAuth.
            $invite = BranchStaff::where('email', $email)->whereNull('accepted_at')->first();

            if (! $invite) {
                throw ValidationException::withMessages([
                    'email' => 'No account found for that email.',
                ]);
            }

            $user = User::create([
                'name' => $invite->email,
                'email' => $invite->email,
                'role' => 'branch_staff',
            ]);

            $invite->update(['user_id' => $user->id, 'accepted_at' => now()]);
        }

        $token = $user->createToken('dev-login')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => new UserResource($user->load(['customer', 'vendor'])),
            ],
        ]);
    }

    /**
     * Dev-only stand-in for the /signup role picker's Google flow — creates
     * a brand-new customer/vendor account without needing real OAuth.
     */
    public function signup(Request $request)
    {
        abort_unless(app()->environment(['local', 'testing']), 404);

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:customer,vendor'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
        ]);

        if (User::where('email', $validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => 'An account with that email already exists.',
            ]);
        }

        $user = CreateUserForSignup::run($validated['role'], $validated['name'], $validated['email']);

        $token = $user->createToken('dev-login')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => new UserResource($user->load(['customer', 'vendor'])),
            ],
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
