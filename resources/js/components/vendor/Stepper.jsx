import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Stepper({ steps, current }) {
    return (
        <div className="flex items-center px-4 py-4">
            {steps.map((step, i) => (
                <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                                i < current ? 'bg-brand-600 text-white' : i === current ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400',
                            )}
                        >
                            {i < current ? <Check size={16} /> : i + 1}
                        </div>
                        <span className={cn('text-xs font-medium', i <= current ? 'text-brand-600' : 'text-gray-400')}>{step}</span>
                    </div>
                    {i < steps.length - 1 ? (
                        <div className={cn('mx-2 h-0.5 flex-1', i < current ? 'bg-brand-600' : 'bg-gray-200')} />
                    ) : null}
                </div>
            ))}
        </div>
    );
}
