import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Field';
import { vendorApprovals } from '../../data/mock';

export default function ReviewVendor() {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const all = [...vendorApprovals.pending, ...vendorApprovals.history];
    const app = all.find((a) => String(a.id) === vendorId) ?? all[0];
    const status = app.status ?? 'pending';

    return (
        <div>
            <PageHeader title="Review Vendor" />
            <div className="space-y-4 px-4 py-4">
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-amber-900" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900">{app.name}</p>
                                <Badge tone={status}>{status}</Badge>
                            </div>
                            <p className="text-sm text-gray-500">{app.category}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Submitted on {app.submitted ?? app.date}</p>
                </Card>

                <Card>
                    <p className="mb-2 font-bold text-gray-900">Business Information</p>
                    <dl className="divide-y divide-gray-100">
                        <Row label="Owner Name" value={app.owner ?? '—'} />
                        <Row label="Email" value={app.email ?? '—'} />
                        <Row label="Phone Number" value={app.phone ?? '—'} />
                        <Row label="Category" value={app.category} />
                        <Row label="Address" value={app.location ?? '—'} />
                        <Row label="Website" value={<span className="text-brand-600 underline">{app.website || '—'}</span>} />
                    </dl>
                </Card>

                <Card>
                    <p className="font-bold text-gray-900">Action</p>
                    <p className="mb-2 text-sm text-gray-500">Note to Vendor (optional)</p>
                    <Textarea placeholder="Add a note ..." />
                </Card>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-gray-100 bg-white px-4 py-4">
                <Button variant="danger" onClick={() => navigate(-1)}>
                    Reject
                </Button>
                <Button variant="success" onClick={() => navigate(-1)}>
                    Approve
                </Button>
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
