import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Gift, Receipt } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import VendorAvatar from '../../components/VendorAvatar';
import { activityLabel, formatAmount, formatDateTime } from '../../lib/activityLabels';
import { useVendorActivities, useVendorDetail } from '../../queries/customer';

export default function History() {
    const { vendorId } = useParams();
    const [page, setPage] = useState(1);
    const { data: vendor } = useVendorDetail(vendorId);
    const { data, isLoading, isError, error, refetch } = useVendorActivities(vendorId, { page });
    const activities = data?.data;
    const meta = data?.meta;

    const iconFor = (type) => (type === 'reward_redeemed' ? Gift : Plus);
    const toneFor = (type) => (type === 'reward_redeemed' ? 'bg-danger-50 text-danger-500' : 'bg-brand-50 text-brand-600');

    return (
        <div>
            <PageHeader title="Universal Wallet" />
            <div className="px-4 py-4">
                <div className="mb-4 flex items-center gap-3">
                    <VendorAvatar vendor={vendor} />
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.business_name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <h2 className="font-bold text-gray-900">Points History</h2>
                <p className="mb-3 text-sm text-gray-500">All your points activities at {vendor?.business_name}.</p>

                <QueryState
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    isEmpty={activities?.length === 0}
                    emptyState={<EmptyState icon={Receipt} title="No activity yet" description="Your points and stamps history will show up here." />}
                >
                    <Card className="divide-y divide-gray-100 p-0">
                        {activities?.map((entry) => {
                            const Icon = iconFor(entry.type);
                            const { date, time } = formatDateTime(entry.occurred_at);

                            return (
                                <div key={entry.id} className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneFor(entry.type)}`}>
                                            <Icon size={16} />
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{activityLabel(entry.type)}</p>
                                            <p className="text-xs text-gray-500">
                                                {date} • {time}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-bold ${entry.amount < 0 ? 'text-danger-500' : 'text-brand-600'}`}>
                                            {formatAmount(entry.amount)}
                                        </span>
                                    </div>
                                    {entry.note ? (
                                        <div className="ml-12 mt-2 inline-block rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
                                            {entry.note}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </Card>
                </QueryState>

                <Pagination meta={meta} onPageChange={setPage} />
            </div>
        </div>
    );
}
