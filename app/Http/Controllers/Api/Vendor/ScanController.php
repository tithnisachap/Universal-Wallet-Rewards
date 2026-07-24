<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerLoyalty;
use App\Services\VendorAccessResolver;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScanController extends Controller
{
    public function __construct(private readonly VendorAccessResolver $access) {}

    /**
     * Resolves a scanned customer QR code into the "User Wallet" screen:
     * the customer's identity plus their current balance at this vendor.
     * Read-only — no balance is mutated here.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $vendor = $this->access->vendorFor($request->user());

        abort_if(! $vendor || $vendor->status !== 'approved', 403, 'Your shop must be approved to scan customers.');

        $customer = Customer::where('customer_code', $request->string('code'))->first();

        if (! $customer) {
            throw ValidationException::withMessages(['code' => 'No customer found for this QR code.']);
        }

        $loyalty = CustomerLoyalty::firstOrNew(
            ['customer_id' => $customer->id, 'vendor_id' => $vendor->id],
            ['points_balance' => 0, 'stamps_count' => 0]
        );

        return response()->json([
            'data' => [
                'customer_id' => $customer->id,
                'customer_code' => $customer->customer_code,
                'name' => $customer->user->name,
                'points_balance' => $loyalty->points_balance,
                'stamps_count' => $loyalty->stamps_count,
            ],
        ]);
    }
}
