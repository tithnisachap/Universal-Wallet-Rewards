import { AlertTriangle, LogOut, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import VendorAvatar from '../../components/VendorAvatar';
import { useVendorProfile } from '../../queries/vendor';
import { useLogout } from '../../queries/auth';
import { VENDOR_STATUS_MESSAGES as STATUS_MESSAGES } from '../../data/vendorStatusMessages';

export default function Profile() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { data: vendor, isLoading, isError, error, refetch } = useVendorProfile();

    function handleLogout() {
        logout.mutate(undefined, {
            onSettled: () => navigate('/login'),
        });
    }

    const LogoutLink = (
        <button onClick={handleLogout} className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-danger-500">
            <LogOut size={16} /> Logout
        </button>
    );

    if (isLoading) {
        return (
            <div>
                <PageHeader title="Profile" />
                <LoadingState />
            </div>
        );
    }

    if (isError && error.status !== 404) {
        return (
            <div>
                <PageHeader title="Profile" />
                <div className="px-4 py-4">
                    <ErrorState message={error.message} onRetry={refetch} />
                </div>
            </div>
        );
    }

    if (isError && error.status === 404) {
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
                    {LogoutLink}
                </div>
            </div>
        );
    }

    if (vendor.status !== 'approved') {
        return (
            <div>
                <PageHeader title="Profile" />
                <div className="px-4 py-4">
                    <Card>
                        <div className="flex items-center gap-3">
                            <VendorAvatar vendor={vendor} size="lg" />
                            <div>
                                <p className="font-bold text-gray-900">{vendor.business_name}</p>
                                <p className="text-sm text-gray-500">{vendor.category}</p>
                                <Badge tone={vendor.status} className="mt-1">
                                    {vendor.status}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-4">
                        <p className="font-bold text-gray-900">Status</p>
                        <p className="mt-2 text-sm text-gray-500">{STATUS_MESSAGES[vendor.status]}</p>
                        {vendor.review_note ? (
                            <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">"{vendor.review_note}"</p>
                        ) : null}
                        {vendor.status === 'suspended' && vendor.support_email ? (
                            <p className="mt-2 text-sm text-gray-500">
                                To appeal this decision, contact{' '}
                                <a href={`mailto:${vendor.support_email}`} className="font-semibold text-brand-600">
                                    {vendor.support_email}
                                </a>
                                .
                            </p>
                        ) : null}
                    </Card>

                    {LogoutLink}
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Profile"
                right={
                    <Link
                        to="/vendor/profile/edit"
                        replace
                        className="flex items-center gap-1 text-sm font-semibold text-brand-600"
                    >
                        <Pencil size={14} /> Edit
                    </Link>
                }
            />
            <div className="space-y-4 px-4 py-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <VendorAvatar vendor={vendor} size="lg" />
                        <div>
                            <p className="font-bold text-gray-900">{vendor.business_name}</p>
                            <p className="text-sm text-gray-500">{vendor.category}</p>
                            <Badge tone="approved" className="mt-1">
                                Approved
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card>
                    <p className="mb-2 font-bold text-gray-900">Business Information</p>
                    <dl className="divide-y divide-gray-100">
                        <Row label="Business Name" value={vendor.business_name} />
                        <Row label="Category" value={vendor.category} />
                        <Row label="Phone Number" value={vendor.phone || '—'} />
                        <Row label="Email" value={vendor.email || '—'} />
                        <Row label="Address" value={vendor.address || '—'} />
                        <Row
                            label="Website"
                            value={vendor.website ? <span className="text-brand-600 underline">{vendor.website}</span> : '—'}
                        />
                    </dl>
                </Card>

                {LogoutLink}
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
