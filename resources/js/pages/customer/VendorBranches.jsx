import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Users, Store } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import VendorAvatar from '../../components/VendorAvatar';
import { formatOpeningHours } from '../../lib/formatOpeningHours';
import { useVendorBranchesForCustomer, useVendorDetail } from '../../queries/customer';

export default function VendorBranches() {
    const { vendorId } = useParams();
    const { data: vendor } = useVendorDetail(vendorId);
    const {
        data: vendorBranches,
        isLoading,
        isError,
        error,
        refetch,
    } = useVendorBranchesForCustomer(vendorId);

    return (
        <div>
            <PageHeader title="All Branches" />
            <div className="px-4 py-4">
                <div className="mb-5 flex items-center gap-3">
                    <VendorAvatar vendor={vendor} size="lg" />
                    <div>
                        <p className="text-lg font-bold text-gray-900">{vendor?.business_name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <QueryState
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onRetry={refetch}
                        isEmpty={vendorBranches?.length === 0}
                        emptyState={<EmptyState icon={Store} title="No branches yet" description="This vendor hasn't added any branches." />}
                    >
                        {vendorBranches?.map((branch) => (
                            <Link key={branch.id} to={`/customer/vendors/${vendorId}/branches/${branch.id}`} className="block">
                                <Card className="flex items-center gap-3">
                                    {branch.photo_url ? (
                                        <img
                                            src={branch.photo_url}
                                            alt={branch.name}
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-800" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900">{branch.name}</p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin size={12} /> {branch.address}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} /> {formatOpeningHours(branch.opening_hours)}
                                        </p>
                                        {branch.phone ? (
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                                <Phone size={12} /> {branch.phone}
                                            </p>
                                        ) : null}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </QueryState>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-50 p-4">
                    <Users size={20} className="mt-0.5 shrink-0 text-brand-600" />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">Shared Loyalty Program</p>
                        <p className="text-gray-600">
                            Customers can collect and redeem rewards at any branch under {vendor?.business_name}.{' '}
                            <span className="font-medium text-brand-600">Learn More</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
