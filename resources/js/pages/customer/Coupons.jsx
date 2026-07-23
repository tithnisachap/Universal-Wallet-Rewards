import { Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import { vendors } from '../../data/mock';

export default function Coupons() {
    return (
        <div className="px-4 pb-6 pt-6">
            <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Coupons</h1>
            <p className="mt-1 text-sm text-gray-500">Explore stores and earn rewards!</p>

            <SearchInput placeholder="Search for your favorite stores..." className="mt-4" />

            <div className="mt-5 space-y-3">
                {vendors.map((vendor) => (
                    <Link key={vendor.id} to={`/customer/vendors/${vendor.id}/branches`}>
                        <Card className="flex items-center gap-3">
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${vendor.color}`}>
                                {vendor.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900">{vendor.name}</p>
                                <p className="truncate text-sm text-gray-500">{vendor.summary}</p>
                                <div className="mt-1 flex items-center gap-3 text-sm font-medium text-brand-600">
                                    <span className="flex items-center gap-1">
                                        <Star size={14} /> {vendor.stamps} Stamps
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Tag size={14} /> {vendor.points} Points
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
