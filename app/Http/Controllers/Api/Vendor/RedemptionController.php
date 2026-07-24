<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\RewardRedemptionResource;
use App\Services\LoyaltyService;
use App\Services\VendorAccessResolver;
use Illuminate\Http\Request;

class RedemptionController extends Controller
{
    public function __construct(
        private readonly LoyaltyService $loyaltyService,
        private readonly VendorAccessResolver $access,
    ) {}

    /**
     * Vendor scans a customer's "Claim Reward" QR code to fulfil it.
     */
    public function store(Request $request)
    {
        $request->validate(['code' => ['required', 'string']]);

        $vendor = $this->access->vendorFor($request->user());
        abort_if(! $vendor || $vendor->status !== 'approved', 403, 'Your shop must be approved to redeem rewards.');

        $redemption = $this->loyaltyService->redeemCode($vendor, $request->string('code'));

        return new RewardRedemptionResource($redemption->load(['customer', 'promotion']));
    }
}
