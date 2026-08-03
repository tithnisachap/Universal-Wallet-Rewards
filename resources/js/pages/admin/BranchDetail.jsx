import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Calendar } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import QueryState from '../../components/ui/QueryState';
import { formatOpeningHours } from '../../lib/formatOpeningHours';
import { useAdminVendor } from '../../queries/admin';

export default function BranchDetail() {
    const { vendorId, branchId } = useParams();
    const { data: vendor, isLoading, isError, error, refetch } = useAdminVendor(vendorId);
    const branch = vendor?.branches?.find((b) => String(b.id) === branchId);

    return (
        <div>
            <PageHeader title="Branch" />
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
                                        Main Branch
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
                        </>
                    ) : (
                        <p className="py-8 text-center text-sm text-gray-400">Branch not found.</p>
                    )}
                </QueryState>
            </div>
        </div>
    );
}
