import { Link } from 'react-router-dom';
import { Plus, Filter, MapPin, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { vendorProfile, vendorBranches } from '../../data/mock';

export default function Branches() {
    return (
        <div>
            <PageHeader title="Branches" />
            <div className="px-4 py-4">
                <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-emerald-700 p-5 text-white">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                            <MapPin size={20} />
                        </span>
                        <div>
                            <p className="text-lg font-bold">{vendorProfile.businessName}</p>
                            <p className="text-sm text-white/80">{vendorBranches.length} Connected Branches</p>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-white/80">
                        All branches under the same business share loyalty programs and customer rewards.
                    </p>
                </div>

                <div className="mt-4 flex gap-2">
                    <SearchInput placeholder="Search branches..." className="flex-1" />
                    <button className="flex items-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-gray-700 shadow-sm">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                <div className="mb-3 mt-5 flex items-center justify-between">
                    <p className="font-bold text-gray-900">Branch List</p>
                    <Button as={Link} to="/vendor/branches/new" size="sm" icon={Plus} className="w-auto">
                        Add Branch
                    </Button>
                </div>

                <div className="space-y-3">
                    {vendorBranches.map((branch) => (
                        <Link key={branch.id} to={`/vendor/branches/${branch.id}`}>
                            <Card className="flex items-center gap-3">
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-800" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900">{branch.name}</p>
                                    {branch.current ? (
                                        <Badge tone="active" className="my-1">
                                            Current Location
                                        </Badge>
                                    ) : null}
                                    <p className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} /> {branch.address}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-brand-50 p-4">
                    <Users size={20} className="mt-0.5 shrink-0 text-brand-600" />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">Shared Loyalty Program</p>
                        <p className="text-gray-600">
                            Customers can collect and redeem rewards at any branch under {vendorProfile.businessName}.{' '}
                            <span className="font-medium text-brand-600">Learn More</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
