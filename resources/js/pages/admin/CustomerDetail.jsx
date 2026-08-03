import { useNavigate, useParams } from 'react-router-dom';
import { Star, Tag, Store } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import VendorAvatar from '../../components/VendorAvatar';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import { useAdminCustomer, useSuspendCustomer, useReinstateCustomer } from '../../queries/admin';

export default function CustomerDetail() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const { data: customer, isLoading, isError, error, refetch } = useAdminCustomer(customerId);
    const suspend = useSuspendCustomer(customerId);
    const reinstate = useReinstateCustomer(customerId);

    const isSuspended = customer?.is_suspended;

    function handleToggle() {
        (isSuspended ? reinstate : suspend).mutate();
    }

    return (
        <div>
            <PageHeader title="Customer" onBack={() => navigate('/admin/customers')} />
            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {customer ? (
                    <div className="space-y-4 px-4 py-4">
                        <Card>
                            <div className="flex items-center gap-3">
                                <Avatar src={customer.avatar} size={56} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-bold text-gray-900">{customer.name}</p>
                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                </div>
                            </div>

                            <dl className="mt-5 divide-y divide-gray-100">
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-sm text-gray-500">Customer Code</dt>
                                    <dd className="text-sm font-semibold text-gray-900">{customer.customer_code}</dd>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-sm text-gray-500">Member Since</dt>
                                    <dd className="text-sm font-semibold text-gray-900">
                                        {new Date(customer.member_since).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-sm text-gray-500">Status</dt>
                                    <dd>
                                        <Badge tone={isSuspended ? 'rejected' : 'approved'}>
                                            {isSuspended ? 'Suspended' : 'Active'}
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        {(suspend.isError || reinstate.isError) ? (
                            <p className="text-sm text-danger-500">
                                {(suspend.error ?? reinstate.error)?.message}
                            </p>
                        ) : null}

                        <Button
                            variant={isSuspended ? 'outline' : 'dangerOutline'}
                            onClick={handleToggle}
                            disabled={suspend.isPending || reinstate.isPending}
                        >
                            {suspend.isPending || reinstate.isPending
                                ? 'Saving...'
                                : isSuspended
                                  ? 'Reinstate Customer'
                                  : 'Suspend Customer'}
                        </Button>

                        <div>
                            <p className="mb-2 font-bold text-gray-900">Loyalty at</p>
                            <div className="space-y-3">
                                <QueryState
                                    isEmpty={customer.vendors?.length === 0}
                                    emptyState={
                                        <EmptyState
                                            icon={Store}
                                            title="No loyalty accounts yet"
                                            description="This customer hasn't earned stamps or points anywhere yet."
                                        />
                                    }
                                >
                                    {customer.vendors?.map((vendor) => (
                                        <Card key={vendor.vendor_id} className="flex items-center gap-3">
                                            <VendorAvatar vendor={vendor} size="lg" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900">{vendor.business_name}</p>
                                                <p className="truncate text-sm text-gray-500">{vendor.category}</p>
                                                <div className="mt-1 flex items-center gap-3 text-sm font-medium text-brand-600">
                                                    <span className="flex items-center gap-1">
                                                        <Star size={14} /> {vendor.stamps_count} Stamps
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Tag size={14} /> {vendor.points_balance} Points
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </QueryState>
                            </div>
                        </div>
                    </div>
                ) : null}
            </QueryState>
        </div>
    );
}
