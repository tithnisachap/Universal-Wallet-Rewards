import { cn } from '../../lib/cn';

export default function StatTile({ label, value, icon: Icon, trend, dark = false, className }) {
    return (
        <div
            className={cn(
                'rounded-xl p-4',
                dark ? 'bg-white/10 text-white' : 'border border-gray-100 bg-white text-gray-900',
                className,
            )}
        >
            <div className="flex items-center gap-2 text-sm">
                {Icon ? <Icon size={16} className={dark ? 'text-white/80' : 'text-gray-400'} /> : null}
                <span className={dark ? 'text-white/80' : 'text-gray-500'}>{label}</span>
            </div>
            <div className="mt-1 text-2xl font-bold">{value}</div>
            {trend ? <div className="mt-1 text-xs font-medium text-success-500">{trend}</div> : null}
        </div>
    );
}
