<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerActivityResource;
use App\Models\Vendor;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * The full points/stamps history ledger for one vendor ("View All History").
     */
    public function index(Request $request, Vendor $vendor)
    {
        abort_if($vendor->status !== 'approved', 404);

        $customer = $request->user()->customer;

        $activities = $customer->activities()
            ->where('vendor_id', $vendor->id)
            ->orderByDesc('occurred_at')
            ->paginate($request->integer('per_page', 20));

        return CustomerActivityResource::collection($activities);
    }
}
