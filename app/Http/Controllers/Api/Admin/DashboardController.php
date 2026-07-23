<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerActivity;
use App\Models\Vendor;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function show()
    {
        $statusCounts = Vendor::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalVendors = (int) $statusCounts->sum();

        $vendorGrowth = collect(range(4, 0))->map(function (int $weeksAgo) {
            $weekStart = Carbon::now()->subWeeks($weeksAgo)->startOfWeek();
            $weekEnd = $weekStart->copy()->endOfWeek();

            return [
                'label' => $weekStart->format('M j'),
                'value' => Vendor::whereBetween('created_at', [$weekStart, $weekEnd])->count(),
            ];
        })->values();

        return response()->json([
            'data' => [
                'today' => [
                    'total_vendors' => $totalVendors,
                    'pending_approvals' => (int) ($statusCounts['pending'] ?? 0),
                    'stamps_redeemed' => (int) CustomerActivity::where('type', 'reward_redeemed')->count(),
                    'suspended_vendors' => (int) ($statusCounts['suspended'] ?? 0),
                ],
                'vendor_growth' => $vendorGrowth,
                'vendor_status' => [
                    'total' => $totalVendors,
                    'active' => (int) ($statusCounts['approved'] ?? 0),
                    'pending' => (int) ($statusCounts['pending'] ?? 0),
                    'rejected' => (int) ($statusCounts['rejected'] ?? 0),
                    'suspended' => (int) ($statusCounts['suspended'] ?? 0),
                ],
                'platform_activity' => [
                    'total_customers' => Customer::count(),
                    'stamps_issued' => (int) CustomerActivity::where('type', 'stamp_earned')->sum('amount'),
                    'points_issued' => (int) CustomerActivity::where('type', 'points_earned')->sum('amount'),
                    'rewards_redeemed' => (int) CustomerActivity::where('type', 'reward_redeemed')->count(),
                ],
            ],
        ]);
    }
}
