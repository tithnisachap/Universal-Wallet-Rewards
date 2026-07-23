import { useParams, Link } from 'react-router-dom';
import { Star, ArrowRight, Plus, Gift } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StampGrid from '../../components/ui/StampGrid';
import { vendors, branches, activityHistory } from '../../data/mock';

export default function BranchLoyalty() {
    const { vendorId, branchId } = useParams();
    const vendor = vendors.find((v) => v.id === vendorId);
    const branch = (branches[vendorId] ?? []).find((b) => b.id === branchId);
    const stampsFull = vendor.stamps >= vendor.stampsRequired;

    const iconFor = (type) => (type === 'points_earned' || type === 'stamp_earned' ? Plus : Gift);
    const toneFor = (type) => (type === 'reward_redeemed' ? 'bg-danger-50 text-danger-500' : 'bg-brand-50 text-brand-600');

    return (
        <div>
            <PageHeader title={branch?.name ?? 'Branch'} />
            <div className="space-y-4 px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${vendor?.color}`}>
                        {vendor?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <Card>
                    <p className="text-sm text-gray-500">Your Points</p>
                    <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-brand-600">
                        <Star size={20} className="fill-warning-500 text-warning-500" /> {vendor.points} Points
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">Your Stamps</p>
                        <p className="font-bold text-brand-600">
                            {vendor.stamps} / {vendor.stampsRequired}
                        </p>
                    </div>
                    <div className="mt-4">
                        <StampGrid total={vendor.stampsRequired} collected={vendor.stamps} />
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                        Get 1 Free Drink when you collect all {vendor.stampsRequired} stamps.
                    </p>
                    {stampsFull ? (
                        <Button as={Link} to={`/customer/vendors/${vendorId}/claim-reward`} className="mt-4">
                            Claim Reward
                        </Button>
                    ) : null}
                </Card>

                <div>
                    <p className="mb-2 font-bold text-gray-900">Activity History</p>
                    <Card className="divide-y divide-gray-100 p-0">
                        {activityHistory.slice(0, 3).map((entry) => {
                            const Icon = iconFor(entry.type);
                            return (
                                <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneFor(entry.type)}`}>
                                        <Icon size={16} />
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{entry.label}</p>
                                        <p className="text-xs text-gray-500">
                                            {entry.date} • {entry.time}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-bold ${entry.value.startsWith('-') ? 'text-danger-500' : 'text-brand-600'}`}>
                                        {entry.value}
                                    </span>
                                </div>
                            );
                        })}
                    </Card>
                    <Link
                        to={`/customer/vendors/${vendorId}/history`}
                        className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600"
                    >
                        View all History <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
