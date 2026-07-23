import { User } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Avatar({ src, alt = '', size = 44, className }) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                style={{ width: size, height: size }}
                className={cn('rounded-full object-cover', className)}
            />
        );
    }

    return (
        <div
            style={{ width: size, height: size }}
            className={cn('flex items-center justify-center rounded-full bg-brand-100 text-brand-500', className)}
        >
            <User size={size * 0.55} />
        </div>
    );
}
