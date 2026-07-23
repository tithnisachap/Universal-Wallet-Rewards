<?php

namespace Tests\Feature\Api\Customer;

use App\Models\Branch;
use App\Models\Vendor;
use Tests\Feature\Api\ApiTestCase;

class VendorDirectoryTest extends ApiTestCase
{
    public function test_directory_only_lists_approved_vendors(): void
    {
        $this->actingAsCustomer();

        Vendor::factory()->approved()->create(['business_name' => 'Approved Cafe']);
        Vendor::factory()->pending()->create(['business_name' => 'Pending Cafe']);
        Vendor::factory()->rejected()->create(['business_name' => 'Rejected Cafe']);

        $response = $this->getJson('/api/customer/vendors')->assertOk();

        $names = collect($response->json('data'))->pluck('business_name');

        $this->assertTrue($names->contains('Approved Cafe'));
        $this->assertFalse($names->contains('Pending Cafe'));
        $this->assertFalse($names->contains('Rejected Cafe'));
    }

    public function test_directory_search_filters_by_name(): void
    {
        $this->actingAsCustomer();

        Vendor::factory()->approved()->create(['business_name' => 'The Coffee Bean']);
        Vendor::factory()->approved()->create(['business_name' => 'Burger House']);

        $response = $this->getJson('/api/customer/vendors?search=Coffee')->assertOk();

        $names = collect($response->json('data'))->pluck('business_name');
        $this->assertTrue($names->contains('The Coffee Bean'));
        $this->assertFalse($names->contains('Burger House'));
    }

    public function test_pending_vendor_is_not_viewable_by_customers(): void
    {
        $this->actingAsCustomer();

        $vendor = Vendor::factory()->pending()->create();

        $this->getJson("/api/customer/vendors/{$vendor->id}")->assertStatus(404);
    }

    public function test_customer_can_list_branches_for_a_vendor(): void
    {
        $this->actingAsCustomer();

        $vendor = Vendor::factory()->approved()->create();
        Branch::factory()->main()->for($vendor)->create(['name' => 'Main Branch']);
        Branch::factory()->for($vendor)->create(['name' => 'Second Branch']);

        $response = $this->getJson("/api/customer/vendors/{$vendor->id}/branches")->assertOk();

        $this->assertCount(2, $response->json('data'));
    }
}
