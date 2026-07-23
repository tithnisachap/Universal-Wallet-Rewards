import { useState } from 'react';
import { Users, Store, Sparkles, Star } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { PillTabs } from '../../components/ui/Tabs';
import StatTile from '../../components/ui/StatTile';
import Card from '../../components/ui/Card';
import { adminAnalytics } from '../../data/mock';

const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
];

export default function Analytics() {
    const [period, setPeriod] = useState('month');
    const a = adminAnalytics;

    return (
        <div className="px-4 py-4">
            <h1 className="text-center text-xl font-bold text-gray-900">Analytics</h1>

            <PillTabs
                options={periods}
                value={period}
                onChange={setPeriod}
                className="mt-4 justify-center rounded-xl bg-brand-50 p-1"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
                <StatTile label="Total Customers" value={a.totalCustomers.toLocaleString()} icon={Users} trend={`↑ ${a.customerGrowthPct}`} />
                <StatTile label="Active Vendors" value={a.activeVendors} icon={Store} trend={`↑ ${a.vendorGrowthPct}`} />
            </div>

            <div className="mt-4">
                <p className="mb-2 font-bold text-gray-900">Vendor Growth</p>
                <Card>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={a.vendorGrowthSeries}>
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
                        <AreaChart data={a.customerGrowthSeries}>
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
                <StatTile label="Stamps Issued" value={a.stampsIssued.toLocaleString()} icon={Sparkles} trend="↑ 15.3%" />
                <StatTile label="Points Issued" value={a.pointsIssued.toLocaleString()} icon={Star} trend="↑ 18.7%" />
            </div>
        </div>
    );
}
