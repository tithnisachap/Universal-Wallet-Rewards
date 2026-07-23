import { cn } from '../../lib/cn';

const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300',
    outline: 'bg-white text-brand-600 border border-brand-600 hover:bg-brand-50',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-500/50',
    dangerOutline: 'bg-white text-danger-500 border border-danger-500 hover:bg-danger-50',
    success: 'bg-success-500 text-white hover:bg-success-600',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
};

const sizes = {
    md: 'h-12 px-5 text-sm',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-14 px-6 text-base',
};

export default function Button({
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    children,
    ...props
}) {
    return (
        <Component
            className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {Icon ? <Icon size={18} /> : null}
            {children}
        </Component>
    );
}
