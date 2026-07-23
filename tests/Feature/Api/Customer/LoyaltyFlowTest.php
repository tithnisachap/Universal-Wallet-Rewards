<?php

namespace Tests\Feature\Api\Customer;

use App\Models\CustomerLoyalty;
use App\Models\Promotion;
use App\Models\Vendor;
use Tests\Feature\Api\ApiTestCase;

class LoyaltyFlowTest extends ApiTestCase
{
    public function test_customer_can_view_loyalty_summary_for_a_vendor(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();
        Promotion::factory()->stamps()->for($vendor)->create(['required_amount' => 10]);

        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 125,
            'stamps_count' => 6,
        ]);

        $this->getJson("/api/customer/vendors/{$vendor->id}/loyalty")
            ->assertOk()
            ->assertJsonPath('data.points_balance', 125)
            ->assertJsonPath('data.stamps_count', 6)
            ->assertJsonPath('data.can_claim_reward', false);
    }

    public function test_customer_can_claim_reward_once_stamp_card_is_full(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();
        $promotion = Promotion::factory()->stamps()->for($vendor)->create(['required_amount' => 10]);

        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 10,
        ]);

        $response = $this->postJson("/api/customer/vendors/{$vendor->id}/redemptions")
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.promotion.id', $promotion->id);

        $this->assertDatabaseHas('reward_redemptions', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'code' => $response->json('data.code'),
        ]);
    }

    public function test_claiming_reward_a_second_time_returns_the_same_pending_code(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();
        Promotion::factory()->stamps()->for($vendor)->create(['required_amount' => 10]);

        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 10,
        ]);

        $first = $this->postJson("/api/customer/vendors/{$vendor->id}/redemptions")->json('data.code');
        $second = $this->postJson("/api/customer/vendors/{$vendor->id}/redemptions")->json('data.code');

        $this->assertSame($first, $second);
        $this->assertDatabaseCount('reward_redemptions', 1);
    }

    public function test_customer_cannot_claim_reward_without_enough_stamps(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();
        Promotion::factory()->stamps()->for($vendor)->create(['required_amount' => 10]);

        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 4,
        ]);

        $this->postJson("/api/customer/vendors/{$vendor->id}/redemptions")
            ->assertStatus(422)
            ->assertJsonValidationErrors('stamps');
    }

    public function test_customer_cannot_claim_reward_when_vendor_has_no_active_stamp_promotion(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();

        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 20,
        ]);

        $this->postJson("/api/customer/vendors/{$vendor->id}/redemptions")
            ->assertStatus(422)
            ->assertJsonValidationErrors('promotion');
    }

    public function test_customer_can_view_full_activity_history_for_a_vendor(): void
    {
        $customer = $this->actingAsCustomer();
        $vendor = Vendor::factory()->approved()->create();

        \App\Models\CustomerActivity::factory()->count(5)->pointsEarned()->create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
        ]);

        $this->getJson("/api/customer/vendors/{$vendor->id}/activities")
            ->assertOk()
            ->assertJsonCount(5, 'data');
    }
}
