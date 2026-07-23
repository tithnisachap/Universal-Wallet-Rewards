<?php

namespace Tests\Feature\Api\Customer;

use Tests\Feature\Api\ApiTestCase;

class ProfileTest extends ApiTestCase
{
    public function test_customer_can_view_own_profile(): void
    {
        $customer = $this->actingAsCustomer();

        $this->getJson('/api/customer/profile')
            ->assertOk()
            ->assertJsonPath('data.customer_code', $customer->customer_code)
            ->assertJsonPath('data.name', $customer->user->name);
    }

    public function test_customer_can_update_own_name(): void
    {
        $this->actingAsCustomer();

        $this->putJson('/api/customer/profile', ['name' => 'Updated Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Name');
    }

    public function test_updating_profile_requires_name(): void
    {
        $this->actingAsCustomer();

        $this->putJson('/api/customer/profile', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }
}
