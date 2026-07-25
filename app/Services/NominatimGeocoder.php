<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Thin wrapper around OpenStreetMap's free Nominatim geocoding service — no
 * API key or billing account required, unlike Google's geocoding/Places
 * APIs. Used to turn a vendor-picked map pin (latitude/longitude) into a
 * human-readable address, and to power the location picker's search box.
 */
class NominatimGeocoder
{
    private const USER_AGENT = 'UniversalWalletRewards/1.0';

    public function reverseGeocode(float $lat, float $lng): string
    {
        try {
            $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
                ->timeout(5)
                ->get('https://nominatim.openstreetmap.org/reverse', [
                    'lat' => $lat,
                    'lon' => $lng,
                    'format' => 'json',
                ]);

            $displayName = $response->json('display_name');

            if ($displayName) {
                return $displayName;
            }
        } catch (Throwable $e) {
            // Fall through to the coordinate fallback below.
        }

        return sprintf('%.6f, %.6f', $lat, $lng);
    }

    /**
     * @return array<int, array{latitude: float, longitude: float, address: string}>
     */
    public function search(string $query): array
    {
        try {
            $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
                ->timeout(5)
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $query,
                    'format' => 'json',
                    'limit' => 5,
                    // Soft bias, not a hard filter — this app's demo data is
                    // all Phnom Penh, so Cambodian results are prioritized.
                    'countrycodes' => 'kh',
                ]);

            return collect($response->json())
                ->map(fn ($result) => [
                    'latitude' => (float) $result['lat'],
                    'longitude' => (float) $result['lon'],
                    'address' => $result['display_name'],
                ])
                ->all();
        } catch (Throwable $e) {
            return [];
        }
    }
}
