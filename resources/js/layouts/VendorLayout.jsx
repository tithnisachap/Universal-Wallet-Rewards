import { Outlet } from 'react-router-dom';

export default function VendorLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
}
