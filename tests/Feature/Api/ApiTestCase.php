<?php

namespace Tests\Feature\Api;

use App\Models\Customer;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

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
