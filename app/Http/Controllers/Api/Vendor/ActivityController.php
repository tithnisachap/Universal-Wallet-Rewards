<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerActivityResource;
use App\Services\VendorAccessResolver;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function __construct(private readonly VendorAccessResolver $access) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $vendor = $this->access->vendorFor($user);

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        // Staff can only ever see their own branch's activity — their
        // assigned branch always wins over any client-supplied filter.
        $forcedBranchId = $user->role === 'branch_staff'
            ? $this->access->branchFor($user, $vendor, null)?->id
            : null;

        $activities = $vendor->activities()
            ->with('customer.user')
            ->when($request->filled('type'), fn ($query) => $query->where('type', $request->string('type')))
            ->when($forcedBranchId, fn ($query) => $query->where('branch_id', $forcedBranchId))
            ->when(! $forcedBranchId && $request->filled('branch_id'), fn ($query) => $query->where('branch_id', $request->integer('branch_id')))
            ->when($request->filled('date'), fn ($query) => $query->whereDate('occurred_at', $request->date('date')))
            ->orderByDesc('occurred_at')
            ->paginate($request->integer('per_page', 20));

        return CustomerActivityResource::collection($activities);
    }
}
