import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Row({ as: Component = 'div', className, chevron = true, children, ...props }) {
    return (
        <Component className={cn('flex items-center justify-between border-b border-gray-100 py-3 last:border-0', className)} {...props}>
            <div className="flex-1">{children}</div>
            {chevron ? <ChevronRight size={18} className="shrink-0 text-gray-300" /> : null}
        </Component>
    );
}
