import { Navigate, Outlet } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useMe, useLogout } from '../queries/auth';
import { homeRoutesByRole } from '../data/homeRoutes';
import LoadingState from './ui/LoadingState';

function SuspendedScreen() {
    const logoutMutation = useLogout();

    function handleLogout() {
        logoutMutation.mutate();
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
                <ShieldOff size={28} className="text-danger-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Account Suspended</h1>
            <p className="max-w-xs text-sm text-gray-500">
                Your account has been suspended by an administrator. If you believe this is a mistake, please contact support.
            </p>
            <button
                onClick={handleLogout}
                className="mt-2 text-sm font-semibold text-brand-600 hover:underline"
            >
                Sign out
            </button>
        </div>
    );
}

export default function RequireAuth({ role }) {
    const { isAuthenticated } = useSession();
    const { data: me, isLoading, isError } = useMe();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return <LoadingState fullScreen label="Signing you in..." />;
    }

    if (isError) {
        return <Navigate to="/login" replace />;
    }

    if (me?.role !== role) {
        return <Navigate to={homeRoutesByRole[me?.role] ?? '/login'} replace />;
    }

    if (role === 'customer' && me?.customer?.is_suspended) {
        return <SuspendedScreen />;
    }

    return <Outlet />;
}
