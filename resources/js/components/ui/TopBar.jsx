import { Link } from 'react-router-dom';
import { useMe } from '../../queries/auth';
import Avatar from './Avatar';

const panelLabels = {
    customer: 'Customer',
    vendor: 'Vendor',
    branch_staff: 'Branch Staff',
    admin: 'Admin',
};

const homeRoutes = {
    customer: '/customer/coupons',
    vendor: '/vendor/dashboard',
    branch_staff: '/staff/dashboard',
    admin: '/admin/dashboard',
};

const profileRoutes = {
    customer: '/customer/profile',
    vendor: '/vendor/profile',
    branch_staff: '/staff/profile',
    admin: '/admin/profile',
};

export default function TopBar({ panel }) {
    const { data: me } = useMe();
    const label = panel ?? (me?.role ? panelLabels[me.role] : null);
    const homeRoute = me?.role ? (homeRoutes[me.role] ?? '/') : '/';
    const profileRoute = me?.role ? (profileRoutes[me.role] ?? '/') : '/';

    return (
        <div className="sticky top-0 z-50 flex h-12 w-full shrink-0 items-center justify-between overflow-hidden border-b border-gray-100 bg-white px-4">
            <Link to={homeRoute} className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="shrink-0 text-sm font-bold text-brand-600">Universal Wallet</span>
                {label ? (
                    <>
                        <span className="shrink-0 text-gray-300">·</span>
                        <span className="truncate text-sm font-medium text-gray-500">{label}</span>
                    </>
                ) : null}
            </Link>
            <Link to={profileRoute} className="ml-3 shrink-0">
                <Avatar src={me?.avatar} size={28} />
            </Link>
        </div>
    );
}
