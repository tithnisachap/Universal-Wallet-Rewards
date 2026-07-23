<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\Vendor;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Branches for a single vendor (the "All Branches" screen).
     */
    public function index(Vendor $vendor)
    {
        abort_if($vendor->status !== 'approved', 404);

        return BranchResource::collection(
            $vendor->branches()->orderByDesc('is_main')->orderBy('name')->get()
        );
    }

    /**
     * Nearby branches across every approved vendor, for the map/location
     * screen. Uses the Haversine formula directly in SQL so sorting happens
     * in the database; the radius cutoff is applied in PHP afterward since
     * Postgres won't let WHERE/HAVING reference a SELECT-list alias without
     * a GROUP BY, and repeating the whole expression there would be worse.
     */
    public function nearby(Request $request)
    {
        $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius_km' => ['nullable', 'numeric', 'min:0.1', 'max:100'],
            'category' => ['nullable', 'string'],
        ]);

        $lat = $request->float('lat');
        $lng = $request->float('lng');
        $radiusKm = $request->float('radius_km', 20);

        $haversine = '6371 * acos(least(1, greatest(-1,
            cos(radians(?)) * cos(radians(branches.latitude)) * cos(radians(branches.longitude) - radians(?))
            + sin(radians(?)) * sin(radians(branches.latitude))
        )))';

        $branches = Branch::query()
            ->join('vendors', 'vendors.id', '=', 'branches.vendor_id')
            ->where('vendors.status', 'approved')
            ->whereNotNull('branches.latitude')
            ->whereNotNull('branches.longitude')
            ->when($request->filled('category'), fn ($query) => $query->where('vendors.category', $request->string('category')))
            ->select('branches.*', 'vendors.business_name as vendor_name')
            ->selectRaw("$haversine as distance_km", [$lat, $lng, $lat])
            ->orderBy('distance_km')
            ->get()
            ->filter(fn (Branch $branch) => (float) $branch->distance_km <= $radiusKm)
            ->take(50)
            ->values();

        return BranchResource::collection($branches);
    }
}
