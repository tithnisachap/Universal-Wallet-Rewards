<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * TEMPORARY stand-in for real authentication.
 *
 * Issues a genuine Sanctum token for a seeded user by email alone — no
 * password, no OAuth. This exists purely so the frontend can make real
 * authenticated requests before Google OAuth (Socialite) is wired up.
 *
 * Delete this controller and its routes once Socialite login lands.
 * Guarded to local/testing environments so it can never be reachable
 * in a real deployment.
 */
class DevLoginController extends Controller
{
    public function store(Request $request)
    {
        abort_unless(app()->environment(['local', 'testing']), 404);

        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->string('email'))->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'No account found for that email.',
            ]);
        }

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
