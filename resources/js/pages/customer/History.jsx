import { useParams } from 'react-router-dom';
import { Plus, Gift } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { vendors, activityHistory } from '../../data/mock';

export default function History() {
    const { vendorId } = useParams();
    const vendor = vendors.find((v) => v.id === vendorId);

    const iconFor = (type) => (type === 'reward_redeemed' ? Gift : Plus);
    const toneFor = (type) => (type === 'reward_redeemed' ? 'bg-danger-50 text-danger-500' : 'bg-brand-50 text-brand-600');

    return (
        <div>
            <PageHeader title="Universal Wallet" />
            <div className="px-4 py-4">
                <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${vendor?.color}`}>
                        {vendor?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <h2 className="font-bold text-gray-900">Points History</h2>
                <p className="mb-3 text-sm text-gray-500">All your points activities at {vendor?.name}.</p>

                <Card className="divide-y divide-gray-100 p-0">
                    {activityHistory.map((entry) => {
                        const Icon = iconFor(entry.type);
                        return (
                            <div key={entry.id} className="px-4 py-3">
                                <div className="flex items-center gap-3">
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
                                {entry.tag ? (
                                    <div className="ml-12 mt-2 inline-block rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
                                        {entry.tag}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </Card>
            </div>
        </div>
    );
}
