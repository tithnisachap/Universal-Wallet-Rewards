import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import QueryState from '../../components/ui/QueryState';
import { SegmentedControl } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Field';
import { useVendorAnalytics } from '../../queries/vendor';

export default function Analytics() {
    const [tab, setTab] = useState('customers');
    const [days, setDays] = useState(7);
    const { data: analytics, isLoading, isError, error, refetch } = useVendorAnalytics(days);

    return (
        <div>
            <PageHeader title="Analytics" />
            <div className="px-4 py-4">
                <SegmentedControl
                    options={[
                        { value: 'customers', label: 'Total Customer' },
                        { value: 'redemption', label: 'Redemption' },
                    ]}
                    value={tab}
                    onChange={setTab}
                />

                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    {analytics ? (
                        tab === 'customers' ? (
                            <CustomerAnalytics data={analytics.customers} days={days} onDaysChange={setDays} />
                        ) : (
                            <RedemptionAnalytics data={analytics.redemption} days={days} onDaysChange={setDays} />
                        )
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}

function CustomerAnalytics({ data, days, onDaysChange }) {
    const customerGrowth = data.daily_series.map((d) => ({ label: d.label, value: d.customers }));
    const pointsTransactions = data.daily_series.map((d) => ({ label: d.label, added: d.points_added, deducted: d.points_deducted }));
    const stampsTransactions = data.daily_series.map((d) => ({ label: d.label, added: d.stamps_added, redeemed: d.stamps_redeemed }));

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-gray-400">Total Customers</p>
                <Select compact value={days} onChange={(e) => onDaysChange(Number(e.target.value))}>
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                </Select>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">{data.total.toLocaleString()}</p>
                <p className="text-sm font-medium text-success-500">
                    {data.change_pct >= 0 ? '↑' : '↓'} {Math.abs(data.change_pct)}% vs previous period
                </p>
            </div>

            <Card>
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={customerGrowth}>
                        <defs>
                            <linearGradient id="customerFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1e2c6e" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#1e2c6e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#1e2c6e" strokeWidth={2} fill="url(#customerFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-3 text-center">
                <MiniStat label="Points Added" value={data.points_added.toLocaleString()} tone="text-brand-600" />
                <MiniStat label="Points Deducted" value={data.points_deducted.toLocaleString()} tone="text-danger-500" />
                <MiniStat label="Stamps Added" value={data.stamps_added.toLocaleString()} tone="text-amber-600" />
                <MiniStat label="Stamps redeem" value={data.stamps_redeemed.toLocaleString()} tone="text-gray-700" />
            </div>

            <div>
                <p className="mb-2 font-bold text-gray-900">Points Transactions Overview</p>
                <Card>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={pointsTransactions}>
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="added" fill="#1e2c6e" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="deducted" fill="#ef4444" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div>
                <p className="mb-2 font-bold text-gray-900">Stamps Transactions Overview</p>
                <Card>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={stampsTransactions}>
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="added" fill="#f2a70b" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="redeemed" fill="#9ca3af" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}

function RedemptionAnalytics({ data, days, onDaysChange }) {
    return (
        <div className="mt-4 space-y-4">
            <div>
                <p className="mb-2 font-bold text-gray-900">Top Promotions (This Period)</p>
                {data.top_promotions.length === 0 ? (
                    <Card className="py-6 text-center text-sm text-gray-400">No redemptions yet.</Card>
                ) : (
                    <Card className="divide-y divide-gray-100 p-0">
                        {data.top_promotions.map((promo) => (
                            <div key={promo.rank} className="flex items-center gap-3 px-4 py-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-600">
                                    {promo.rank}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{promo.title}</p>
                                    <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                                        <div
                                            className="h-1.5 rounded-full bg-brand-600"
                                            style={{ width: `${Math.min(100, (promo.redeemed / data.top_promotions[0].redeemed) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{promo.redeemed}</p>
                                    <p className="text-xs text-gray-400">REDEEMED</p>
                                </div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>

            <div className="flex justify-end">
                <Select compact value={days} onChange={(e) => onDaysChange(Number(e.target.value))}>
                    <option value={7}>This Week</option>
                    <option value={30}>This Month</option>
                </Select>
            </div>

            <div>
                <p className="text-sm text-gray-500">Total Redemptions</p>
                <p className="text-3xl font-bold text-gray-900">{data.total_redemptions}</p>
                <p className="text-sm font-medium text-success-500">
                    {data.change_pct >= 0 ? '↑' : '↓'} {Math.abs(data.change_pct)}% vs previous period
                </p>
            </div>

            <Card>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={data.daily_series}>
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1e2c6e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}

function MiniStat({ label, value, tone }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white py-3">
            <p className={`text-lg font-bold ${tone}`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}
