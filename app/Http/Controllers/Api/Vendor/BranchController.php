<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreBranchRequest;
use App\Http\Requests\Vendor\UpdateBranchRequest;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Services\NominatimGeocoder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchController extends Controller
{
    public function __construct(private readonly NominatimGeocoder $geocoder) {}

    public function index(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        return BranchResource::collection(
            $vendor->branches()->orderByDesc('is_main')->orderBy('name')->get()
        );
    }

    public function store(StoreBranchRequest $request)
    {
        $this->authorize('create', Branch::class);

        $vendor = $request->user()->vendor;
        $address = $this->geocoder->reverseGeocode(
            $request->validated('latitude'),
            $request->validated('longitude'),
        );

        $branch = DB::transaction(function () use ($request, $vendor, $address) {
            if ($request->boolean('is_main')) {
                $vendor->branches()->where('is_main', true)->update(['is_main' => false]);
            }

            $photoPath = $request->hasFile('photo')
                ? $request->file('photo')->store('branch-photos', 'public')
                : null;

            return $vendor->branches()->create([
                ...$request->safe()->except(['photo', 'is_main']),
                'address' => $address,
                'photo_path' => $photoPath,
                'is_main' => $request->boolean('is_main') || ! $vendor->branches()->exists(),
            ]);
        });

        return new BranchResource($branch);
    }

    public function show(Branch $branch)
    {
        $this->authorize('view', $branch);

        return new BranchResource($branch);
    }

    public function update(UpdateBranchRequest $request, Branch $branch)
    {
        $this->authorize('update', $branch);

        // Optional on update — editing hours/phone shouldn't force moving
        // the pin when the location hasn't changed.
        $address = $request->filled('latitude')
            ? $this->geocoder->reverseGeocode($request->validated('latitude'), $request->validated('longitude'))
            : null;

        DB::transaction(function () use ($request, $branch, $address) {
            if ($request->boolean('is_main')) {
                $branch->vendor->branches()->where('id', '!=', $branch->id)->where('is_main', true)->update(['is_main' => false]);
            }

            if ($request->hasFile('photo')) {
                $branch->photo_path = $request->file('photo')->store('branch-photos', 'public');
            }

            $branch->fill($request->safe()->except('photo'));

            if ($address) {
                $branch->address = $address;
            }

            $branch->save();
        });

        return new BranchResource($branch->fresh());
    }
}
