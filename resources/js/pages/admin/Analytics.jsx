import { useState } from 'react';
import { Users, Store, Sparkles, Star } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { PillTabs } from '../../components/ui/Tabs';
import StatTile from '../../components/ui/StatTile';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import { useAdminAnalytics } from '../../queries/admin';

const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
];

export default function Analytics() {
    const [period, setPeriod] = useState('month');
    const { data: a, isLoading, isError, error, refetch } = useAdminAnalytics(period);

    return (
        <div className="px-4 py-4">
            <h1 className="text-center text-xl font-bold text-gray-900">Analytics</h1>

            <PillTabs
                options={periods}
                value={period}
                onChange={setPeriod}
                className="mt-4 justify-center rounded-xl bg-brand-50 p-1"
            />

            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {a ? (
                    <>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <StatTile
                                label="Total Customers"
                                value={a.total_customers.toLocaleString()}
                                icon={Users}
                                trend={`${a.customer_growth_pct >= 0 ? '↑' : '↓'} ${Math.abs(a.customer_growth_pct)}%`}
                            />
                            <StatTile
                                label="Active Vendors"
                                value={a.active_vendors}
                                icon={Store}
                                trend={`${a.vendor_growth_pct >= 0 ? '↑' : '↓'} ${Math.abs(a.vendor_growth_pct)}%`}
                            />
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 font-bold text-gray-900">Vendor Growth</p>
                            <Card>
                                <ResponsiveContainer width="100%" height={160}>
                                    <AreaChart data={a.vendor_growth_series}>
                                        <defs>
                                            <linearGradient id="adminVendorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#15803d" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#15803d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#15803d" strokeWidth={2} fill="url(#adminVendorGrowth)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 font-bold text-gray-900">Customer Growth</p>
                            <Card>
                                <ResponsiveContainer width="100%" height={160}>
                                    <AreaChart data={a.customer_growth_series}>
                                        <defs>
                                            <linearGradient id="adminCustomerGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4338ca" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#4338ca" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={2} fill="url(#adminCustomerGrowth)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>

                        <p className="mb-2 mt-5 font-bold text-gray-900">Stamps & Points Activity</p>
                        <div className="grid grid-cols-2 gap-3">
                            <StatTile label="Stamps Issued" value={a.stamps_issued.toLocaleString()} icon={Sparkles} />
                            <StatTile label="Points Issued" value={a.points_issued.toLocaleString()} icon={Star} />
                        </div>
                    </>
                ) : null}
            </QueryState>
        </div>
    );
}
