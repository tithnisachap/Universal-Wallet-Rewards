import { colorFor } from '../lib/avatarColor';
import { cn } from '../lib/cn';

const SIZES = {
    sm: 'h-11 w-11 text-base',
    md: 'h-12 w-12 text-lg',
    lg: 'h-14 w-14 text-lg',
};

export default function VendorAvatar({ vendor, size = 'md', className }) {
    const sizeClass = SIZES[size] ?? SIZES.md;

    if (vendor?.logo_url) {
        return (
            <img
                src={vendor.logo_url}
                alt={vendor.business_name}
                className={cn('shrink-0 rounded-full object-cover', sizeClass, className)}
            />
        );
    }

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
                sizeClass,
                colorFor(vendor?.id ?? vendor?.business_name),
                className,
            )}
        >
            {vendor?.business_name?.charAt(0) ?? '?'}
        </div>
    );
}
