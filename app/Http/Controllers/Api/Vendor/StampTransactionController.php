<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\AddStampRequest;
use App\Http\Resources\CustomerActivityResource;
use App\Models\Customer;
use App\Services\LoyaltyService;
use App\Services\VendorAccessResolver;

class StampTransactionController extends Controller
{
    public function __construct(
        private readonly LoyaltyService $loyaltyService,
        private readonly VendorAccessResolver $access,
    ) {}

    public function store(AddStampRequest $request)
    {
        $vendor = $this->access->vendorFor($request->user());
        $customer = Customer::findOrFail($request->validated('customer_id'));
        $branch = $this->access->branchFor($request->user(), $vendor, $request->validated('branch_id'));

        $activity = $this->loyaltyService->addStamps($vendor, $customer, $request->validated('stamps'), $branch);

        return new CustomerActivityResource($activity);
    }
}
