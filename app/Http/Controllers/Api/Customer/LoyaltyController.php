<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerActivityResource;
use App\Http\Resources\PromotionResource;
use App\Models\CustomerLoyalty;
use App\Models\Promotion;
use App\Models\Vendor;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * The "Branch Loyalty" screen: points balance, stamp progress toward
     * the active stamp promotion, and a short recent-activity feed.
     */
    public function show(Request $request, Vendor $vendor)
    {
        abort_if($vendor->status !== 'approved', 404);

        $customer = $request->user()->customer;

        $loyalty = CustomerLoyalty::firstOrNew(
            ['customer_id' => $customer->id, 'vendor_id' => $vendor->id],
            ['points_balance' => 0, 'stamps_count' => 0]
        );

        $activeStampPromotion = Promotion::where('vendor_id', $vendor->id)
            ->where('type', 'stamps')
            ->where('is_active', true)
            ->first();

        $recentActivity = $customer->activities()
            ->where('vendor_id', $vendor->id)
            ->orderByDesc('occurred_at')
            ->limit(3)
            ->get();

        return response()->json([
            'data' => [
                'points_balance' => $loyalty->points_balance,
                'stamps_count' => $loyalty->stamps_count,
                'active_stamp_promotion' => $activeStampPromotion
                    ? new PromotionResource($activeStampPromotion)
                    : null,
                'can_claim_reward' => $activeStampPromotion
                    && $loyalty->stamps_count >= $activeStampPromotion->required_amount,
                'recent_activity' => CustomerActivityResource::collection($recentActivity),
            ],
        ]);
    }
}
