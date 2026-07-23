import { useState } from 'react';
import { Coffee, UtensilsCrossed, ShoppingBag, MapPin } from 'lucide-react';
import SearchInput from '../../components/ui/SearchInput';
import Chip from '../../components/ui/Chip';
import Card from '../../components/ui/Card';
import { nearbyStores } from '../../data/mock';

const categories = [
    { value: 'coffee', label: 'Coffee', icon: Coffee },
    { value: 'dining', label: 'Dining', icon: UtensilsCrossed },
    { value: 'retail', label: 'Retail', icon: ShoppingBag },
];

export default function Location() {
    const [category, setCategory] = useState('coffee');

    return (
        <div className="flex h-screen flex-col">
            <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-50">
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
                <div className="absolute left-1/3 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
                    <Coffee size={16} />
                </div>
                <div className="absolute bottom-1/3 right-1/4 h-3 w-3 rounded-full bg-brand-600" />
            </div>

            <div className="rounded-t-3xl bg-white px-4 pb-24 pt-5 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900">Nearby Stores</p>
                        <p className="text-sm text-gray-500">Found 12 stores in your area</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-600">View all</span>
                </div>
                <div className="space-y-3">
                    {nearbyStores.map((store) => (
                        <Card key={store.id} className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-800" />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{store.name}</p>
                                <p className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin size={12} /> {store.distance}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
