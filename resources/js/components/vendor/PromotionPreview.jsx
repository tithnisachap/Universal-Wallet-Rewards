import { Calendar, Tag, Info } from 'lucide-react';
import Card from '../ui/Card';
import StampGrid from '../ui/StampGrid';
import VendorAvatar from '../VendorAvatar';

export default function PromotionPreview({ value, vendor, audience = 'customers' }) {
    return (
        <div className="space-y-4">
            <div>
                <p className="font-bold text-gray-900">This is how your promotion will look</p>
                <p className="text-sm text-gray-500">This is the preview for {audience}.</p>
            </div>

            <Card className="p-0">
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <VendorAvatar vendor={vendor} size="sm" />
                    <div>
                        <p className="font-bold text-gray-900">{vendor?.business_name}</p>
                        <p className="text-xs text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>
                <div className="px-4 py-4">
                    {value.type === 'stamps' ? (
                        <>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-semibold text-gray-900">Collect stamps</p>
                                <p className="font-bold text-brand-600">0 / {value.amount}</p>
                            </div>
                            <StampGrid total={value.amount} collected={0} />
                            <p className="mt-3 text-sm text-gray-500">{value.description}</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-gray-900">{value.description || value.title}</p>
                            <p className="mt-2 text-lg font-bold text-brand-600">{value.amount} points</p>
                        </>
                    )}
                </div>
            </Card>

            <Card className="divide-y divide-gray-100 p-0">
                <InfoRow icon={Calendar} label="Promotion Period" value={`${value.startDate} - ${value.endDate}`} />
                <InfoRow icon={Tag} label="Promotion Category" value={value.category} />
                <InfoRow
                    icon={Info}
                    label="Terms & Conditions"
                    value="This promotion cannot be combined with other discounts. Stamps are non-transferable."
                    chevron
                />
            </Card>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, chevron }) {
    return (
        <div className="flex items-start gap-3 px-4 py-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={16} />
            </span>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{value}</p>
            </div>
        </div>
    );
}
