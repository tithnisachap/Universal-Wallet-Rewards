import { ChevronRight, ShoppingBag, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { useAuthConfig } from '../../queries/auth';

const roles = [
    {
        value: 'customer',
        label: 'Customer',
        description: 'Collect stamps and points at your favorite shops.',
        icon: ShoppingBag,
    },
    {
        value: 'vendor',
        label: 'Vendor',
        description: "Set up a shop and run your business's loyalty program.",
        icon: Store,
    },
];

export default function Signup() {
    const navigate = useNavigate();
    const { data: authConfig } = useAuthConfig();
    const googleOAuthEnabled = authConfig?.google_oauth_enabled;

    function selectRole(role) {
        navigate(`/signup/choose-account?role=${role}`);
    }

    return (
        <div className="flex min-h-screen flex-col px-6 pt-16">
            <h1 className="text-center text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm text-gray-500">
                How are you planning to use Universal Wallet?
            </p>

            <div className="mt-8 space-y-3">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const content = (
                        <Card className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                <Icon size={20} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900">{role.label}</p>
                                <p className="text-sm text-gray-500">{role.description}</p>
                            </div>
                            <ChevronRight size={18} className="shrink-0 text-gray-400" />
                        </Card>
                    );

                    return googleOAuthEnabled ? (
                        <a key={role.value} href={`/auth/google/redirect?role=${role.value}`} className="block">
                            {content}
                        </a>
                    ) : (
                        <button key={role.value} onClick={() => selectRole(role.value)} className="block w-full text-left">
                            {content}
                        </button>
                    );
                })}
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-600">
                    Log in
                </Link>
            </p>
        </div>
    );
}
