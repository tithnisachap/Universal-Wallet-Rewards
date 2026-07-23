import { useState } from 'react';
import { Calendar, Receipt } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import { Select } from '../../components/ui/Field';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import { vendorActivityLine } from '../../lib/activityLabels';
import { useVendorActivityLog } from '../../queries/vendor';

const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'points_earned', label: 'Points Earned' },
    { value: 'points_deducted', label: 'Points Deducted' },
    { value: 'stamp_earned', label: 'Stamps Earned' },
    { value: 'reward_redeemed', label: 'Redemptions' },
];

function todayFilter(period) {
    if (period !== 'today') return undefined;
    return new Date().toISOString().slice(0, 10);
}

export default function Activity() {
    const [type, setType] = useState('all');
    const [period, setPeriod] = useState('today');

    const { data: activities, isLoading, isError, error, refetch } = useVendorActivityLog({
        type,
        date: todayFilter(period),
    });

    return (
        <div>
            <PageHeader title="Activity" />
            <div className="px-4 py-4">
                <div className="mb-4 flex gap-3">
                    <Select value={type} onChange={(e) => setType(e.target.value)} className="flex-1">
                        {typeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Select>
                    <div className="relative flex-1">
                        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="pr-9">
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </Select>
                        <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <QueryState
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    isEmpty={activities?.length === 0}
                    emptyState={<EmptyState icon={Receipt} title="No activity" description="Transactions will show up here as they happen." />}
                >
                    <div className="divide-y divide-gray-100">
                        {activities?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-3">
                                <Avatar size={36} className={item.type === 'points_deducted' ? 'bg-danger-50 text-danger-500' : undefined} />
                                <div className="flex-1">
                                    <p
                                        className={`font-semibold ${
                                            item.type === 'points_deducted'
                                                ? 'text-danger-500'
                                                : item.type === 'reward_redeemed'
                                                  ? 'text-amber-600'
                                                  : 'text-brand-600'
                                        }`}
                                    >
                                        {vendorActivityLine(item)}
                                    </p>
                                    <p className="text-sm text-gray-500">{item.customer_name}</p>
                                </div>
                                <span className="text-sm text-gray-400">
                                    {new Date(item.occurred_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </QueryState>
            </div>
        </div>
    );
}
