import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { homeRoutesByRole } from '../../data/homeRoutes';
import { api } from '../../lib/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const errorConfig = {
    google_auth_failed: {
        message: 'Google sign-in failed or was cancelled. Please try again.',
        retryTo: '/login',
    },
    no_account: {
        message: 'No account was found for that Google account. Use "Create an account" to sign up.',
        retryTo: '/signup',
    },
};

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { login } = useSession();
    const [error, setError] = useState(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.hash.slice(1));
        const token = params.get('token');
        const errorCode = params.get('error');

        if (errorCode) {
            setError(errorConfig[errorCode] ?? { message: 'Something went wrong signing you in.', retryTo: '/login' });
            return;
        }

        if (!token) {
            setError({ message: 'No sign-in token was received from Google.', retryTo: '/login' });
            return;
        }

        login(token);

        api.get('/me')
            .then((me) => navigate(homeRoutesByRole[me.role] ?? '/', { replace: true }))
            .catch(() => setError({ message: 'Could not complete sign-in. Please try again.', retryTo: '/login' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <ErrorState
                    title="Sign-in failed"
                    message={error.message}
                    onRetry={() => navigate(error.retryTo)}
                />
            </div>
        );
    }

    return <LoadingState fullScreen label="Finishing sign-in..." />;
}
