import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Megaphone, MapPin, BarChart3, History, ChevronDown } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { vendorProfile, vendorBranches, vendorTodayOverview } from '../../data/mock';

const quickActions = [
    { to: '/vendor/scanner', label: 'Scan QR', icon: QrCode, tone: 'bg-brand-100 text-brand-600' },
    { to: '/vendor/promotions', label: 'Promotion', icon: Megaphone, tone: 'bg-gray-100 text-gray-500' },
    { to: '/vendor/branches', label: 'Branches', icon: MapPin, tone: 'bg-amber-100 text-amber-600' },
    { to: '/vendor/analytics', label: 'Analytics', icon: BarChart3, tone: 'bg-violet-100 text-violet-600' },
    { to: '/vendor/activity', label: 'Activity', icon: History, tone: 'bg-red-100 text-red-500' },
];

export default function Dashboard() {
    const [branch, setBranch] = useState('all');
    const isSetUp = vendorProfile.status === 'approved';

    return (
        <div>
            <div className="flex items-center justify-between px-4 py-4">
                <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
                <Link to="/vendor/profile">
                    <Avatar size={36} />
                </Link>
            </div>

            <div className="mx-4 rounded-2xl bg-brand-600 p-5 text-white">
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold">Today's Overview</p>
                    <div className="relative">
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="appearance-none rounded-full bg-white/15 py-1.5 pl-3 pr-8 text-sm font-medium text-white"
                        >
                            <option value="all" className="text-gray-900">
                                TK Branches
                            </option>
                            {vendorBranches.map((b) => (
                                <option key={b.id} value={b.id} className="text-gray-900">
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <OverviewTile label="Stamps Added" value={vendorTodayOverview.stampsAdded} />
                    <OverviewTile label="Points Added" value={vendorTodayOverview.pointsAdded} />
                    <OverviewTile label="Stamps Redeemed" value={vendorTodayOverview.stampsRedeemed} />
                    <OverviewTile label="Points Deducted" value={vendorTodayOverview.pointsDeducted} />
                </div>
            </div>

            <div className="px-4 py-5">
                {!isSetUp ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <p className="font-bold text-gray-900">Your shop isn't set up yet</p>
                        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
                            Create your business profile to start creating promotions and managing rewards for your loyal customers.
                        </p>
                        <Button as={Link} to="/vendor/shop-setup" className="mt-4">
                            Set Up Shop
                        </Button>
                    </div>
                ) : null}

                <p className="mb-3 mt-5 font-bold text-gray-900">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-6 shadow-sm"
                        >
                            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${action.tone}`}>
                                <action.icon size={22} />
                            </span>
                            <span className="text-sm font-semibold text-gray-900">{action.label}</span>
                        </Link>
                    ))}
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-6 shadow-sm">
                        <span className="h-12 w-12 rounded-full bg-purple-300" />
                        <span className="text-sm font-semibold text-gray-400">Coming soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewTile({ label, value }) {
    return (
        <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-white/80">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}
