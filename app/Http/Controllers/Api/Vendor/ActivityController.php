<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerActivityResource;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        $activities = $vendor->activities()
            ->with('customer.user')
            ->when($request->filled('type'), fn ($query) => $query->where('type', $request->string('type')))
            ->when($request->filled('branch_id'), fn ($query) => $query->where('branch_id', $request->integer('branch_id')))
            ->when($request->filled('date'), fn ($query) => $query->whereDate('occurred_at', $request->date('date')))
            ->orderByDesc('occurred_at')
            ->paginate($request->integer('per_page', 20));

        return CustomerActivityResource::collection($activities);
    }
}
