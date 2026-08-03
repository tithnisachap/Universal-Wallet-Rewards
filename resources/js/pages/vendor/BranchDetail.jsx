import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Calendar, ShieldCheck, Pencil, Check, UserPlus, X, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Field, Input } from '../../components/ui/Field';
import QueryState from '../../components/ui/QueryState';
import { formatOpeningHours } from '../../lib/formatOpeningHours';
import {
    useVendorBranch,
    useBranchStaff,
    useInviteBranchStaff,
    useRevokeBranchStaff,
    useDeleteBranch,
} from '../../queries/vendor';

export default function BranchDetail() {
    const { branchId } = useParams();
    const navigate = useNavigate();
    const { data: branch, isLoading, isError, error, refetch } = useVendorBranch(branchId);
    const { data: staff } = useBranchStaff(branchId);
    const inviteStaff = useInviteBranchStaff(branchId);
    const revokeStaff = useRevokeBranchStaff(branchId);
    const deleteBranch = useDeleteBranch(branchId);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    function handleDelete() {
        deleteBranch.mutate(undefined, {
            onSuccess: () => navigate('/vendor/branches'),
        });
    }

    function handleInvite(e) {
        e.preventDefault();
        const email = inviteEmail.trim();
        if (!email) return;

        inviteStaff.mutate(
            { email },
            {
                onSuccess: () => {
                    setIsInviting(false);
                    setInviteEmail('');
                },
            },
        );
    }

    return (
        <div>
            <PageHeader title="Branches" onBack={() => navigate('/vendor/branches')} />
            <div className="px-4 py-4">
                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    {branch ? (
                        <>
                            {branch.photo_url ? (
                                <img
                                    src={branch.photo_url}
                                    alt={branch.name}
                                    className="h-40 w-full rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-amber-900 to-amber-700" />
                            )}

                            <div className="mt-4">
                                <p className="text-lg font-bold text-gray-900">{branch.name}</p>
                                {branch.is_main ? (
                                    <Badge tone="active" className="mt-1">
                                        Current Location
                                    </Badge>
                                ) : null}

                                <div className="mt-3 space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center gap-2">
                                        <MapPin size={15} /> {branch.address}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock size={15} /> {formatOpeningHours(branch.opening_hours)}
                                    </p>
                                    {branch.phone ? (
                                        <p className="flex items-center gap-2">
                                            <Phone size={15} /> {branch.phone}
                                        </p>
                                    ) : null}
                                    <p className="flex items-center gap-2">
                                        <Calendar size={15} /> Joined on{' '}
                                        {new Date(branch.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <Card className="mt-4 border border-dashed border-brand-200 bg-brand-50/40">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                                        <ShieldCheck size={18} />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Shared Loyalty Program</p>
                                        <p className="text-sm text-gray-500">This branch shares the same loyalty program with all other branches.</p>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {['Points', 'Stamp Card', 'Promotions', 'Reward Redemption'].map((item) => (
                                        <div key={item} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-gray-700">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-500 text-white">
                                                <Check size={12} />
                                            </span>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {branch.is_main ? (
                                <Card className="mt-4 bg-brand-50">
                                    <p className="font-semibold text-brand-700">Current Location</p>
                                    <p className="text-sm text-brand-600">
                                        This is your main shop. All promotions and loyalty programs are shared across all locations.
                                    </p>
                                </Card>
                            ) : null}

                            <Card className="mt-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="font-semibold text-gray-900">Branch Staff</p>
                                    <button
                                        onClick={() => {
                                            setInviteEmail('');
                                            setIsInviting(true);
                                        }}
                                        className="flex items-center gap-1 text-sm font-semibold text-brand-600"
                                    >
                                        <UserPlus size={16} /> Invite
                                    </button>
                                </div>

                                {staff?.length ? (
                                    <div className="space-y-2">
                                        {staff.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        {member.user?.name ?? member.email}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-500">{member.email}</p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <Badge tone={member.accepted_at ? 'approved' : 'pending'}>
                                                        {member.accepted_at ? 'Active' : 'Invited'}
                                                    </Badge>
                                                    <button
                                                        onClick={() => revokeStaff.mutate(member.id)}
                                                        disabled={revokeStaff.isPending}
                                                        className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-danger-500"
                                                        aria-label="Revoke access"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No one else has access to this branch yet. Invite a Google account to let them
                                        scan customers and manage stamps/points here.
                                    </p>
                                )}
                            </Card>

                            <Button as={Link} to={`/vendor/branches/${branch.id}/edit`} icon={Pencil} className="mt-5">
                                Edit Branch Information
                            </Button>

                            <Button
                                variant="ghost"
                                icon={Trash2}
                                className="mt-3 !text-danger-500"
                                onClick={() => setIsConfirmingDelete(true)}
                            >
                                Delete Branch
                            </Button>

                            <Modal open={isConfirmingDelete} onClose={() => setIsConfirmingDelete(false)} title="Delete Branch">
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to delete <span className="font-semibold">{branch.name}</span>? This cannot be undone.
                                </p>
                                {staff?.some((m) => m.accepted_at) ? (
                                    <p className="mt-2 text-sm text-amber-600">
                                        {staff.filter((m) => m.accepted_at).length} staff member(s) will lose access and their accounts will be removed.
                                    </p>
                                ) : null}
                                {branch.is_main ? (
                                    <p className="mt-2 text-sm text-amber-600">
                                        This is your main branch. Another branch will be promoted to main automatically.
                                    </p>
                                ) : null}
                                {deleteBranch.isError ? (
                                    <p className="mt-2 text-sm text-danger-500">{deleteBranch.error.message}</p>
                                ) : null}
                                <div className="mt-4 flex gap-3">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setIsConfirmingDelete(false)}
                                        disabled={deleteBranch.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="flex-1"
                                        onClick={handleDelete}
                                        disabled={deleteBranch.isPending}
                                    >
                                        {deleteBranch.isPending ? 'Deleting...' : 'Yes, Delete'}
                                    </Button>
                                </div>
                            </Modal>

                            <Modal open={isInviting} onClose={() => setIsInviting(false)} title="Invite Branch Staff">
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <Field label="Google Account Email" hint="They'll sign in with this exact address">
                                        <Input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            autoFocus
                                            required
                                        />
                                    </Field>

                                    {inviteStaff.isError ? (
                                        <p className="text-sm text-danger-500">{inviteStaff.error.message}</p>
                                    ) : null}

                                    <Button type="submit" disabled={inviteStaff.isPending || !inviteEmail.trim()}>
                                        {inviteStaff.isPending ? 'Inviting...' : 'Send Invite'}
                                    </Button>
                                </form>
                            </Modal>
                        </>
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}
