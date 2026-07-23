import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function SearchInput({ className, ...props }) {
    return (
        <div className={cn('relative', className)}>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                className="w-full rounded-xl bg-gray-100 py-3 pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                {...props}
            />
        </div>
    );
}
