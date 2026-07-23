import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import VendorAvatar from '../../components/VendorAvatar';
import { Textarea } from '../../components/ui/Field';
import { useAdminVendor, useReviewVendor } from '../../queries/admin';

export default function ReviewVendor() {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const { data: vendor, isLoading, isError, error, refetch } = useAdminVendor(vendorId);
    const reviewVendor = useReviewVendor(vendorId);
    const [note, setNote] = useState('');

    function handleDecision(decision) {
        reviewVendor.mutate(
            { decision, review_note: note || undefined },
            { onSuccess: () => navigate(-1) },
        );
    }

    return (
        <div>
            <PageHeader title="Review Vendor" />
            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {vendor ? (
                    <>
                        <div className="space-y-4 px-4 py-4">
                            <Card>
                                <div className="flex items-center gap-3">
                                    <VendorAvatar vendor={vendor} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{vendor.business_name}</p>
                                            <Badge tone={vendor.status}>{vendor.status}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">{vendor.category}</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    Submitted on {new Date(vendor.submitted_at).toLocaleString()}
                                </p>
                            </Card>

                            <Card>
                                <p className="mb-2 font-bold text-gray-900">Business Information</p>
                                <dl className="divide-y divide-gray-100">
                                    <Row label="Owner Name" value={vendor.owner?.name ?? '—'} />
                                    <Row label="Email" value={vendor.owner?.email ?? '—'} />
                                    <Row label="Phone Number" value={vendor.phone ?? '—'} />
                                    <Row label="Category" value={vendor.category} />
                                    <Row label="Address" value={vendor.address ?? '—'} />
                                    <Row
                                        label="Website"
                                        value={vendor.website ? <span className="text-brand-600 underline">{vendor.website}</span> : '—'}
                                    />
                                </dl>
                            </Card>

                            {vendor.status === 'pending' ? (
                                <Card>
                                    <p className="font-bold text-gray-900">Action</p>
                                    <p className="mb-2 text-sm text-gray-500">Note to Vendor (optional)</p>
                                    <Textarea placeholder="Add a note ..." value={note} onChange={(e) => setNote(e.target.value)} />
                                </Card>
                            ) : vendor.review_note ? (
                                <Card>
                                    <p className="font-bold text-gray-900">Review Note</p>
                                    <p className="mt-2 text-sm text-gray-500">{vendor.review_note}</p>
                                </Card>
                            ) : null}

                            {reviewVendor.isError ? <p className="text-sm text-danger-500">{reviewVendor.error.message}</p> : null}
                        </div>

                        {vendor.status === 'pending' ? (
                            <div className="sticky bottom-0 flex gap-3 border-t border-gray-100 bg-white px-4 py-4">
                                <Button variant="danger" onClick={() => handleDecision('rejected')} disabled={reviewVendor.isPending}>
                                    Reject
                                </Button>
                                <Button variant="success" onClick={() => handleDecision('approved')} disabled={reviewVendor.isPending}>
                                    Approve
                                </Button>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </QueryState>
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
