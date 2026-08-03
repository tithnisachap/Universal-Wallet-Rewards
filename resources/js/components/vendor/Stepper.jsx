import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Stepper({ steps, current }) {
    return (
        <div className="flex items-start px-4 py-4">
            {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const done = i < current;
                const active = i === current;
                return (
                    <>
                        <div key={step} className={`flex flex-col items-center gap-1 ${isLast ? 'ml-auto' : ''}`}>
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                                    done || active ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400',
                                )}
                            >
                                {done ? <Check size={16} /> : i + 1}
                            </div>
                            <span className={cn('text-xs font-medium', i <= current ? 'text-brand-600' : 'text-gray-400')}>
                                {step}
                            </span>
                        </div>
                        {!isLast ? (
                            <div key={`line-${i}`} className={cn('mx-3 mt-4 h-0.5 flex-1', done ? 'bg-brand-600' : 'bg-gray-200')} />
                        ) : null}
                    </>
                );
            })}
        </div>
    );
}
