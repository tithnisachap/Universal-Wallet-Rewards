import { AlertTriangle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { vendorProfile } from '../../data/mock';
import { useSession } from '../../context/SessionContext';

export default function Profile() {
    const navigate = useNavigate();
    const { logout } = useSession();

    function handleLogout() {
        logout('vendor');
        navigate('/vendor/login');
    }

    if (vendorProfile.status === 'not_completed') {
        return (
            <div>
                <PageHeader title="Profile" />
                <div className="px-4 py-4">
                    <Card>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="font-bold text-gray-900">Business Information</p>
                            <Badge tone="rejected">
                                <AlertTriangle size={12} className="mr-1 inline" /> Not Completed
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                            You haven't created your shop yet. Complete your profile to start rewarding your customers and managing
                            promotions.
                        </p>
                        <Button as={Link} to="/vendor/shop-setup" className="mt-4">
                            Complete Profile
                        </Button>
                    </Card>

                    <button onClick={handleLogout} className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-danger-500">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        );
    }

    if (vendorProfile.status === 'pending') {
        return (
            <div>
                <PageHeader title="Profile" />
                <div className="px-4 py-4">
                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 rounded-full bg-amber-900" />
                            <div>
                                <p className="font-bold text-gray-900">{vendorProfile.businessName}</p>
                                <p className="text-sm text-gray-500">{vendorProfile.category}</p>
                                <Badge tone="pending" className="mt-1">
                                    Pending
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-4">
                        <p className="font-bold text-gray-900">Status</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Your shop is pending admin approval. you will be notified via email once there is an update.
                        </p>
                    </Card>

                    <button onClick={handleLogout} className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-danger-500">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Profile" />
            <div className="space-y-4 px-4 py-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 rounded-full bg-amber-900" />
                        <div>
                            <p className="font-bold text-gray-900">{vendorProfile.businessName}</p>
                            <p className="text-sm text-gray-500">{vendorProfile.category}</p>
                            <Badge tone="approved" className="mt-1">
                                Approved
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card>
                    <p className="mb-2 font-bold text-gray-900">Business Information</p>
                    <dl className="divide-y divide-gray-100">
                        <Row label="Business Name" value={vendorProfile.businessName} />
                        <Row label="Category" value={vendorProfile.category} />
                        <Row label="Phone Number" value={vendorProfile.phone} />
                        <Row label="Email" value={vendorProfile.email} />
                        <Row label="Address" value={vendorProfile.address} />
                        <Row
                            label="Website"
                            value={<span className="text-brand-600 underline">{vendorProfile.website}</span>}
                        />
                    </dl>
                </Card>

                <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-danger-500">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-gray-500">{label}</dt>
            <dd className="text-right text-sm font-semibold text-gray-900">{value}</dd>
        </div>
    );
}
