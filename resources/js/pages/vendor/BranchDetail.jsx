import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Calendar, ShieldCheck, Pencil, Check } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import { formatOpeningHours } from '../../lib/formatOpeningHours';
import { useVendorBranch } from '../../queries/vendor';

export default function BranchDetail() {
    const { branchId } = useParams();
    const { data: branch, isLoading, isError, error, refetch } = useVendorBranch(branchId);

    return (
        <div>
            <PageHeader title="Branches" />
            <div className="px-4 py-4">
                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    {branch ? (
                        <>
                            {branch.photo_path ? (
                                <img
                                    src={`/storage/${branch.photo_path}`}
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

                            <Button as={Link} to={`/vendor/branches/${branch.id}/edit`} icon={Pencil} className="mt-5">
                                Edit Branch Information
                            </Button>
                        </>
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}
