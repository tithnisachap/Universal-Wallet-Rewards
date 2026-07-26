<?php

namespace Tests\Feature\Api;

use App\Models\Customer;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    /**
     * Branch/vendor-profile creation reverse-geocodes coordinates via the
     * real Nominatim API. Tests must never hit the live network — it's
     * slow, flaky, and against Nominatim's usage policy for automated
     * requests — so every test gets a canned response by default.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response([
                'display_name' => 'Fake Test Address, Phnom Penh, Cambodia',
            ], 200),
        ]);
    }

    protected function actingAsCustomer(?Customer $customer = null): Customer
    {
        $customer ??= Customer::factory()->create();
        Sanctum::actingAs($customer->user, ['*']);

        return $customer;
    }

    protected function actingAsVendor(?Vendor $vendor = null): Vendor
    {
        $vendor ??= Vendor::factory()->approved()->create();
        Sanctum::actingAs($vendor->user, ['*']);

        return $vendor;
    }

    protected function actingAsAdmin(): User
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin, ['*']);

        return $admin;
    }
}
