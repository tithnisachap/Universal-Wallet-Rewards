import { useEffect, useState } from 'react';
import { Star, Tag, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import VendorAvatar from '../../components/VendorAvatar';
import { useVendorDirectory } from '../../queries/customer';

export default function Coupons() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const { data: vendors, isLoading, isError, error, refetch } = useVendorDirectory(debouncedSearch);

    return (
        <div className="px-4 pb-6 pt-6">
            <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Coupons</h1>
            <p className="mt-1 text-sm text-gray-500">Explore stores and earn rewards!</p>

            <SearchInput
                placeholder="Search for your favorite stores..."
                className="mt-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-5 space-y-3">
                <QueryState
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    isEmpty={vendors?.length === 0}
                    emptyState={
                        <EmptyState
                            icon={Store}
                            title="No stores found"
                            description={search ? 'Try a different search term.' : 'No vendors are available yet.'}
                        />
                    }
                >
                    {vendors?.map((vendor) => (
                        <Link key={vendor.id} to={`/customer/vendors/${vendor.id}/branches`}>
                            <Card className="flex items-center gap-3">
                                <VendorAvatar vendor={vendor} size="lg" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900">{vendor.business_name}</p>
                                    <p className="truncate text-sm text-gray-500">
                                        Earn points and stamps redeem amazing rewards
                                    </p>
                                    <div className="mt-1 flex items-center gap-3 text-sm font-medium text-brand-600">
                                        <span className="flex items-center gap-1">
                                            <Star size={14} /> {vendor.loyalty?.stamps_count ?? 0} Stamps
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag size={14} /> {vendor.loyalty?.points_balance ?? 0} Points
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </QueryState>
            </div>
        </div>
    );
}
