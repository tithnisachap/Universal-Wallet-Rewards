<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\AddPointsRequest;
use App\Http\Requests\Vendor\DeductPointsRequest;
use App\Http\Resources\CustomerActivityResource;
use App\Models\Customer;
use App\Services\LoyaltyService;
use App\Services\VendorAccessResolver;

class PointTransactionController extends Controller
{
    public function __construct(
        private readonly LoyaltyService $loyaltyService,
        private readonly VendorAccessResolver $access,
    ) {}

    public function store(AddPointsRequest $request)
    {
        $vendor = $this->access->vendorFor($request->user());
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $this->access->branchFor($request->user(), $vendor, $request->validated('branch_id'));

        $activity = $this->loyaltyService->addPoints($vendor, $customer, $request->validated('points'), $branch);

        return new CustomerActivityResource($activity);
    }

    public function deduct(DeductPointsRequest $request)
    {
        $vendor = $this->access->vendorFor($request->user());
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $this->access->branchFor($request->user(), $vendor, $request->validated('branch_id'));

        $activity = $this->loyaltyService->deductPoints($vendor, $customer, $request->validated('points'), $branch);

        return new CustomerActivityResource($activity);
    }
}
