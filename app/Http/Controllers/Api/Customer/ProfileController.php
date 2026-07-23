<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateCustomerProfileRequest;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $customer = $request->user()->customer()->firstOrFail();
        $customer->load('user');

        return new CustomerResource($customer);
    }

    public function update(UpdateCustomerProfileRequest $request)
    {
        $customer = $request->user()->customer()->firstOrFail();

        $request->user()->update(['name' => $request->validated('name')]);

        return new CustomerResource($customer->load('user'));
    }
}
