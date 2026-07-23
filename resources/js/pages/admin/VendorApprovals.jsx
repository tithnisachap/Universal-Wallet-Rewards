import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SegmentedControl, PillTabs } from '../../components/ui/Tabs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { vendorApprovals } from '../../data/mock';

const statusTabs = [
    { value: 'pending', label: `Pending (${vendorApprovals.pending.length})` },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export default function VendorApprovals() {
    const [topTab, setTopTab] = useState('applications');
    const [statusTab, setStatusTab] = useState('pending');

    return (
        <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Approvals</h1>
            <p className="text-sm text-gray-500">Manage incoming vendor applications</p>

            <SegmentedControl
                className="mt-4"
                options={[
                    { value: 'applications', label: 'Applications' },
                    { value: 'history', label: 'History' },
                ]}
                value={topTab}
                onChange={setTopTab}
            />

            {topTab === 'applications' ? (
                <>
                    <PillTabs options={statusTabs} value={statusTab} onChange={setStatusTab} className="mt-4 border-b border-gray-100 pb-2" />

                    <div className="mt-4 space-y-3">
                        {(vendorApprovals[statusTab] ?? []).map((app) => (
                            <Link key={app.id} to={`/admin/vendors/${app.id}/review`}>
                                <Card>
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-11 shrink-0 rounded-full bg-amber-900" />
                                            <div>
                                                <p className="font-semibold text-gray-900">{app.name}</p>
                                                <p className="text-sm text-gray-500">{app.category}</p>
                                            </div>
                                        </div>
                                        <Badge tone={statusTab}>{statusTab}</Badge>
                                    </div>
                                    <dl className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-400">Location:</dt>
                                            <dd className="text-gray-700">{app.location}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-400">Owner:</dt>
                                            <dd className="text-gray-700">{app.owner}</dd>
                                        </div>
                                    </dl>
                                    <p className="mt-2 text-xs text-gray-400">Submitted on {app.submitted}</p>

                                    {statusTab === 'pending' ? (
                                        <div className="mt-3 flex gap-3">
                                            <Button variant="danger" size="sm" onClick={(e) => e.preventDefault()}>
                                                Reject
                                            </Button>
                                            <Button variant="success" size="sm" onClick={(e) => e.preventDefault()}>
                                                Approve
                                            </Button>
                                        </div>
                                    ) : null}
                                </Card>
                            </Link>
                        ))}

                        {(vendorApprovals[statusTab] ?? []).length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-400">No {statusTab} applications.</p>
                        ) : null}
                    </div>

                    {statusTab === 'pending' && vendorApprovals.pending.length > 0 ? (
                        <p className="mt-4 text-center text-sm text-gray-400">
                            Showing 1 to {vendorApprovals.pending.length} of {vendorApprovals.pending.length} results
                        </p>
                    ) : null}
                </>
            ) : (
                <>
                    <p className="mt-4 text-sm font-semibold text-brand-600">All ({vendorApprovals.history.length})</p>
                    <div className="mt-3 space-y-3">
                        {vendorApprovals.history.map((item) => (
                            <Link key={item.id} to={`/admin/vendors/${item.id}/review`}>
                                <Card className="flex items-center gap-3">
                                    <div className="h-11 w-11 shrink-0 rounded-full bg-amber-900" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                        <p className="text-xs text-gray-400">{item.date}</p>
                                    </div>
                                    <Badge tone={item.status}>{item.status}</Badge>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
