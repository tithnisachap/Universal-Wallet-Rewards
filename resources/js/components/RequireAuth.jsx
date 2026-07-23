import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useMe } from '../queries/auth';
import LoadingState from './ui/LoadingState';

export default function RequireAuth({ role }) {
    const { isAuthenticated } = useSession();
    const { data: me, isLoading, isError } = useMe();

    if (!isAuthenticated) {
        return <Navigate to={`/${role}/login`} replace />;
    }

    if (isLoading) {
        return <LoadingState fullScreen label="Signing you in..." />;
    }

    if (isError || me?.role !== role) {
        return <Navigate to={`/${role}/login`} replace />;
    }

    return <Outlet />;
}
