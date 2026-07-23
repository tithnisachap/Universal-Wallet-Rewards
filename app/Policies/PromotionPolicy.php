<?php

namespace App\Policies;

use App\Models\Promotion;
use App\Models\User;

class PromotionPolicy
{
    /**
     * Determine whether the user can create a promotion for their vendor.
     */
    public function create(User $user): bool
    {
        return $user->role === 'vendor' && $user->vendor?->status === 'approved';
    }

    /**
     * Determine whether the user can view/update the model.
     */
    public function update(User $user, Promotion $promotion): bool
    {
        return $user->vendor?->id === $promotion->vendor_id;
    }

    public function view(User $user, Promotion $promotion): bool
    {
        return $this->update($user, $promotion);
    }
}
