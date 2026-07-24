import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { demoAccountsByRole } from '../../data/demoAccounts';
import { homeRoutesByRole } from '../../data/homeRoutes';
import { useDevLogin } from '../../queries/auth';

const roleLabels = {
    customer: 'Customer',
    vendor: 'Vendor',
    admin: 'Admin',
    branch_staff: 'Staff',
};

const accounts = Object.entries(demoAccountsByRole).flatMap(([role, list]) =>
    list.map((account) => ({ ...account, role })),
);

export default function LoginAccountPicker() {
    const navigate = useNavigate();
    const devLogin = useDevLogin();

    function selectAccount(email) {
        devLogin.mutate(email, {
            onSuccess: (data) => navigate(homeRoutesByRole[data.user.role] ?? '/login'),
        });
    }

    function useAnotherAccount() {
        const email = window.prompt('Enter the account email');
        if (email) selectAccount(email.trim());
    }

    return (
        <div className="flex min-h-screen flex-col items-center px-6 pt-16">
            <GoogleLogo />
            <h1 className="mt-6 text-xl font-bold text-gray-900">Sign in with Google</h1>
            <p className="mt-2 text-center text-sm text-gray-500">Choose an account to continue to Universal Wallet</p>

            <div className="mt-8 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                {accounts.map((account) => (
                    <button
                        key={account.email}
                        onClick={() => selectAccount(account.email)}
                        disabled={devLogin.isPending}
                        className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50 disabled:opacity-60"
                    >
                        <Avatar src={account.avatar} size={36} />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">{account.name}</p>
                            <p className="truncate text-sm text-gray-500">{account.email}</p>
                        </div>
                        <Badge tone="neutral">{roleLabels[account.role] ?? account.role}</Badge>
                    </button>
                ))}
                <button
                    onClick={useAnotherAccount}
                    disabled={devLogin.isPending}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-60"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-500">
                        <UserPlus size={18} />
                    </span>
                    <span className="text-sm font-medium text-gray-900">Use another account</span>
                </button>
            </div>

            {devLogin.isError ? (
                <p className="mt-4 text-center text-sm text-danger-500">{devLogin.error.message}</p>
            ) : null}

            <p className="mt-auto max-w-xs pb-10 pt-16 text-center text-xs text-gray-400">
                By continuing, you agree to our <span className="text-brand-600">Terms of Service</span> and{' '}
                <span className="text-brand-600">Privacy Policy</span>.
            </p>
        </div>
    );
}

function GoogleLogo() {
    return (
        <svg width="110" height="36" viewBox="0 0 272 92" className="mt-4">
            <path
                fill="#4285F4"
                d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
            />
            <path
                fill="#EA4335"
                d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
            />
            <path
                fill="#4285F4"
                d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
            />
            <path fill="#34A853" d="M225 3v65h-9.5V3z" />
            <path
                fill="#EA4335"
                d="M261.44 54.36l7.56 5.04c-2.44 3.61-8.33 9.82-18.49 9.82-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.99 14.11l1.01 2.52-29.66 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.93-6.13zm-23.28-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
            />
            <path
                fill="#4285F4"
                d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35 0 53.53 0 34.68 0 15.83 16.32 0 35.3 0c10.5 0 17.98 4.12 23.6 9.49l-6.63 6.63c-4.03-3.78-9.49-6.72-16.99-6.72-13.86 0-24.7 11.17-24.7 25.03s10.84 25.03 24.7 25.03c8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.66z"
            />
        </svg>
    );
}
