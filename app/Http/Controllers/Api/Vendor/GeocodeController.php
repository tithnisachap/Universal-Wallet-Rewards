<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Services\NominatimGeocoder;
use Illuminate\Http\Request;

class GeocodeController extends Controller
{
    public function __construct(private readonly NominatimGeocoder $geocoder) {}

    /**
     * Powers the location picker's search box — typing an address returns
     * candidate pins to jump the map to.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'max:255'],
        ]);

        return response()->json(['data' => $this->geocoder->search($validated['q'])]);
    }

    /**
     * Powers the location picker's live "here's the address at this pin"
     * preview as the vendor drags/taps the marker.
     */
    public function reverse(Request $request)
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
        ]);

        return response()->json([
            'data' => ['address' => $this->geocoder->reverseGeocode($validated['lat'], $validated['lng'])],
        ]);
    }
}
