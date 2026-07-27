import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { SegmentedControl, PillTabs } from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import SearchInput from '../../components/ui/SearchInput';
import { Field, Input } from '../../components/ui/Field';
import QueryState from '../../components/ui/QueryState';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import VendorAvatar from '../../components/VendorAvatar';
import {
    useAdminVendors,
    useAdminVendorDirectory,
    useReviewVendor,
    usePlatformSettings,
    useUpdatePlatformSettings,
} from '../../queries/admin';

const statusTabs = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export default function VendorApprovals() {
    const [topTab, setTopTab] = useState('applications');
    const [statusTab, setStatusTab] = useState('pending');
    const status = topTab === 'history' ? 'history' : statusTab;

    const { data: vendors, isLoading, isError, error, refetch } = useAdminVendors(status);
    // Independent of whichever tab is active, so the "Pending (N)" badge
    // doesn't flicker to whatever count happens to be currently displayed.
    const { data: pendingVendors } = useAdminVendors('pending');

    const { data: settings } = usePlatformSettings();
    const updateSettings = useUpdatePlatformSettings();
    const [supportEmail, setSupportEmail] = useState('');

    useEffect(() => {
        setSupportEmail(settings?.support_email ?? '');
    }, [settings?.support_email]);

    return (
        <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Approvals</h1>
            <p className="text-sm text-gray-500">Manage incoming vendor applications</p>

            <Card className="mt-4 flex items-center justify-between gap-3">
                <div>
                    <p className="font-semibold text-gray-900">Require approval for new shops</p>
                    <p className="text-sm text-gray-500">
                        {settings?.auto_approve_vendors
                            ? 'Off — new shops go live immediately, no review needed.'
                            : 'On — new shops wait here for approval before going live.'}
                    </p>
                </div>
                <Switch
                    checked={!settings?.auto_approve_vendors}
                    disabled={!settings || updateSettings.isPending}
                    onChange={(requireApproval) =>
                        updateSettings.mutate({ auto_approve_vendors: !requireApproval })
                    }
                />
            </Card>

            <Card className="mt-4">
                <p className="font-semibold text-gray-900">Support Email</p>
                <p className="mb-3 text-sm text-gray-500">
                    Shown to a vendor if their shop is suspended, so they know where to appeal.
                </p>
                <div className="flex gap-2">
                    <Field>
                        <Input
                            type="email"
                            placeholder="support@example.com"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="flex-1"
                        />
                    </Field>
                    <Button
                        size="sm"
                        className="w-auto"
                        disabled={updateSettings.isPending || supportEmail === (settings?.support_email ?? '')}
                        onClick={() => updateSettings.mutate({ support_email: supportEmail || null })}
                    >
                        Save
                    </Button>
                </div>
            </Card>

            <SegmentedControl
                className="mt-4"
                options={[
                    { value: 'applications', label: 'Applications' },
                    { value: 'directory', label: 'All Vendors' },
                    { value: 'history', label: 'History' },
                ]}
                value={topTab}
                onChange={setTopTab}
            />

            {topTab === 'applications' ? (
                <>
                    <PillTabs
                        options={statusTabs.map((tab) => ({
                            ...tab,
                            label: tab.value === 'pending' ? `Pending (${pendingVendors?.length ?? 0})` : tab.label,
                        }))}
                        value={statusTab}
                        onChange={setStatusTab}
                        className="mt-4 border-b border-gray-100 pb-2"
                    />

                    <div className="mt-4 space-y-3">
                        <QueryState
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            onRetry={refetch}
                            isEmpty={vendors?.length === 0}
                            emptyState={<p className="py-8 text-center text-sm text-gray-400">No {statusTab} applications.</p>}
                        >
                            {vendors?.map((app) => (
                                <VendorApplicationCard key={app.id} app={app} statusTab={statusTab} />
                            ))}
                        </QueryState>
                    </div>

                    {statusTab === 'pending' && vendors?.length > 0 ? (
                        <p className="mt-4 text-center text-sm text-gray-400">
                            Showing 1 to {vendors.length} of {vendors.length} results
                        </p>
                    ) : null}
                </>
            ) : topTab === 'directory' ? (
                <VendorDirectory />
            ) : (
                <>
                    <p className="mt-4 text-sm font-semibold text-brand-600">All ({vendors?.length ?? 0})</p>
                    <div className="mt-3 space-y-3">
                        <QueryState
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            onRetry={refetch}
                            isEmpty={vendors?.length === 0}
                            emptyState={<EmptyState icon={Store} title="No history yet" description="Reviewed applications will show up here." />}
                        >
                            {vendors?.map((item) => (
                                <Link key={item.id} to={`/admin/vendors/${item.id}/review`} className="block">
                                    <Card className="flex items-center gap-3">
                                        <VendorAvatar vendor={item} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{item.business_name}</p>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(item.submitted_at ?? item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge tone={item.status}>{item.status}</Badge>
                                    </Card>
                                </Link>
                            ))}
                        </QueryState>
                    </div>
                </>
            )}
        </div>
    );
}

function VendorDirectory() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data, isLoading, isError, error, refetch } = useAdminVendorDirectory({ search: debouncedSearch, page });
    const vendors = data?.data;
    const meta = data?.meta;

    return (
        <div className="mt-4">
            <SearchInput
                placeholder="Search vendors by business name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-4 space-y-3">
                <QueryState
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    isEmpty={vendors?.length === 0}
                    emptyState={
                        <EmptyState
                            icon={Store}
                            title="No vendors found"
                            description={search ? 'Try a different search term.' : 'No vendors have signed up yet.'}
                        />
                    }
                >
                    {vendors?.map((vendor) => (
                        <Link key={vendor.id} to={`/admin/vendors/${vendor.id}/review`} className="block">
                            <Card className="flex items-center gap-3">
                                <VendorAvatar vendor={vendor} />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{vendor.business_name}</p>
                                    <p className="text-sm text-gray-500">{vendor.category}</p>
                                </div>
                                <Badge tone={vendor.status}>{vendor.status}</Badge>
                            </Card>
                        </Link>
                    ))}
                </QueryState>
            </div>

            <Pagination meta={meta} onPageChange={setPage} />
        </div>
    );
}

function VendorApplicationCard({ app, statusTab }) {
    const reviewVendor = useReviewVendor(app.id);

    function handleDecision(e, decision) {
        e.preventDefault();
        reviewVendor.mutate({ decision });
    }

    return (
        <Link to={`/admin/vendors/${app.id}/review`} className="block">
            <Card>
                <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <VendorAvatar vendor={app} />
                        <div>
                            <p className="font-semibold text-gray-900">{app.business_name}</p>
                            <p className="text-sm text-gray-500">{app.category}</p>
                        </div>
                    </div>
                    <Badge tone={statusTab}>{statusTab}</Badge>
                </div>
                <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-400">Location:</dt>
                        <dd className="text-gray-700">{app.address}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-400">Owner:</dt>
                        <dd className="text-gray-700">{app.owner?.name}</dd>
                    </div>
                </dl>
                <p className="mt-2 text-xs text-gray-400">
                    Submitted on {new Date(app.submitted_at).toLocaleString()}
                </p>

                {statusTab === 'pending' ? (
                    <div className="mt-3 flex gap-3">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => handleDecision(e, 'rejected')}
                            disabled={reviewVendor.isPending}
                        >
                            Reject
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={(e) => handleDecision(e, 'approved')}
                            disabled={reviewVendor.isPending}
                        >
                            Approve
                        </Button>
                    </div>
                ) : null}
                {reviewVendor.isError ? <p className="mt-2 text-sm text-danger-500">{reviewVendor.error.message}</p> : null}
            </Card>
        </Link>
    );
}
