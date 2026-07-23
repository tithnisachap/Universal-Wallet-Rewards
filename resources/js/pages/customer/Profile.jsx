import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { currentCustomer } from '../../data/mock';
import { useSession } from '../../context/SessionContext';

export default function Profile() {
    const navigate = useNavigate();
    const { logout } = useSession();

    function handleLogout() {
        logout('customer');
        navigate('/customer/login');
    }

    return (
        <div className="px-4 pb-6 pt-6">
            <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">My Profile</h1>

            <Card className="mt-5">
                <div className="flex items-center gap-3">
                    <Avatar src={currentCustomer.avatar} size={56} />
                    <div>
                        <p className="text-lg font-bold text-gray-900">{currentCustomer.name}</p>
                        <p className="text-sm text-gray-500">{currentCustomer.email}</p>
                    </div>
                </div>

                <dl className="mt-5 divide-y divide-gray-100">
                    <div className="flex items-center justify-between py-3">
                        <dt className="text-sm text-gray-500">Full Name</dt>
                        <dd className="text-sm font-semibold text-gray-900">{currentCustomer.name}</dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <dt className="text-sm text-gray-500">Email</dt>
                        <dd className="text-sm font-semibold text-gray-900">{currentCustomer.email}</dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <dt className="text-sm text-gray-500">Member Since</dt>
                        <dd className="text-sm font-semibold text-gray-900">{currentCustomer.memberSince}</dd>
                    </div>
                </dl>

                <Button variant="outline" className="mt-2">
                    Edit Profile
                </Button>
            </Card>

            <Card className="mt-4">
                <Button variant="ghost" icon={LogOut} className="!text-danger-500" onClick={handleLogout}>
                    Log Out
                </Button>
            </Card>
        </div>
    );
}
