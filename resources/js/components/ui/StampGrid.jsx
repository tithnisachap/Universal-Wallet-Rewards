import { Coffee, Gift } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function StampGrid({ total = 10, collected = 0 }) {
    return (
        <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: total }, (_, i) => {
                const filled = i < collected;
                const isLast = i === total - 1;
                const Icon = isLast ? Gift : Coffee;

                return (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-full',
                                filled ? 'bg-brand-600 text-white' : 'border-2 border-dashed border-gray-300 text-gray-300',
                            )}
                        >
                            <Icon size={18} />
                        </div>
                        {!isLast && <span className="text-xs text-gray-400">{i + 1}</span>}
                    </div>
                );
            })}
        </div>
    );
}
