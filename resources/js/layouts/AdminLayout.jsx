import { Outlet } from 'react-router-dom';
import { Home, Store, BarChart3, Menu } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

const navItems = [
    { to: '/admin/dashboard', label: 'Home', icon: Home, end: true },
    { to: '/admin/vendors', label: 'Vendors', icon: Store },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/more', label: 'More', icon: Menu },
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="flex-1">
                <Outlet />
            </div>
            <BottomNav items={navItems} />
        </div>
    );
}
