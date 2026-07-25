import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, MapPin } from 'lucide-react';
import SearchInput from './ui/SearchInput';
import { api } from '../lib/apiClient';

// Phnom Penh city center — same default used on the customer Location page,
// so a brand-new branch with no prior pin starts centered somewhere sane.
const DEFAULT_CENTER = [11.5564, 104.9282];

const pinIcon = L.divIcon({
    className: '',
    html: '<div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 shadow-lg ring-4 ring-white"></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

function RecenterMap({ center }) {
    const map = useMap();

    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center]);

    return null;
}

/**
 * A Leaflet + OpenStreetMap pin-drop location picker — no API key or
 * billing account required, unlike the real Google Maps JavaScript API.
 * `onChange` only fires from an actual user interaction (map click or
 * picking a search result), never on mount, so a parent form can tell
 * "unchanged" apart from "the vendor picked a new spot."
 */
export default function LocationPicker({ initialValue, onChange }) {
    const [position, setPosition] = useState(
        initialValue ? [initialValue.latitude, initialValue.longitude] : null,
    );
    const [address, setAddress] = useState('');
    const [resolving, setResolving] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const hasInteracted = useRef(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return undefined;
        }

        const timeout = setTimeout(async () => {
            try {
                const data = await api.get('/vendor/geocode/search', { params: { q: query } });
                setResults(data ?? []);
            } catch {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (!hasInteracted.current || !position) return undefined;

        setResolving(true);
        const timeout = setTimeout(async () => {
            try {
                const data = await api.get('/vendor/geocode/reverse', {
                    params: { lat: position[0], lng: position[1] },
                });
                setAddress(data?.address ?? '');
            } catch {
                setAddress('');
            } finally {
                setResolving(false);
            }
        }, 400);

        return () => {
            clearTimeout(timeout);
            setResolving(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    function place(lat, lng) {
        hasInteracted.current = true;
        setPosition([lat, lng]);
        onChange({ latitude: lat, longitude: lng });
    }

    function selectResult(result) {
        setQuery('');
        setResults([]);
        place(result.latitude, result.longitude);
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <SearchInput
                    placeholder="Search for an address..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {results.length > 0 ? (
                    <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                        {results.map((result, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => selectResult(result)}
                                className="flex w-full items-start gap-2 border-b border-gray-100 px-3 py-2 text-left text-sm last:border-0 hover:bg-gray-50"
                            >
                                <MapPin size={14} className="mt-0.5 shrink-0 text-brand-600" />
                                <span className="text-gray-700">{result.address}</span>
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="h-64 overflow-hidden rounded-2xl">
                <MapContainer
                    center={position ?? DEFAULT_CENTER}
                    zoom={position ? 16 : 13}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onClick={place} />
                    {position ? <RecenterMap center={position} /> : null}
                    {position ? <Marker position={position} icon={pinIcon} /> : null}
                </MapContainer>
            </div>

            <p className="flex min-h-[20px] items-center gap-1.5 text-xs text-gray-500">
                {!position ? (
                    'Tap the map or search above to drop a pin'
                ) : resolving ? (
                    <>
                        <Loader2 size={12} className="animate-spin" /> Looking up address...
                    </>
                ) : (
                    address
                )}
            </p>
        </div>
    );
}
