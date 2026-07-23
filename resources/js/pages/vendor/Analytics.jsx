import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { SegmentedControl } from '../../components/ui/Tabs';
import { Select } from '../../components/ui/Field';
import { vendorAnalytics } from '../../data/mock';

export default function Analytics() {
    const [tab, setTab] = useState('customers');

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

                {tab === 'customers' ? <CustomerAnalytics /> : <RedemptionAnalytics />}
            </div>
        </div>
    );
}

function CustomerAnalytics() {
    const a = vendorAnalytics;
    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-gray-400">Total Customers</p>
                <Select compact defaultValue="7d">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </Select>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">{a.totalCustomers.toLocaleString()}</p>
                <p className="text-sm font-medium text-success-500">↑ {a.customerGrowthPct} vs last 7 days</p>
            </div>

            <Card>
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={a.customerGrowth}>
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
                <MiniStat label="Points Added" value={a.pointsAdded.toLocaleString()} tone="text-brand-600" />
                <MiniStat label="Points Deducted" value={a.pointsDeducted.toLocaleString()} tone="text-danger-500" />
                <MiniStat label="Stamps Added" value={a.stampsAdded.toLocaleString()} tone="text-amber-600" />
                <MiniStat label="Stamps redeem" value={a.stampsRedeemed.toLocaleString()} tone="text-gray-700" />
            </div>

            <div>
                <p className="mb-2 font-bold text-gray-900">Points Transactions Overview</p>
                <Card>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={a.pointsTransactions}>
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
                        <BarChart data={a.stampsTransactions}>
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

function RedemptionAnalytics() {
    const a = vendorAnalytics;
    return (
        <div className="mt-4 space-y-4">
            <div>
                <p className="mb-2 font-bold text-gray-900">Top Promotions (This Month)</p>
                <Card className="divide-y divide-gray-100 p-0">
                    {a.topPromotions.map((promo) => (
                        <div key={promo.rank} className="flex items-center gap-3 px-4 py-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-600">
                                {promo.rank}
                            </span>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{promo.title}</p>
                                <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                                    <div
                                        className="h-1.5 rounded-full bg-brand-600"
                                        style={{ width: `${Math.min(100, (promo.redeemed / a.topPromotions[0].redeemed) * 100)}%` }}
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
            </div>

            <div className="flex justify-end">
                <Select compact defaultValue="week">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </Select>
            </div>

            <div>
                <p className="text-sm text-gray-500">Total Redemptions</p>
                <p className="text-3xl font-bold text-gray-900">{a.totalRedemptions}</p>
                <p className="text-sm font-medium text-success-500">↑ {a.redemptionsChangePct} vs last week</p>
            </div>

            <Card>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={a.redemptionsByDay}>
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
