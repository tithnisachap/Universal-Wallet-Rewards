import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import QueryState from '../../components/ui/QueryState';
import { useMe, useLogout } from '../../queries/auth';

export default function Profile() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { data: me, isLoading, isError, error, refetch } = useMe();

    function handleLogout() {
        logout.mutate(undefined, {
            onSettled: () => navigate('/login'),
        });
    }

    return (
        <div className="px-4 pb-6 pt-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {me ? (
                    <Card className="mt-5">
                        <div className="flex items-center gap-3">
                            <Avatar src={me.avatar} size={56} />
                            <div>
                                <p className="text-lg font-bold text-gray-900">{me.name}</p>
                                <p className="text-sm text-gray-500">Super Administrator</p>
                            </div>
                        </div>

                        <dl className="mt-5 divide-y divide-gray-100">
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-sm text-gray-500">Full Name</dt>
                                <dd className="text-sm font-semibold text-gray-900">{me.name}</dd>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-sm text-gray-500">Email</dt>
                                <dd className="text-sm font-semibold text-gray-900">{me.email}</dd>
                            </div>
                        </dl>
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
