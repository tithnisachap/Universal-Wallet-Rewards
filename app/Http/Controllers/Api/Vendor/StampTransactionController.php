<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\AddStampRequest;
use App\Http\Resources\CustomerActivityResource;
use App\Models\Branch;
use App\Models\Customer;
use App\Services\LoyaltyService;

class StampTransactionController extends Controller
{
    public function __construct(private readonly LoyaltyService $loyaltyService) {}

    public function store(AddStampRequest $request)
    {
        $vendor = $request->user()->vendor;
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $request->validated('branch_id') ? Branch::findOrFail($request->validated('branch_id')) : null;

        $activity = $this->loyaltyService->addStamps($vendor, $customer, $request->validated('stamps'), $branch);

        return new CustomerActivityResource($activity);
    }
}
