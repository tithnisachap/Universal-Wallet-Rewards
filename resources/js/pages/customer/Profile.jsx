import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import QueryState from '../../components/ui/QueryState';
import { useCustomerProfile, useUpdateCustomerProfile } from '../../queries/customer';
import { useLogout } from '../../queries/auth';

export default function Profile() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { data: customer, isLoading, isError, error, refetch } = useCustomerProfile();
    const updateProfile = useUpdateCustomerProfile();

    function handleLogout() {
        logout.mutate(undefined, {
            onSettled: () => navigate('/customer/login'),
        });
    }

    function handleEdit() {
        const name = window.prompt('Update your full name', customer?.name);
        if (name && name.trim()) {
            updateProfile.mutate({ name: name.trim() });
        }
    }

    return (
        <div className="px-4 pb-6 pt-6">
            <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">My Profile</h1>

            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {customer ? (
                    <Card className="mt-5">
                        <div className="flex items-center gap-3">
                            <Avatar src={customer.avatar} size={56} />
                            <div>
                                <p className="text-lg font-bold text-gray-900">{customer.name}</p>
                                <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                        </div>

                        <dl className="mt-5 divide-y divide-gray-100">
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-sm text-gray-500">Full Name</dt>
                                <dd className="text-sm font-semibold text-gray-900">{customer.name}</dd>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-sm text-gray-500">Email</dt>
                                <dd className="text-sm font-semibold text-gray-900">{customer.email}</dd>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-sm text-gray-500">Member Since</dt>
                                <dd className="text-sm font-semibold text-gray-900">
                                    {new Date(customer.member_since).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </dd>
                            </div>
                        </dl>

                        {updateProfile.isError ? (
                            <p className="mt-2 text-sm text-danger-500">{updateProfile.error.message}</p>
                        ) : null}

                        <Button variant="outline" className="mt-2" onClick={handleEdit} disabled={updateProfile.isPending}>
                            {updateProfile.isPending ? 'Saving...' : 'Edit Profile'}
                        </Button>
                    </Card>
                ) : null}
            </QueryState>

            <Card className="mt-4">
                <Button variant="ghost" icon={LogOut} className="!text-danger-500" onClick={handleLogout} disabled={logout.isPending}>
                    Log Out
                </Button>
            </Card>
        </div>
    );
}
