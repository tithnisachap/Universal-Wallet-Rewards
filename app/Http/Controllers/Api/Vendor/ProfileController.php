<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorProfileRequest;
use App\Http\Requests\Vendor\UpdateVendorProfileRequest;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        return new VendorResource($vendor->loadCount('branches'));
    }

    /**
     * Shop Setup: creates the vendor profile and submits it for admin review.
     */
    public function store(StoreVendorProfileRequest $request)
    {
        $this->authorize('create', Vendor::class);

        $logoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('vendor-logos', 'public')
            : null;

        $vendor = Vendor::create([
            'user_id' => $request->user()->id,
            'business_name' => $request->validated('business_name'),
            'category' => $request->validated('category'),
            'logo_path' => $logoPath,
            'phone' => $request->validated('phone'),
            'email' => $request->user()->email,
            'address' => $request->validated('address'),
            'website' => $request->validated('website'),
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return new VendorResource($vendor);
    }

    public function update(UpdateVendorProfileRequest $request, Vendor $vendor)
    {
        $this->authorize('update', $vendor);

        if ($request->hasFile('logo')) {
            $vendor->logo_path = $request->file('logo')->store('vendor-logos', 'public');
        }

        $vendor->fill($request->safe()->except('logo'));
        $vendor->save();

        return new VendorResource($vendor);
    }
}
