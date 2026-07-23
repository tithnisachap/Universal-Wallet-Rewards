<?php

namespace Tests\Feature\Api\Vendor;

use App\Models\Promotion;
use Tests\Feature\Api\ApiTestCase;

class PromotionTest extends ApiTestCase
{
    public function test_vendor_can_create_a_stamp_promotion(): void
    {
        $this->actingAsVendor();

        $this->postJson('/api/vendor/promotions', [
            'type' => 'stamps',
            'category' => 'Drinks',
            'title' => 'Free Coffee (Big Size)',
            'description' => 'Get 1 free coffee (Big size)',
            'required_amount' => 10,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
        ])->assertCreated()->assertJsonPath('data.display_status', 'active');
    }

    public function test_vendor_cannot_have_two_active_stamp_promotions(): void
    {
        $vendor = $this->actingAsVendor();
        Promotion::factory()->stamps()->for($vendor)->create(['is_active' => true]);

        $this->postJson('/api/vendor/promotions', [
            'type' => 'stamps',
            'category' => 'Drinks',
            'title' => 'Another Stamp Promo',
            'required_amount' => 8,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
        ])->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_vendor_can_have_unlimited_active_point_promotions(): void
    {
        $vendor = $this->actingAsVendor();
        Promotion::factory()->points()->for($vendor)->create(['is_active' => true]);

        $this->postJson('/api/vendor/promotions', [
            'type' => 'points',
            'category' => 'Discount',
            'title' => 'Second Points Promo',
            'required_amount' => 100,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
        ])->assertCreated();

        $this->assertDatabaseCount('promotions', 2);
    }

    public function test_deactivating_a_stamp_promotion_frees_up_the_slot(): void
    {
        $vendor = $this->actingAsVendor();
        $promotion = Promotion::factory()->stamps()->for($vendor)->create(['is_active' => true]);

        $this->putJson("/api/vendor/promotions/{$promotion->id}", ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->postJson('/api/vendor/promotions', [
            'type' => 'stamps',
            'category' => 'Drinks',
            'title' => 'Replacement Stamp Promo',
            'required_amount' => 10,
            'starts_at' => '2026-01-01',
            'ends_at' => '2026-12-31',
        ])->assertCreated();
    }

    public function test_vendor_cannot_edit_another_vendors_promotion(): void
    {
        $this->actingAsVendor();
        $otherPromotion = Promotion::factory()->create();

        $this->putJson("/api/vendor/promotions/{$otherPromotion->id}", ['title' => 'Hijacked'])
            ->assertStatus(403);
    }

    public function test_promotion_end_date_must_be_after_start_date(): void
    {
        $this->actingAsVendor();

        $this->postJson('/api/vendor/promotions', [
            'type' => 'points',
            'category' => 'Discount',
            'title' => 'Bad Dates',
            'required_amount' => 100,
            'starts_at' => '2026-06-01',
            'ends_at' => '2026-01-01',
        ])->assertStatus(422)->assertJsonValidationErrors('ends_at');
    }
}
