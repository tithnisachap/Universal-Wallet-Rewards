<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Customer directory — searchable by name, email, or customer code.
     */
    public function index(Request $request)
    {
        $query = Customer::with('user');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('customer_code', 'ilike', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
            });
        }

        $customers = $query->orderByDesc('created_at')->paginate($request->integer('per_page', 10));

        return CustomerResource::collection($customers);
    }

    /**
     * Customer profile plus every vendor they hold a loyalty account with
     * (not a full vendor directory — only vendors they've actually earned
     * stamps/points at).
     */
    public function show(Customer $customer)
    {
        $customer->load('user');
        $customer->vendor_loyalty_list = $customer->loyaltyAccounts()->with('vendor')->get();

        return new CustomerResource($customer);
    }
}
