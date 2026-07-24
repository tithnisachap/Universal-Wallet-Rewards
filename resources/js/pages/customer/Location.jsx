import { useEffect, useState } from 'react';
import { Coffee, UtensilsCrossed, ShoppingBag, MapPin, MapPinOff } from 'lucide-react';
import SearchInput from '../../components/ui/SearchInput';
import Chip from '../../components/ui/Chip';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import { useNearbyBranches } from '../../queries/customer';

// Phnom Penh city center — used whenever the browser won't share a real
// location (permission denied, unsupported, etc.) so the screen still works.
const DEFAULT_COORDS = { lat: 11.5564, lng: 104.9282 };

const categories = [
    { value: 'Coffee Shop', label: 'Coffee', icon: Coffee },
    { value: 'Restaurant', label: 'Dining', icon: UtensilsCrossed },
    { value: 'Retail', label: 'Retail', icon: ShoppingBag },
];

export default function Location() {
    const [category, setCategory] = useState('Coffee Shop');
    const [coords, setCoords] = useState(DEFAULT_COORDS);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => setCoords(DEFAULT_COORDS),
            { timeout: 5000 },
        );
    }, []);

    const { data: branches, isLoading, isError, error, refetch } = useNearbyBranches({
        lat: coords.lat,
        lng: coords.lng,
        category,
    });

    return (
        <div className="flex h-screen flex-col">
            <div className="relative h-72 shrink-0 overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-50">
                <div className="absolute inset-x-4 top-4 z-10">
                    <SearchInput placeholder="Search nearby stores" className="shadow-md" />
                    <div className="mt-3 flex gap-2">
                        {categories.map((cat) => (
                            <Chip key={cat.value} icon={cat.icon} active={category === cat.value} onClick={() => setCategory(cat.value)}>
                                {cat.label}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
                    <MapPin size={22} />
                </div>
                {branches?.slice(0, 4).map((branch, i) => (
                    <div
                        key={branch.id}
                        className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-md"
                        style={{ left: `${30 + i * 15}%`, top: `${35 + (i % 2) * 20}%` }}
                    >
                        <Coffee size={16} />
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto rounded-t-3xl bg-white px-4 pb-24 pt-5 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900">Nearby Stores</p>
                        <p className="text-sm text-gray-500">
                            {branches ? `Found ${branches.length} stores in your area` : 'Searching your area...'}
                        </p>
                    </div>
                    <span className="text-sm font-semibold text-brand-600">View all</span>
                </div>
                <div className="space-y-3">
                    <QueryState
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onRetry={refetch}
                        isEmpty={branches?.length === 0}
                        emptyState={<EmptyState icon={MapPinOff} title="No stores nearby" description="Try a different category or search a wider area." />}
                    >
                        {branches?.map((branch) => (
                            <Card key={branch.id} className="flex items-center gap-3">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-800" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{branch.vendor_name}</p>
                                    <p className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} /> {branch.distance_km} km away
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </QueryState>
                </div>
            </div>
        </div>
    );
}
