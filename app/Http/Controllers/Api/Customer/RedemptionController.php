<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\RewardRedemptionResource;
use App\Models\Vendor;
use App\Services\LoyaltyService;
use Illuminate\Http\Request;

class RedemptionController extends Controller
{
    public function __construct(private readonly LoyaltyService $loyaltyService) {}

    /**
     * "Claim Reward": generates (or returns the still-valid) timed QR code
     * once the customer's stamp card is full.
     */
    public function store(Request $request, Vendor $vendor)
    {
        abort_if($vendor->status !== 'approved', 404);

        $customer = $request->user()->customer;

        $redemption = $this->loyaltyService->claimStampReward($vendor, $customer);

        return new RewardRedemptionResource($redemption->load('promotion'));
    }
}
