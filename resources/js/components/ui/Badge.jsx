import { cn } from '../../lib/cn';

const tones = {
    pending: 'bg-warning-50 text-warning-600',
    approved: 'bg-success-50 text-success-600',
    active: 'bg-brand-100 text-brand-600',
    rejected: 'bg-danger-50 text-danger-500',
    scheduled: 'bg-brand-100 text-brand-600',
    expired: 'bg-gray-200 text-gray-500',
    suspended: 'bg-danger-50 text-danger-500',
    neutral: 'bg-gray-100 text-gray-600',
};

export default function Badge({ tone = 'neutral', className, children }) {
    return (
        <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize', tones[tone], className)}>
            {children}
        </span>
    );
}
