<?php

namespace Tests\Feature\Api\Vendor;

use App\Models\Branch;
use Tests\Feature\Api\ApiTestCase;

class BranchTest extends ApiTestCase
{
    public function test_first_branch_created_is_automatically_main(): void
    {
        $vendor = $this->actingAsVendor();

        $response = $this->postJson('/api/vendor/branches', [
            'name' => 'TK Avenue Branch',
            'latitude' => 11.5564,
            'longitude' => 104.9282,
        ])->assertCreated();

        $response->assertJsonPath('data.is_main', true);
    }

    public function test_setting_a_new_main_branch_unsets_the_previous_one(): void
    {
        $vendor = $this->actingAsVendor();
        $first = Branch::factory()->main()->for($vendor)->create();

        $this->postJson('/api/vendor/branches', [
            'name' => 'New Main Branch',
            'latitude' => 11.5564,
            'longitude' => 104.9282,
            'is_main' => true,
        ])->assertCreated()->assertJsonPath('data.is_main', true);

        $this->assertFalse($first->fresh()->is_main);
    }

    public function test_vendor_can_list_own_branches(): void
    {
        $vendor = $this->actingAsVendor();
        Branch::factory()->count(3)->for($vendor)->create();

        $this->getJson('/api/vendor/branches')->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_vendor_can_update_own_branch(): void
    {
        $vendor = $this->actingAsVendor();
        $branch = Branch::factory()->main()->for($vendor)->create();

        $this->putJson("/api/vendor/branches/{$branch->id}", ['name' => 'Updated Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Name');
    }

    public function test_branch_creation_requires_a_name_and_location(): void
    {
        $this->actingAsVendor();

        $this->postJson('/api/vendor/branches', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'latitude', 'longitude']);
    }
}
