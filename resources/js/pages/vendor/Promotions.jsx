import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Coffee, Percent, Cake, Gift, Tag, Star } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PillTabs } from '../../components/ui/Tabs';
import { promotions, vendorProfile } from '../../data/mock';

const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' },
];

const categoryIcons = {
    Drinks: Coffee,
    Food: Cake,
    Discount: Percent,
};

export default function Promotions() {
    const [filter, setFilter] = useState('all');
    const list = filter === 'all' ? promotions : promotions.filter((p) => p.status === filter);

    return (
        <div>
            <PageHeader
                title="Promotion"
                right={
                    <Button as={Link} to="/vendor/promotions/create" size="sm" icon={Plus} className="w-auto">
                        Create Promotion
                    </Button>
                }
            />
            <div className="px-4 py-4">
                <Card className="mb-4 flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-amber-900" />
                    <div>
                        <p className="font-bold text-gray-900">{vendorProfile.businessName}</p>
                        <p className="text-sm text-gray-500">{vendorProfile.category}</p>
                    </div>
                </Card>

                <p className="mb-2 font-bold text-gray-900">Promotions</p>
                <PillTabs options={filters} value={filter} onChange={setFilter} className="mb-4 rounded-xl bg-white p-1 shadow-sm" />

                <div className="space-y-3">
                    {list.map((promo) => {
                        const Icon = categoryIcons[promo.category] ?? Tag;
                        return (
                            <Link key={promo.id} to={`/vendor/promotions/${promo.id}/edit`}>
                                <Card className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                        <Icon size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <Badge tone={promo.status}>{promo.status}</Badge>
                                            <span className="text-xs text-gray-400">{promo.date}</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">{promo.title}</p>
                                        <p className="truncate text-sm text-gray-500">{promo.description}</p>
                                        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-brand-600">
                                            {promo.type === 'stamps' ? <Star size={14} /> : <Tag size={14} />} {promo.requirement}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
