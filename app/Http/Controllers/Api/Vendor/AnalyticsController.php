<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\CustomerActivity;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function show(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        $days = min(90, max(1, $request->integer('days', 7)));
        $from = Carbon::now()->subDays($days - 1)->startOfDay();
        $previousFrom = $from->copy()->subDays($days);

        $activities = CustomerActivity::where('vendor_id', $vendor->id)
            ->where('occurred_at', '>=', $from)
            ->get();

        $previousActivities = CustomerActivity::where('vendor_id', $vendor->id)
            ->whereBetween('occurred_at', [$previousFrom, $from])
            ->get();

        $totalCustomers = $activities->pluck('customer_id')->unique()->count();
        $previousCustomers = $previousActivities->pluck('customer_id')->unique()->count();

        $dailySeries = collect(range(0, $days - 1))->map(function (int $offset) use ($from, $activities) {
            $day = $from->copy()->addDays($offset);
            $dayActivities = $activities->filter(fn (CustomerActivity $a) => Carbon::parse($a->occurred_at)->isSameDay($day));

            return [
                'label' => $day->format('M j'),
                'customers' => $dayActivities->pluck('customer_id')->unique()->count(),
                'points_added' => (int) $dayActivities->where('type', 'points_earned')->sum('amount'),
                'points_deducted' => (int) abs($dayActivities->where('type', 'points_deducted')->sum('amount')),
                'stamps_added' => (int) $dayActivities->where('type', 'stamp_earned')->sum('amount'),
                'stamps_redeemed' => (int) $dayActivities->where('type', 'reward_redeemed')->count(),
            ];
        })->values();

        $topPromotions = Promotion::where('vendor_id', $vendor->id)
            ->withCount(['rewardRedemptions as redemptions_count' => function ($query) use ($from) {
                $query->where('status', 'redeemed')->where('redeemed_at', '>=', $from);
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
            ->count();

        $previousRedemptions = RewardRedemption::where('vendor_id', $vendor->id)
            ->where('status', 'redeemed')
            ->whereBetween('redeemed_at', [$previousFrom, $from])
            ->count();

        return response()->json([
            'data' => [
                'period_days' => $days,
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
