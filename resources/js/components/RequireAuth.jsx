import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function RequireAuth({ role }) {
    const { isAuthenticated } = useSession();

    if (!isAuthenticated(role)) {
        return <Navigate to={`/${role}/login`} replace />;
    }

    return <Outlet />;
}
