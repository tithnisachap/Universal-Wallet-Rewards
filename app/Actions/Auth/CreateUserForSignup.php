<?php

namespace App\Actions\Auth;

use App\Models\Customer;
use App\Models\User;

/**
 * Single source of truth for "create a brand-new account for a customer or
 * vendor signup" — used by both the real Google OAuth callback and the
 * dev-mock signup endpoint, so the Customer-row-creation rule can't drift
 * between the two.
 */
class CreateUserForSignup
{
    public static function run(
        string $role,
        string $name,
        string $email,
        ?string $googleId = null,
        ?string $avatar = null,
    ): User {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'google_id' => $googleId,
            'avatar' => $avatar,
            'role' => $role,
        ]);

        if ($role === 'customer') {
            Customer::create([
                'user_id' => $user->id,
                'customer_code' => 'CUS-'.str_pad((string) $user->id, 6, '0', STR_PAD_LEFT),
            ]);
        }

        return $user;
    }
}
