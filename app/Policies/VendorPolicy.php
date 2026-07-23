<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vendor;

class VendorPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Vendor $vendor): bool
    {
        return $user->role === 'admin' || $vendor->user_id === $user->id;
    }

    /**
     * Determine whether the user can create a vendor profile (shop setup).
     */
    public function create(User $user): bool
    {
        return $user->role === 'vendor' && ! $user->vendor()->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Vendor $vendor): bool
    {
        return $vendor->user_id === $user->id;
    }

    /**
     * Determine whether an admin can approve/reject this vendor's application.
     */
    public function review(User $user, Vendor $vendor): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether an admin can suspend/reinstate this vendor.
     */
    public function suspend(User $user, Vendor $vendor): bool
    {
        return $user->role === 'admin';
    }
}
