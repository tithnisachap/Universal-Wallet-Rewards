import { cn } from '../../lib/cn';

export default function Card({ className, children, ...props }) {
    return (
        <div className={cn('rounded-2xl bg-white p-4 shadow-sm', className)} {...props}>
            {children}
        </div>
    );
}
