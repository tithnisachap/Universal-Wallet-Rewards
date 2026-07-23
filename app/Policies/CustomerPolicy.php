<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    /**
     * Determine whether the user can view/update the model.
     */
    public function update(User $user, Customer $customer): bool
    {
        return $customer->user_id === $user->id;
    }

    public function view(User $user, Customer $customer): bool
    {
        return $this->update($user, $customer) || $user->role === 'vendor' || $user->role === 'admin';
    }
}
