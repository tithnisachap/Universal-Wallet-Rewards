import { Tag, Percent, Minus, Plus, Star, DollarSign } from 'lucide-react';
import { Field, Input, Textarea } from '../ui/Field';

const categories = [
    { value: 'Item', label: 'Item', icon: Tag },
    { value: 'Promotion', label: 'Promotion', icon: Percent },
];

export default function PromotionForm({ value, onChange }) {
    function set(key, val) {
        onChange({ ...value, [key]: val });
    }

    return (
        <div className="space-y-5">
            <div>
                <p className="font-bold text-gray-900">Configure Promotion</p>
                <p className="text-sm text-gray-500">Set up the details of your promotion.</p>
            </div>

            <Field label="Promotion Type">
                <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => onChange({ ...value, type: 'stamps', amount: Math.min(30, value.amount) })}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${
                            value.type === 'stamps' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'
                        }`}
                    >
                        <Star size={16} /> Stamps
                    </button>
                    <button
                        type="button"
                        onClick={() => set('type', 'points')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${
                            value.type === 'points' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'
                        }`}
                    >
                        <DollarSign size={16} /> Points
                    </button>
                </div>
            </Field>

            <Field label="Promotion Category">
                <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => set('category', cat.value)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold ${
                                value.category === cat.value ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            <cat.icon size={15} /> {cat.label}
                        </button>
                    ))}
                </div>
            </Field>

            <Field label="Promotion Title" hint={`${value.title.length}/50`}>
                <Input value={value.title} onChange={(e) => set('title', e.target.value)} maxLength={50} />
            </Field>

            <Field label="Description" hint={`${value.description.length}/120`}>
                <Textarea value={value.description} onChange={(e) => set('description', e.target.value)} maxLength={120} />
            </Field>

            <Field label={value.type === 'stamps' ? 'Required Stamps' : 'Required Points'}>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
                    <button
                        type="button"
                        onClick={() => set('amount', Math.max(1, value.amount - (value.type === 'stamps' ? 1 : 10)))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
                    >
                        <Minus size={16} />
                    </button>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={value.type === 'stamps' ? 30 : undefined}
                        value={value.amount}
                        onChange={(e) => {
                            const raw = Number(e.target.value) || 1;
                            const clamped = value.type === 'stamps' ? Math.min(30, Math.max(1, raw)) : Math.max(1, raw);
                            set('amount', clamped);
                        }}
                        className="w-20 border-none text-center text-2xl font-bold text-gray-900 [appearance:textfield] focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            set(
                                'amount',
                                value.type === 'stamps'
                                    ? Math.min(30, value.amount + 1)
                                    : value.amount + 10,
                            )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                    {value.type === 'stamps'
                        ? 'Set how many stamps are needed to redeem this promotion (max 30).'
                        : 'Set how many points are needed to redeem this promotion.'}
                </p>
            </Field>

            <Field label="Promotion Period">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Start Date</p>
                        <Input type="date" value={value.startDate} onChange={(e) => set('startDate', e.target.value)} />
                    </div>
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">End Date</p>
                        <Input type="date" value={value.endDate} onChange={(e) => set('endDate', e.target.value)} />
                    </div>
                </div>
            </Field>
        </div>
    );
}

export const defaultPromotionForm = {
    type: 'stamps',
    category: 'Item',
    title: '',
    description: '',
    amount: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
};
