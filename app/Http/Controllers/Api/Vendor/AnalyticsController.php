<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\CustomerActivity;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use App\Services\VendorAccessResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function __construct(private readonly VendorAccessResolver $access) {}

    /**
     * Supported duration presets. Short ranges are bucketed by day; the
     * multi-year ranges are bucketed by month so the response stays a
     * reasonable size and the chart stays readable.
     */
    private const RANGES = [
        '7d' => ['unit' => 'day', 'count' => 7],
        '30d' => ['unit' => 'day', 'count' => 30],
        '2y' => ['unit' => 'month', 'count' => 24],
        '5y' => ['unit' => 'month', 'count' => 60],
        '10y' => ['unit' => 'month', 'count' => 120],
    ];

    public function show(Request $request)
    {
        $user = $request->user();
        $vendor = $this->access->vendorFor($user);

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        $isBranchStaff = $user->role === 'branch_staff';
        $forcedBranchId = $isBranchStaff
            ? $this->access->branchFor($user, $vendor, null)?->id
            : null;

        $range = $request->string('range', '7d')->toString();
        $config = self::RANGES[$range] ?? self::RANGES['7d'];
        $unit = $config['unit'];
        $count = $config['count'];

        if ($unit === 'day') {
            $from = Carbon::now()->subDays($count - 1)->startOfDay();
            $previousFrom = $from->copy()->subDays($count);
        } else {
            $from = Carbon::now()->subMonthsNoOverflow($count - 1)->startOfMonth();
            $previousFrom = $from->copy()->subMonthsNoOverflow($count);
        }

        $activities = CustomerActivity::where('vendor_id', $vendor->id)
            ->where('occurred_at', '>=', $from)
            ->when($forcedBranchId, fn ($q) => $q->where('branch_id', $forcedBranchId))
            ->get();

        $previousActivities = CustomerActivity::where('vendor_id', $vendor->id)
            ->whereBetween('occurred_at', [$previousFrom, $from])
            ->when($forcedBranchId, fn ($q) => $q->where('branch_id', $forcedBranchId))
            ->get();

        $totalCustomers = $activities->pluck('customer_id')->unique()->count();
        $previousCustomers = $previousActivities->pluck('customer_id')->unique()->count();

        $dailySeries = collect(range(0, $count - 1))->map(function (int $offset) use ($from, $activities, $unit) {
            if ($unit === 'day') {
                $periodStart = $from->copy()->addDays($offset);
                $label = $periodStart->format('M j');
                $periodActivities = $activities->filter(
                    fn (CustomerActivity $a) => Carbon::parse($a->occurred_at)->isSameDay($periodStart)
                );
            } else {
                $periodStart = $from->copy()->addMonthsNoOverflow($offset);
                $label = $periodStart->format('M Y');
                $periodActivities = $activities->filter(
                    fn (CustomerActivity $a) => Carbon::parse($a->occurred_at)->format('Y-m') === $periodStart->format('Y-m')
                );
            }

            return [
                'label' => $label,
                'customers' => $periodActivities->pluck('customer_id')->unique()->count(),
                'points_added' => (int) $periodActivities->where('type', 'points_earned')->sum('amount'),
                'points_deducted' => (int) abs($periodActivities->where('type', 'points_deducted')->sum('amount')),
                'stamps_added' => (int) $periodActivities->where('type', 'stamp_earned')->sum('amount'),
                'stamps_redeemed' => (int) $periodActivities->where('type', 'reward_redeemed')->count(),
            ];
        })->values();

        $topPromotions = Promotion::where('vendor_id', $vendor->id)
            ->withCount(['rewardRedemptions as redemptions_count' => function ($query) use ($from, $forcedBranchId) {
                $query->where('status', 'redeemed')->where('redeemed_at', '>=', $from);

                if ($forcedBranchId) {
                    $query->where('branch_id', $forcedBranchId);
                }
            }])
            ->orderByDesc('redemptions_count')
            ->limit(3)
            ->get()
            ->filter(fn (Promotion $promotion) => $promotion->redemptions_count > 0)
            ->map(fn (Promotion $promotion, int $i) => [
                'rank' => $i + 1,
                'title' => $promotion->title,
                'redeemed' => $promotion->redemptions_count,
            ])
            ->values();

        $totalRedemptions = RewardRedemption::where('vendor_id', $vendor->id)
            ->where('status', 'redeemed')
            ->where('redeemed_at', '>=', $from)
            ->when($forcedBranchId, fn ($q) => $q->where('branch_id', $forcedBranchId))
            ->count();

        $previousRedemptions = RewardRedemption::where('vendor_id', $vendor->id)
            ->where('status', 'redeemed')
            ->whereBetween('redeemed_at', [$previousFrom, $from])
            ->when($forcedBranchId, fn ($q) => $q->where('branch_id', $forcedBranchId))
            ->count();

        return response()->json([
            'data' => [
                'range' => $range,
                'customers' => [
                    'total' => $totalCustomers,
                    'change_pct' => $this->percentChange($previousCustomers, $totalCustomers),
                    'points_added' => (int) $activities->where('type', 'points_earned')->sum('amount'),
                    'points_deducted' => (int) abs($activities->where('type', 'points_deducted')->sum('amount')),
                    'stamps_added' => (int) $activities->where('type', 'stamp_earned')->sum('amount'),
                    'stamps_redeemed' => (int) $activities->where('type', 'reward_redeemed')->count(),
                    'daily_series' => $dailySeries,
                ],
                'redemption' => [
                    'top_promotions' => $topPromotions,
                    'total_redemptions' => $totalRedemptions,
                    'change_pct' => $this->percentChange($previousRedemptions, $totalRedemptions),
                    'daily_series' => $dailySeries->map(fn ($day) => [
                        'label' => $day['label'],
                        'value' => $day['stamps_redeemed'],
                    ]),
                ],
            ],
        ]);
    }

    private function percentChange(int $previous, int $current): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
