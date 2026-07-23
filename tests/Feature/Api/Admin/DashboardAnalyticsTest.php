<?php

namespace Tests\Feature\Api\Admin;

use App\Models\Customer;
use App\Models\Vendor;
use Tests\Feature\Api\ApiTestCase;

class DashboardAnalyticsTest extends ApiTestCase
{
    public function test_admin_dashboard_reports_platform_totals(): void
    {
        $this->actingAsAdmin();
        Vendor::factory()->approved()->create();
        Vendor::factory()->pending()->create();
        Vendor::factory()->suspended()->create();
        Customer::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/dashboard')->assertOk();

        $response->assertJsonPath('data.today.total_vendors', 3);
        $response->assertJsonPath('data.today.pending_approvals', 1);
        $response->assertJsonPath('data.today.suspended_vendors', 1);
        $response->assertJsonPath('data.platform_activity.total_customers', 3);
    }

    public function test_admin_can_view_platform_analytics(): void
    {
        $this->actingAsAdmin();
        Vendor::factory()->approved()->create();
        Customer::factory()->count(2)->create();

        $this->getJson('/api/admin/analytics?period=month')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'total_customers',
                    'customer_growth_pct',
                    'active_vendors',
                    'vendor_growth_pct',
                    'vendor_growth_series',
                    'customer_growth_series',
                    'stamps_issued',
                    'points_issued',
                ],
            ]);
    }
}
