import { cn } from '../../lib/cn';

export default function Chip({ active, icon: Icon, children, className, ...props }) {
    return (
        <button
            className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active ? 'bg-brand-600 text-white' : 'bg-white text-gray-700 shadow-sm',
                className,
            )}
            {...props}
        >
            {Icon ? <Icon size={15} /> : null}
            {children}
        </button>
    );
}
