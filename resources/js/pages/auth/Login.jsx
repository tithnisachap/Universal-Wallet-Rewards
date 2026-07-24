import { FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuthConfig } from '../../queries/auth';

export default function Login() {
    const navigate = useNavigate();
    const { data: authConfig } = useAuthConfig();
    const googleOAuthEnabled = authConfig?.google_oauth_enabled;

    return (
        <div className="flex min-h-screen flex-col">
            <div className="relative h-64 shrink-0 overflow-hidden bg-brand-600">
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            </div>

            <div className="-mt-6 flex flex-1 flex-col rounded-t-3xl bg-white px-6 pt-10">
                <div className="mb-8 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <FileText size={16} />
                    </span>
                    <span className="text-lg font-bold text-brand-600">Universal Wallet</span>
                </div>

                <h1 className="text-center text-2xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="mx-auto mt-2 max-w-xs text-center text-sm text-gray-500">
                    The simple way to manage your rewards and loyalty cards in one digital place.
                </p>

                {googleOAuthEnabled ? (
                    <Button
                        as="a"
                        href="/auth/google/redirect"
                        variant="outline"
                        className="mt-8 border-gray-200 !text-gray-700"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="mt-8 border-gray-200 !text-gray-700"
                        onClick={() => navigate('/login/choose-account')}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    New here?{' '}
                    <Link to="/signup" className="font-semibold text-brand-600">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
        </svg>
    );
}
