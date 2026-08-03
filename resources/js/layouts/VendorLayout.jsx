import { Outlet } from 'react-router-dom';
import TopBar from '../components/ui/TopBar';

export default function VendorLayout() {
    return (
        <div className="min-h-screen">
            <TopBar />
            <Outlet />
        </div>
    );
}
