<?php

namespace Tests\Feature\Api\Vendor;

use App\Models\Customer;
use App\Models\CustomerLoyalty;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use App\Models\Vendor;
use Tests\Feature\Api\ApiTestCase;

class TransactionTest extends ApiTestCase
{
    public function test_vendor_can_scan_a_customer_qr_code(): void
    {
        $vendor = $this->actingAsVendor();
        $customer = Customer::factory()->create();
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 50,
            'stamps_count' => 3,
        ]);

        $this->postJson('/api/vendor/scan', ['code' => $customer->customer_code])
            ->assertOk()
            ->assertJsonPath('data.customer_id', $customer->id)
            ->assertJsonPath('data.points_balance', 50)
            ->assertJsonPath('data.stamps_count', 3);
    }

    public function test_scanning_an_unknown_code_fails_validation(): void
    {
        $this->actingAsVendor();

        $this->postJson('/api/vendor/scan', ['code' => 'DOES-NOT-EXIST'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }

    public function test_vendor_can_add_stamps_to_a_customer(): void
    {
        $vendor = $this->actingAsVendor();
        $customer = Customer::factory()->create();

        $this->postJson('/api/vendor/transactions/stamps', [
            'customer_id' => $customer->id,
            'stamps' => 1,
        ])->assertCreated()->assertJsonPath('data.type', 'stamp_earned');

        $this->assertDatabaseHas('customer_loyalty', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'stamps_count' => 1,
        ]);
    }

    public function test_vendor_can_add_points_to_a_customer(): void
    {
        $vendor = $this->actingAsVendor();
        $customer = Customer::factory()->create();

        $this->postJson('/api/vendor/transactions/points', [
            'customer_id' => $customer->id,
            'points' => 25,
        ])->assertCreated();

        $this->assertDatabaseHas('customer_loyalty', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 25,
        ]);
    }

    public function test_vendor_can_deduct_points_within_balance(): void
    {
        $vendor = $this->actingAsVendor();
        $customer = Customer::factory()->create();
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 150,
            'stamps_count' => 0,
        ]);

        $this->postJson('/api/vendor/transactions/points/deduct', [
            'customer_id' => $customer->id,
            'points' => 150,
        ])->assertCreated()->assertJsonPath('data.amount', -150);

        $this->assertDatabaseHas('customer_loyalty', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
        ]);
    }

    public function test_vendor_cannot_deduct_more_points_than_balance(): void
    {
        $vendor = $this->actingAsVendor();
        $customer = Customer::factory()->create();
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 50,
            'stamps_count' => 0,
        ]);

        $this->postJson('/api/vendor/transactions/points/deduct', [
            'customer_id' => $customer->id,
            'points' => 100,
        ])->assertStatus(422)->assertJsonValidationErrors('points');

        $this->assertDatabaseHas('customer_loyalty', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 50,
        ]);
    }

    public function test_vendor_can_redeem_a_valid_pending_code(): void
    {
        $vendor = $this->actingAsVendor();
        $promotion = Promotion::factory()->stamps()->for($vendor)->create(['required_amount' => 10]);
        $customer = Customer::factory()->create();
        CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 10,
        ]);

        $redemption = RewardRedemption::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'promotion_id' => $promotion->id,
            'code' => 'VALIDCODE123',
            'status' => 'pending',
            'expires_at' => now()->addMinutes(5),
        ]);

        $this->postJson('/api/vendor/redemptions/redeem', ['code' => 'VALIDCODE123'])
            ->assertOk()
            ->assertJsonPath('data.status', 'redeemed');

        $this->assertDatabaseHas('customer_loyalty', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'stamps_count' => 0,
        ]);

        $this->assertDatabaseHas('customer_activities', [
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'type' => 'reward_redeemed',
            'amount' => -10,
        ]);
    }

    public function test_vendor_cannot_redeem_an_already_used_code(): void
    {
        $vendor = $this->actingAsVendor();
        $promotion = Promotion::factory()->stamps()->for($vendor)->create();
        $redemption = RewardRedemption::factory()->redeemed()->create([
            'vendor_id' => $vendor->id,
            'promotion_id' => $promotion->id,
            'code' => 'USEDCODE123',
        ]);

        $this->postJson('/api/vendor/redemptions/redeem', ['code' => 'USEDCODE123'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }

    public function test_vendor_cannot_redeem_an_expired_code(): void
    {
        $vendor = $this->actingAsVendor();
        $promotion = Promotion::factory()->stamps()->for($vendor)->create();
        RewardRedemption::create([
            'customer_id' => Customer::factory()->create()->id,
            'vendor_id' => $vendor->id,
            'promotion_id' => $promotion->id,
            'code' => 'EXPIREDCODE1',
            'status' => 'pending',
            'expires_at' => now()->subMinutes(1),
        ]);

        $this->postJson('/api/vendor/redemptions/redeem', ['code' => 'EXPIREDCODE1'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('code');

        $this->assertDatabaseHas('reward_redemptions', [
            'code' => 'EXPIREDCODE1',
            'status' => 'expired',
        ]);
    }

    public function test_vendor_cannot_redeem_a_code_belonging_to_another_vendor(): void
    {
        $this->actingAsVendor();
        $otherVendor = Vendor::factory()->approved()->create();
        $promotion = Promotion::factory()->stamps()->for($otherVendor)->create();

        RewardRedemption::create([
            'customer_id' => Customer::factory()->create()->id,
            'vendor_id' => $otherVendor->id,
            'promotion_id' => $promotion->id,
            'code' => 'OTHERVENDOR1',
            'status' => 'pending',
            'expires_at' => now()->addMinutes(5),
        ]);

        $this->postJson('/api/vendor/redemptions/redeem', ['code' => 'OTHERVENDOR1'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('code');
    }
}
