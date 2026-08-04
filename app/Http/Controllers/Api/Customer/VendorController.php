<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * The customer-facing vendor directory ("Coupons" screen).
     */
    public function index(Request $request)
    {
        $customer = $request->user()->customer;

        $vendors = Vendor::query()
            ->where('status', 'approved')
            ->when($request->filled('search'), fn ($query) => $query->where('business_name', 'ilike', '%'.$request->string('search').'%'))
            ->withCount('branches')
            ->when($customer, function ($query) use ($customer) {
                $query->orderByRaw('
                    CASE WHEN EXISTS (
                        SELECT 1 FROM customer_loyalty
                        WHERE customer_loyalty.vendor_id = vendors.id
                        AND customer_loyalty.customer_id = ?
                        AND (customer_loyalty.stamps_count > 0 OR customer_loyalty.points_balance > 0)
                    ) THEN 0 ELSE 1 END
                ', [$customer->id]);
            })
            ->orderBy('business_name')
            ->paginate($request->integer('per_page', 20));

        $vendors->getCollection()->transform(function (Vendor $vendor) use ($customer) {
            $vendor->loyalty_snapshot = $customer
                ? $customer->loyaltyAccounts()->where('vendor_id', $vendor->id)->first()
                : null;

            return $vendor;
        });

        return VendorResource::collection($vendors)->additional([
            'meta_note' => 'loyalty_snapshot on each vendor reflects this customer\'s points/stamps at that vendor, if any.',
        ]);
    }

    public function show(Vendor $vendor)
    {
        abort_if($vendor->status !== 'approved', 404);

        return new VendorResource($vendor->loadCount('branches'));
    }
}
