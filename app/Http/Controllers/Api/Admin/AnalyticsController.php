<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerActivity;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    private const PERIOD_DAYS = [
        'week' => 7,
        'month' => 30,
        'year' => 365,
    ];

    public function show(Request $request)
    {
        $period = $request->string('period', 'month')->toString();
        $days = self::PERIOD_DAYS[$period] ?? self::PERIOD_DAYS['month'];

        $from = Carbon::now()->subDays($days - 1)->startOfDay();
        $previousFrom = $from->copy()->subDays($days);

        $totalCustomers = Customer::where('created_at', '>=', $from)->count()
            + Customer::where('created_at', '<', $from)->count();
        $newCustomers = Customer::where('created_at', '>=', $from)->count();
        $previousNewCustomers = Customer::whereBetween('created_at', [$previousFrom, $from])->count();

        $activeVendors = Vendor::where('status', 'approved')->count();
        $newVendors = Vendor::where('status', 'approved')->where('reviewed_at', '>=', $from)->count();
        $previousNewVendors = Vendor::where('status', 'approved')->whereBetween('reviewed_at', [$previousFrom, $from])->count();

        $bucketCount = min(12, $days);
        $bucketSizeDays = max(1, (int) ceil($days / $bucketCount));

        $vendorGrowthSeries = $this->series($from, $bucketCount, $bucketSizeDays, fn (Carbon $start, Carbon $end) => Vendor::whereBetween('created_at', [$start, $end])->count());

        $customerGrowthSeries = $this->series($from, $bucketCount, $bucketSizeDays, fn (Carbon $start, Carbon $end) => Customer::whereBetween('created_at', [$start, $end])->count());

        return response()->json([
            'data' => [
                'period' => $period,
                'total_customers' => Customer::count(),
                'customer_growth_pct' => $this->percentChange($previousNewCustomers, $newCustomers),
                'active_vendors' => $activeVendors,
                'vendor_growth_pct' => $this->percentChange($previousNewVendors, $newVendors),
                'vendor_growth_series' => $vendorGrowthSeries,
                'customer_growth_series' => $customerGrowthSeries,
                'stamps_issued' => (int) CustomerActivity::where('type', 'stamp_earned')->where('occurred_at', '>=', $from)->sum('amount'),
                'points_issued' => (int) CustomerActivity::where('type', 'points_earned')->where('occurred_at', '>=', $from)->sum('amount'),
            ],
        ]);
    }

    private function series(Carbon $from, int $bucketCount, int $bucketSizeDays, \Closure $counter)
    {
        return collect(range(0, $bucketCount - 1))->map(function (int $i) use ($from, $bucketSizeDays, $counter) {
            $start = $from->copy()->addDays($i * $bucketSizeDays);
            $end = $start->copy()->addDays($bucketSizeDays)->subSecond();

            return [
                'label' => $start->format('M j'),
                'value' => $counter($start, $end),
            ];
        })->values();
    }

    private function percentChange(int $previous, int $current): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
