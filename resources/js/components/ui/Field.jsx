import { cn } from '../../lib/cn';

const fieldClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export function Label({ children, hint }) {
    return (
        <div className="mb-1.5 flex items-baseline justify-between">
            <label className="text-sm font-medium text-gray-700">{children}</label>
            {hint ? <span className="text-xs text-gray-400">{hint}</span> : null}
        </div>
    );
}

export function Input({ className, ...props }) {
    return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }) {
    return <textarea className={cn(fieldClass, 'min-h-24 resize-none', className)} {...props} />;
}

export function Select({ className, children, compact = false, ...props }) {
    return (
        <select
            className={cn(
                'rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
                'appearance-none bg-no-repeat',
                compact ? 'h-8 w-auto pl-3 pr-7 text-xs' : 'w-full px-4 py-3 pr-8 text-sm',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}

export function Field({ label, hint, children }) {
    return (
        <div>
            {label ? <Label hint={hint}>{label}</Label> : null}
            {children}
        </div>
    );
}
