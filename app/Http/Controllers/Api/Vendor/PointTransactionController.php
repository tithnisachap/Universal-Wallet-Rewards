<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\AddPointsRequest;
use App\Http\Requests\Vendor\DeductPointsRequest;
use App\Http\Resources\CustomerActivityResource;
use App\Models\Branch;
use App\Models\Customer;
use App\Services\LoyaltyService;

class PointTransactionController extends Controller
{
    public function __construct(private readonly LoyaltyService $loyaltyService) {}

    public function store(AddPointsRequest $request)
    {
        $vendor = $request->user()->vendor;
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $request->validated('branch_id') ? Branch::findOrFail($request->validated('branch_id')) : null;

        $activity = $this->loyaltyService->addPoints($vendor, $customer, $request->validated('points'), $branch);

        return new CustomerActivityResource($activity);
    }

    public function deduct(DeductPointsRequest $request)
    {
        $vendor = $request->user()->vendor;
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $request->validated('branch_id') ? Branch::findOrFail($request->validated('branch_id')) : null;

        $activity = $this->loyaltyService->deductPoints($vendor, $customer, $request->validated('points'), $branch);

        return new CustomerActivityResource($activity);
    }
}
