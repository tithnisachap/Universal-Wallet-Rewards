<?php

namespace Tests\Feature\Api\Admin;

use App\Models\Vendor;
use Tests\Feature\Api\ApiTestCase;

class VendorReviewTest extends ApiTestCase
{
    public function test_admin_can_list_pending_applications(): void
    {
        $this->actingAsAdmin();
        Vendor::factory()->pending()->create();
        Vendor::factory()->approved()->create();

        $response = $this->getJson('/api/admin/vendors?status=pending')->assertOk();

        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_can_list_history(): void
    {
        $this->actingAsAdmin();
        Vendor::factory()->pending()->create();
        Vendor::factory()->approved()->create();
        Vendor::factory()->rejected()->create();

        $response = $this->getJson('/api/admin/vendors?status=history')->assertOk();

        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_can_approve_a_pending_vendor(): void
    {
        $admin = $this->actingAsAdmin();
        $vendor = Vendor::factory()->pending()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/review", [
            'decision' => 'approved',
        ])->assertOk()->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'approved',
            'reviewed_by' => $admin->id,
        ]);
    }

    public function test_admin_can_reject_a_pending_vendor_with_a_note(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->pending()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/review", [
            'decision' => 'rejected',
            'review_note' => 'Address could not be verified.',
        ])->assertOk()->assertJsonPath('data.status', 'rejected');

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'rejected',
            'review_note' => 'Address could not be verified.',
        ]);
    }

    public function test_admin_cannot_review_an_already_approved_vendor(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->approved()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/review", [
            'decision' => 'approved',
        ])->assertStatus(422);
    }

    public function test_review_requires_a_valid_decision(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->pending()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/review", [
            'decision' => 'maybe',
        ])->assertStatus(422)->assertJsonValidationErrors('decision');
    }

    public function test_admin_can_suspend_an_approved_vendor(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->approved()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/suspend")
            ->assertOk()
            ->assertJsonPath('data.status', 'suspended');
    }

    public function test_admin_can_reinstate_a_suspended_vendor(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->approved()->suspended()->create();

        $this->postJson("/api/admin/vendors/{$vendor->id}/reinstate")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');
    }

    public function test_vendor_review_endpoint_returns_full_business_details(): void
    {
        $this->actingAsAdmin();
        $vendor = Vendor::factory()->pending()->create(['business_name' => 'Sweet Bites Bakery']);

        $this->getJson("/api/admin/vendors/{$vendor->id}")
            ->assertOk()
            ->assertJsonPath('data.business_name', 'Sweet Bites Bakery')
            ->assertJsonPath('data.address', $vendor->address);
    }
}
