import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Megaphone, MapPin, BarChart3, History, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import { useVendorBranches, useVendorDashboard, useVendorProfile } from '../../queries/vendor';
import { useMe } from '../../queries/auth';
import { VENDOR_STATUS_MESSAGES } from '../../data/vendorStatusMessages';

function quickActionsFor(basePath, isStaff) {
    const actions = [
        { to: `${basePath}/scanner`, label: 'Scan QR', icon: QrCode, tone: 'bg-brand-100 text-brand-600' },
        { to: `${basePath}/promotions`, label: 'Promotion', icon: Megaphone, tone: 'bg-gray-100 text-gray-500' },
        { to: '/vendor/branches', label: 'Branches', icon: MapPin, tone: 'bg-amber-100 text-amber-600' },
        { to: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3, tone: 'bg-violet-100 text-violet-600' },
        { to: `${basePath}/activity`, label: 'Activity', icon: History, tone: 'bg-red-100 text-red-500' },
    ];

    // Branch management is an owner-level action — staff manage their own
    // branch's day-to-day, not the business's branch structure.
    return isStaff ? actions.filter((a) => a.label !== 'Branches') : actions;
}

export default function Dashboard({ basePath = '/vendor' }) {
    const isStaff = basePath === '/staff';
    const [branchId, setBranchId] = useState('all');
    // isError here specifically means "no vendor record exists at all" (a
    // real 404) — distinct from "a vendor record exists but isn't approved
    // yet" (pending/rejected/suspended), which needs different messaging.
    const { data: vendor, isError: hasNoShop } = useVendorProfile();
    const { data: me } = useMe({ enabled: isStaff });
    const { data: branches } = useVendorBranches({ enabled: !isStaff });
    const { data: overview, isLoading, isError, error, refetch } = useVendorDashboard(
        isStaff ? null : (branchId === 'all' ? null : branchId),
    );

    const isApproved = vendor?.status === 'approved';
    const quickActions = quickActionsFor(basePath, isStaff);

    return (
        <div>
            <div className="mx-4 mt-4 rounded-2xl bg-brand-600 p-5 text-white">
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold">Today's Overview</p>
                    {isStaff ? (
                        <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
                            {me?.branch?.name ?? 'Your Branch'}
                        </span>
                    ) : (
                        <div className="relative">
                            <select
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                                className="appearance-none rounded-full bg-white/15 py-1.5 pl-3 pr-8 text-sm font-medium text-white"
                            >
                                <option value="all" className="text-gray-900">
                                    All Branches
                                </option>
                                {branches?.map((b) => (
                                    <option key={b.id} value={b.id} className="text-gray-900">
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    )}
                </div>
                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    <div className="grid grid-cols-2 gap-3">
                        <OverviewTile label="Stamps Added" value={overview?.today.stamps_added ?? 0} />
                        <OverviewTile label="Points Added" value={overview?.today.points_added ?? 0} />
                        <OverviewTile label="Stamps Redeemed" value={overview?.today.stamps_redeemed ?? 0} />
                        <OverviewTile label="Points Deducted" value={overview?.today.points_deducted ?? 0} />
                    </div>
                </QueryState>
            </div>

            <div className="px-4 py-5">
                {!isStaff && hasNoShop ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <p className="font-bold text-gray-900">Your shop isn't set up yet</p>
                        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
                            Create your business profile to start creating promotions and managing rewards for your loyal customers.
                        </p>
                        <Button as={Link} to="/vendor/shop-setup" className="mt-4">
                            Set Up Shop
                        </Button>
                    </div>
                ) : !isStaff && vendor && !isApproved ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <p className="font-bold capitalize text-gray-900">Shop {vendor.status}</p>
                        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
                            {VENDOR_STATUS_MESSAGES[vendor.status]}
                        </p>
                        <Button as={Link} to="/vendor/profile" variant="outline" className="mt-4">
                            View Profile
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
                    {!isStaff ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white py-6 shadow-sm">
                            <span className="h-12 w-12 rounded-full bg-purple-300" />
                            <span className="text-sm font-semibold text-gray-400">Coming soon</span>
                        </div>
                    ) : null}
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
