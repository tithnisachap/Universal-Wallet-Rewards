import { useParams, Link } from 'react-router-dom';
import { Star, ArrowRight, Plus, Gift } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StampGrid from '../../components/ui/StampGrid';
import QueryState from '../../components/ui/QueryState';
import VendorAvatar from '../../components/VendorAvatar';
import { activityLabel, formatAmount, formatDateTime } from '../../lib/activityLabels';
import { useVendorBranchesForCustomer, useVendorDetail, useVendorLoyalty } from '../../queries/customer';

export default function BranchLoyalty() {
    const { vendorId, branchId } = useParams();
    const { data: vendor } = useVendorDetail(vendorId);
    const { data: branches } = useVendorBranchesForCustomer(vendorId);
    const branch = branches?.find((b) => String(b.id) === branchId);

    const { data: loyalty, isLoading, isError, error, refetch } = useVendorLoyalty(vendorId);

    const iconFor = (type) => (type === 'reward_redeemed' ? Gift : Plus);
    const toneFor = (type) => (type === 'reward_redeemed' ? 'bg-danger-50 text-danger-500' : 'bg-brand-50 text-brand-600');

    return (
        <div>
            <PageHeader title={branch?.name ?? 'Branch'} />
            <div className="space-y-4 px-4 py-4">
                <div className="flex items-center gap-3">
                    <VendorAvatar vendor={vendor} />
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.business_name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    {loyalty ? (
                        <>
                            <Card>
                                <p className="text-sm text-gray-500">Your Points</p>
                                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-brand-600">
                                    <Star size={20} className="fill-warning-500 text-warning-500" /> {loyalty.points_balance} Points
                                </p>
                            </Card>

                            {loyalty.active_stamp_promotion ? (
                                <Card>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-900">Your Stamps</p>
                                        <p className="font-bold text-brand-600">
                                            {loyalty.stamps_count} / {loyalty.active_stamp_promotion.required_amount}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <StampGrid
                                            total={loyalty.active_stamp_promotion.required_amount}
                                            collected={loyalty.stamps_count}
                                        />
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500">{loyalty.active_stamp_promotion.description}</p>
                                    {loyalty.can_claim_reward ? (
                                        <Button as={Link} to={`/customer/vendors/${vendorId}/claim-reward`} className="mt-4">
                                            Claim Reward
                                        </Button>
                                    ) : null}
                                </Card>
                            ) : null}

                            <div>
                                <p className="mb-2 font-bold text-gray-900">Activity History</p>
                                {loyalty.recent_activity.length === 0 ? (
                                    <Card className="py-8 text-center text-sm text-gray-400">No activity yet.</Card>
                                ) : (
                                    <Card className="divide-y divide-gray-100 p-0">
                                        {loyalty.recent_activity.map((entry) => {
                                            const Icon = iconFor(entry.type);
                                            const { date, time } = formatDateTime(entry.occurred_at);

                                            return (
                                                <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                                                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneFor(entry.type)}`}>
                                                        <Icon size={16} />
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">{activityLabel(entry.type)}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {date} • {time}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`text-sm font-bold ${entry.amount < 0 ? 'text-danger-500' : 'text-brand-600'}`}
                                                    >
                                                        {formatAmount(entry.amount)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </Card>
                                )}
                                <Link
                                    to={`/customer/vendors/${vendorId}/history`}
                                    className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600"
                                >
                                    View all History <ArrowRight size={16} />
                                </Link>
                            </div>
                        </>
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}
