<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorProfileRequest;
use App\Http\Requests\Vendor\UpdateVendorProfileRequest;
use App\Http\Resources\VendorResource;
use App\Models\PlatformSetting;
use App\Models\Vendor;
use App\Services\NominatimGeocoder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function __construct(private readonly NominatimGeocoder $geocoder) {}

    public function show(Request $request)
    {
        $vendor = $request->user()->vendor;

        abort_if(! $vendor, 404, 'No shop has been set up yet.');

        return new VendorResource($vendor->loadCount('branches'));
    }

    /**
     * Shop Setup: creates the vendor profile and submits it for admin
     * review. The shop being set up here IS the vendor's first physical
     * location, so this also creates their main Branch — otherwise a vendor
     * would be approved with a business but nowhere for customers to find
     * or for the owner to scan at.
     */
    public function store(StoreVendorProfileRequest $request)
    {
        $this->authorize('create', Vendor::class);

        $logoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('vendor-logos', 'public')
            : null;

        $autoApprove = PlatformSetting::current()->auto_approve_vendors;

        // Reverse-geocode before opening a transaction — it's an outbound
        // HTTP call, which shouldn't happen while holding one open.
        $address = $this->geocoder->reverseGeocode(
            $request->validated('latitude'),
            $request->validated('longitude'),
        );

        $vendor = DB::transaction(function () use ($request, $logoPath, $autoApprove, $address) {
            $vendor = Vendor::create([
                'user_id' => $request->user()->id,
                'business_name' => $request->validated('business_name'),
                'category' => $request->validated('category'),
                'logo_path' => $logoPath,
                'phone' => $request->validated('phone'),
                'email' => $request->user()->email,
                'address' => $address,
                'website' => $request->validated('website'),
                'status' => $autoApprove ? 'approved' : 'pending',
                'submitted_at' => now(),
                'reviewed_at' => $autoApprove ? now() : null,
                'review_note' => $autoApprove ? 'Auto-approved — admin approval was turned off at signup time.' : null,
            ]);

            $vendor->branches()->create([
                'name' => $request->validated('business_name'),
                'address' => $address,
                'phone' => $request->validated('phone'),
                'photo_path' => $logoPath,
                'latitude' => $request->validated('latitude'),
                'longitude' => $request->validated('longitude'),
                'is_main' => true,
            ]);

            return $vendor;
        });

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
