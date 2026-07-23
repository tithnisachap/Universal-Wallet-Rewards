import { Outlet } from 'react-router-dom';
import { Ticket, QrCode, Navigation, User } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

const navItems = [
    { to: '/customer/coupons', label: 'Coupons', icon: Ticket },
    { to: '/customer/qr-code', label: 'QR Code', icon: QrCode },
    { to: '/customer/location', label: 'Location', icon: Navigation },
    { to: '/customer/profile', label: 'Profile', icon: User },
];

export default function CustomerLayout() {
    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="flex-1">
                <Outlet />
            </div>
            <BottomNav items={navItems} />
        </div>
    );
}
