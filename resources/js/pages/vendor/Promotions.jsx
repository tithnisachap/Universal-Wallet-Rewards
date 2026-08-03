import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Percent, Megaphone, Tag, Star } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import VendorAvatar from '../../components/VendorAvatar';
import { PillTabs } from '../../components/ui/Tabs';
import { useVendorPromotions, useVendorProfile } from '../../queries/vendor';

const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' },
];

const categoryIcons = {
    Item: Tag,
    Promotion: Percent,
};

function matchesFilter(promo, filter) {
    if (filter === 'all') return true;
    if (filter === 'expired') return promo.display_status === 'expired' || promo.display_status === 'deactivated';
    return promo.display_status === filter;
}

export default function Promotions({ basePath = '/vendor' }) {
    const isStaff = basePath === '/staff';
    const [filter, setFilter] = useState('all');
    const { data: vendor } = useVendorProfile();
    const { data: promotions, isLoading, isError, error, refetch } = useVendorPromotions();
    const list = promotions?.filter((p) => matchesFilter(p, filter)) ?? [];

    return (
        <div>
            <PageHeader
                title="Promotion"
                right={
                    isStaff ? null : (
                        <Button as={Link} to="/vendor/promotions/create" size="sm" icon={Plus} className="w-auto">
                            Create Promotion
                        </Button>
                    )
                }
            />
            <div className="px-4 py-4">
                <Card className="mb-4 flex items-center gap-3">
                    <VendorAvatar vendor={vendor} />
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.business_name}</p>
                        <p className="text-sm text-gray-500">{vendor?.category}</p>
                    </div>
                </Card>

                <p className="mb-2 font-bold text-gray-900">Promotions</p>
                <PillTabs options={filters} value={filter} onChange={setFilter} className="mb-4 rounded-xl bg-white p-1 shadow-sm" />

                <div className="space-y-3">
                    <QueryState
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onRetry={refetch}
                        isEmpty={list.length === 0}
                        emptyState={
                            <EmptyState
                                icon={Megaphone}
                                title="No promotions"
                                description="Create a promotion to start rewarding your customers."
                            />
                        }
                    >
                        {list.map((promo) => {
                            const Icon = categoryIcons[promo.category] ?? Tag;
                            const content = (
                                <Card className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                        <Icon size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <Badge tone={promo.display_status === 'deactivated' ? 'neutral' : promo.display_status}>
                                                {promo.display_status}
                                            </Badge>
                                            <span className="text-xs text-gray-400">
                                                {new Date(promo.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{promo.title}</p>
                                        <p className="truncate text-sm text-gray-500">{promo.description}</p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-brand-600">
                                            {promo.type === 'stamps' ? <Star size={14} /> : <Tag size={14} />}{' '}
                                            {promo.required_amount} {promo.type === 'stamps' ? 'Stamps' : 'Points'}
                                        </p>
                                    </div>
                                </Card>
                            );

                            // Staff can view promotions but never edit them —
                            // a promotion applies to the whole business, not
                            // just their branch, so editing stays owner-only.
                            return isStaff ? (
                                <div key={promo.id}>{content}</div>
                            ) : (
                                <Link key={promo.id} to={`/vendor/promotions/${promo.id}/edit`} className="block">
                                    {content}
                                </Link>
                            );
                        })}
                    </QueryState>
                </div>
            </div>
        </div>
    );
}
