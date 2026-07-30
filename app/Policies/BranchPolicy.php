<?php

namespace App\Policies;

use App\Models\Branch;
use App\Models\User;

class BranchPolicy
{
    /**
     * Determine whether the user can create a branch for their vendor.
     */
    public function create(User $user): bool
    {
        return $user->role === 'vendor' && $user->vendor?->status === 'approved';
    }

    /**
     * Determine whether the user can view/update the model.
     */
    public function update(User $user, Branch $branch): bool
    {
        return $user->vendor?->id === $branch->vendor_id;
    }

    public function view(User $user, Branch $branch): bool
    {
        return $this->update($user, $branch);
    }

    public function delete(User $user, Branch $branch): bool
    {
        return $this->update($user, $branch);
    }
}
