import { cn } from '../../lib/cn';

export function SegmentedControl({ options, value, onChange, className }) {
    return (
        <div className={cn('flex gap-1 rounded-xl bg-gray-100 p-1', className)}>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
                        value === option.value ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export function PillTabs({ options, value, onChange, className }) {
    return (
        <div className={cn('flex gap-2 overflow-x-auto', className)}>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                        value === option.value ? 'bg-brand-100 text-brand-600' : 'text-gray-500',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
