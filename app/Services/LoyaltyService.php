<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\CustomerActivity;
use App\Models\CustomerLoyalty;
use App\Models\Promotion;
use App\Models\RewardRedemption;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Owns every operation that mutates a customer's points/stamps balance.
 * Every public method here runs inside a single DB transaction with a
 * row lock on the customer_loyalty account, so concurrent scans of the
 * same customer at the same vendor cannot corrupt the balance.
 */
class LoyaltyService
{
    public function addStamps(Vendor $vendor, Customer $customer, int $stamps, ?Branch $branch = null): CustomerActivity
    {
        return DB::transaction(function () use ($vendor, $customer, $stamps, $branch) {
            $loyalty = $this->lockLoyaltyAccount($customer, $vendor);
            $loyalty->increment('stamps_count', $stamps);

            return CustomerActivity::create([
                'customer_id' => $customer->id,
                'vendor_id' => $vendor->id,
                'branch_id' => $branch?->id,
                'promotion_id' => $this->activeStampPromotion($vendor)?->id,
                'type' => 'stamp_earned',
                'amount' => $stamps,
                'occurred_at' => now(),
            ]);
        });
    }

    public function addPoints(Vendor $vendor, Customer $customer, int $points, ?Branch $branch = null): CustomerActivity
    {
        return DB::transaction(function () use ($vendor, $customer, $points, $branch) {
            $loyalty = $this->lockLoyaltyAccount($customer, $vendor);
            $loyalty->increment('points_balance', $points);

            return CustomerActivity::create([
                'customer_id' => $customer->id,
                'vendor_id' => $vendor->id,
                'branch_id' => $branch?->id,
                'type' => 'points_earned',
                'amount' => $points,
                'occurred_at' => now(),
            ]);
        });
    }

    public function deductPoints(Vendor $vendor, Customer $customer, int $points, ?Branch $branch = null): CustomerActivity
    {
        return DB::transaction(function () use ($vendor, $customer, $points, $branch) {
            $loyalty = $this->lockLoyaltyAccount($customer, $vendor);

            if ($loyalty->points_balance < $points) {
                throw ValidationException::withMessages([
                    'points' => 'This customer does not have enough points for this deduction.',
                ]);
            }

            $loyalty->decrement('points_balance', $points);

            return CustomerActivity::create([
                'customer_id' => $customer->id,
                'vendor_id' => $vendor->id,
                'branch_id' => $branch?->id,
                'type' => 'points_deducted',
                'amount' => -$points,
                'occurred_at' => now(),
            ]);
        });
    }

    /**
     * Customer-initiated: generates a timed QR code once the active stamp
     * card is full. Returns the existing pending redemption if one was
     * already generated and hasn't expired yet, instead of minting a new
     * code every time the screen is opened.
     */
    public function claimStampReward(Vendor $vendor, Customer $customer): RewardRedemption
    {
        return DB::transaction(function () use ($vendor, $customer) {
            $loyalty = $this->lockLoyaltyAccount($customer, $vendor);
            $promotion = $this->activeStampPromotion($vendor);

            if (! $promotion) {
                throw ValidationException::withMessages([
                    'promotion' => 'This vendor has no active stamp promotion right now.',
                ]);
            }

            if ($loyalty->stamps_count < $promotion->required_amount) {
                throw ValidationException::withMessages([
                    'stamps' => 'Not enough stamps collected yet.',
                ]);
            }

            $existing = RewardRedemption::where('customer_id', $customer->id)
                ->where('promotion_id', $promotion->id)
                ->where('status', 'pending')
                ->where('expires_at', '>', now())
                ->first();

            if ($existing) {
                return $existing;
            }

            return RewardRedemption::create([
                'customer_id' => $customer->id,
                'vendor_id' => $vendor->id,
                'promotion_id' => $promotion->id,
                'code' => Str::upper(Str::random(12)),
                'status' => 'pending',
                'expires_at' => now()->addMinutes(5),
            ]);
        });
    }

    /**
     * Vendor-initiated: scans/confirms a customer's redemption code,
     * consumes the stamps, and closes the redemption out.
     */
    public function redeemCode(Vendor $vendor, string $code): RewardRedemption
    {
        // These checks are deliberately outside the transaction below: the
        // "mark expired" write in particular must survive even though the
        // very next line throws, and a throw inside DB::transaction() rolls
        // back everything the closure did.
        $redemption = RewardRedemption::where('vendor_id', $vendor->id)
            ->where('code', $code)
            ->first();

        if (! $redemption) {
            throw ValidationException::withMessages(['code' => 'This code is invalid for your business.']);
        }

        if ($redemption->status === 'redeemed') {
            throw ValidationException::withMessages(['code' => 'This code has already been used.']);
        }

        if ($redemption->status === 'expired' || $redemption->expires_at->isPast()) {
            if ($redemption->status !== 'expired') {
                $redemption->update(['status' => 'expired']);
            }

            throw ValidationException::withMessages(['code' => 'This code has expired.']);
        }

        return DB::transaction(function () use ($vendor, $redemption) {
            // Re-fetch under a row lock in case another request redeemed or
            // expired this exact code between the checks above and now.
            $redemption = RewardRedemption::where('id', $redemption->id)->lockForUpdate()->first();

            if ($redemption->status !== 'pending' || $redemption->expires_at->isPast()) {
                throw ValidationException::withMessages(['code' => 'This code is no longer redeemable.']);
            }

            $promotion = $redemption->promotion;
            $loyalty = $this->lockLoyaltyAccount($redemption->customer, $vendor);

            if ($loyalty->stamps_count < $promotion->required_amount) {
                throw ValidationException::withMessages([
                    'code' => 'This customer no longer has enough stamps for this reward.',
                ]);
            }

            $loyalty->decrement('stamps_count', $promotion->required_amount);

            $redemption->update([
                'status' => 'redeemed',
                'redeemed_at' => now(),
            ]);

            CustomerActivity::create([
                'customer_id' => $redemption->customer_id,
                'vendor_id' => $vendor->id,
                'promotion_id' => $promotion->id,
                'type' => 'reward_redeemed',
                'amount' => -$promotion->required_amount,
                'note' => $promotion->title,
                'occurred_at' => now(),
            ]);

            return $redemption->fresh(['promotion']);
        });
    }

    private function lockLoyaltyAccount(Customer $customer, Vendor $vendor): CustomerLoyalty
    {
        $loyalty = CustomerLoyalty::where('customer_id', $customer->id)
            ->where('vendor_id', $vendor->id)
            ->lockForUpdate()
            ->first();

        return $loyalty ?? CustomerLoyalty::create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'points_balance' => 0,
            'stamps_count' => 0,
        ]);
    }

    private function activeStampPromotion(Vendor $vendor): ?Promotion
    {
        return Promotion::where('vendor_id', $vendor->id)
            ->where('type', 'stamps')
            ->where('is_active', true)
            ->first();
    }
}
