import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import { adminOverview } from '../../data/mock';

export default function Dashboard() {
    const o = adminOverview;
    const donutData = [
        { name: 'Active', value: o.vendorStatus.active, color: '#4338ca' },
        { name: 'Pending', value: o.vendorStatus.pending, color: '#818cf8' },
        { name: 'Rejected', value: o.vendorStatus.rejected, color: '#ef4444' },
        { name: 'Other', value: Math.max(0, o.vendorStatus.total - o.vendorStatus.active - o.vendorStatus.pending - o.vendorStatus.rejected), color: '#e0e7ff' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between px-4 py-4">
                <p className="text-lg font-bold text-brand-600">Admin Dashboard</p>
                <Avatar size={36} />
            </div>

            <div className="mx-4 rounded-2xl bg-brand-600 p-5 text-white">
                <p className="mb-4 font-bold">Today's Overview</p>
                <div className="grid grid-cols-2 gap-3">
                    <OverviewTile label="Total vendors" value={o.totalVendors} />
                    <OverviewTile label="Pending Approvals" value={o.pendingApprovals} />
                    <OverviewTile label="Stamps Redeemed" value={o.stampsRedeemed.toLocaleString()} />
                    <OverviewTile label="Suspended Vendors" value={o.suspendedVendors} />
                </div>
            </div>

            <div className="px-4 py-5">
                <Card>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="font-bold text-gray-900">Vendors Growth</p>
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">2.4k Total</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={o.vendorGrowth}>
                            <defs>
                                <linearGradient id="vendorGrowthFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4338ca" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#4338ca" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={2} fill="url(#vendorGrowthFill)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="mt-4">
                    <p className="mb-3 font-bold text-gray-900">Vendor Status Overview</p>
                    <div className="relative mx-auto h-44 w-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270}>
                                    {donutData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-gray-900">{o.vendorStatus.total}</p>
                            <p className="text-xs text-gray-400">Total</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                        <LegendRow color="bg-indigo-700" label="Active" value={`${o.vendorStatus.active} (${pct(o.vendorStatus.active, o.vendorStatus.total)}%)`} />
                        <LegendRow color="bg-indigo-300" label="Pending" value={`${o.vendorStatus.pending} (${pct(o.vendorStatus.pending, o.vendorStatus.total)}%)`} />
                        <LegendRow color="bg-red-500" label="Rejected" value={`${o.vendorStatus.rejected} (${pct(o.vendorStatus.rejected, o.vendorStatus.total)}%)`} />
                    </div>
                </Card>

                <p className="mb-3 mt-4 font-bold text-gray-900">Platform Activity</p>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Total Customers" value={o.platformActivity.totalCustomers.toLocaleString()} />
                    <StatCard label="Stamps Issued" value={o.platformActivity.stampsIssued.toLocaleString()} />
                    <StatCard label="Points Issued" value={o.platformActivity.pointsIssued.toLocaleString()} />
                    <StatCard label="Rewards Redeemed" value={o.platformActivity.rewardsRedeemed.toLocaleString()} />
                </div>
            </div>
        </div>
    );
}

function pct(value, total) {
    if (!total) return '0';
    return ((value / total) * 100).toFixed(1);
}

function OverviewTile({ label, value }) {
    return (
        <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-white/80">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

function LegendRow({ color, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-600">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
            </span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
