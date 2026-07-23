<?php

namespace Tests\Feature\Api\Vendor;

use App\Models\CustomerActivity;
use Tests\Feature\Api\ApiTestCase;

class AnalyticsAndActivityTest extends ApiTestCase
{
    public function test_vendor_dashboard_reports_todays_totals(): void
    {
        $vendor = $this->actingAsVendor();

        CustomerActivity::factory()->pointsEarned()->create([
            'vendor_id' => $vendor->id,
            'occurred_at' => now(),
            'amount' => 25,
        ]);

        $this->getJson('/api/vendor/dashboard')
            ->assertOk()
            ->assertJsonPath('data.today.points_added', 25);
    }

    public function test_vendor_can_view_analytics(): void
    {
        $vendor = $this->actingAsVendor();

        CustomerActivity::factory()->count(3)->pointsEarned()->create([
            'vendor_id' => $vendor->id,
            'occurred_at' => now(),
        ]);

        $this->getJson('/api/vendor/analytics')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'customers' => ['total', 'change_pct', 'daily_series'],
                    'redemption' => ['top_promotions', 'total_redemptions', 'daily_series'],
                ],
            ]);
    }

    public function test_vendor_can_view_activity_log_filtered_by_type(): void
    {
        $vendor = $this->actingAsVendor();

        CustomerActivity::factory()->pointsEarned()->create(['vendor_id' => $vendor->id]);
        CustomerActivity::factory()->stampEarned()->create(['vendor_id' => $vendor->id]);

        $response = $this->getJson('/api/vendor/activities?type=points_earned')->assertOk();

        $this->assertCount(1, $response->json('data'));
        $this->assertSame('points_earned', $response->json('data.0.type'));
    }
}
