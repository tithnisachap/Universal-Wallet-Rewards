import { Calendar } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import { Select } from '../../components/ui/Field';
import { vendorActivity } from '../../data/mock';

export default function Activity() {
    return (
        <div>
            <PageHeader title="Activity" />
            <div className="px-4 py-4">
                <div className="mb-4 flex gap-3">
                    <Select defaultValue="all" className="flex-1">
                        <option value="all">All Types</option>
                        <option value="points">Points</option>
                        <option value="stamps">Stamps</option>
                        <option value="redeem">Redemptions</option>
                    </Select>
                    <div className="relative flex-1">
                        <Select defaultValue="today" className="pr-9">
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </Select>
                        <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {vendorActivity.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-3">
                            <Avatar size={36} className={item.type === 'points_deduct' ? 'bg-danger-50 text-danger-500' : undefined} />
                            <div className="flex-1">
                                <p
                                    className={`font-semibold ${
                                        item.type === 'points_deduct'
                                            ? 'text-danger-500'
                                            : item.type === 'redeem'
                                              ? 'text-amber-600'
                                              : 'text-brand-600'
                                    }`}
                                >
                                    {item.label}
                                </p>
                                <p className="text-sm text-gray-500">{item.name}</p>
                            </div>
                            <span className="text-sm text-gray-400">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
