<?php

namespace Tests\Feature\Api;

use App\Models\Customer;
use App\Models\Vendor;

class AuthorizationTest extends ApiTestCase
{
    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
        $this->getJson('/api/customer/profile')->assertStatus(401);
        $this->getJson('/api/vendor/dashboard')->assertStatus(401);
        $this->getJson('/api/admin/dashboard')->assertStatus(401);
    }

    public function test_customer_cannot_access_vendor_routes(): void
    {
        $this->actingAsCustomer();

        $this->getJson('/api/vendor/dashboard')->assertStatus(403);
    }

    public function test_vendor_cannot_access_admin_routes(): void
    {
        $this->actingAsVendor();

        $this->getJson('/api/admin/dashboard')->assertStatus(403);
    }

    public function test_vendor_cannot_access_customer_routes(): void
    {
        $this->actingAsVendor();

        $this->getJson('/api/customer/profile')->assertStatus(403);
    }

    public function test_me_endpoint_returns_role_and_profile(): void
    {
        $customer = $this->actingAsCustomer();

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.role', 'customer')
            ->assertJsonPath('data.customer.id', $customer->id);
    }

    public function test_vendor_cannot_update_another_vendors_branch(): void
    {
        $this->actingAsVendor();
        $otherVendor = Vendor::factory()->approved()->create();
        $otherBranch = \App\Models\Branch::factory()->for($otherVendor)->create();

        $this->putJson("/api/vendor/branches/{$otherBranch->id}", ['name' => 'Hijacked'])
            ->assertStatus(403);
    }

    public function test_customer_cannot_update_another_customers_profile(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAsCustomer(); // a different customer

        // Customer profile routes are always scoped to the authenticated
        // user server-side, so there is no route that accepts another
        // customer's id — this asserts that scoping, not a 403.
        $response = $this->putJson('/api/customer/profile', ['name' => 'Me']);
        $response->assertOk();
        $this->assertNotEquals($customer->user->fresh()->name, 'Me');
    }
}
