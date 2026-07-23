import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { vendors, branches } from '../../data/mock';

export default function VendorBranches() {
    const { vendorId } = useParams();
    const vendor = vendors.find((v) => v.id === vendorId);
    const vendorBranches = branches[vendorId] ?? [];

    return (
        <div>
            <PageHeader title="All Branches" />
            <div className="px-4 py-4">
                <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${vendor?.color}`}>
                        {vendor?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">{vendor?.name}</p>
                        <p className="text-sm text-gray-500">Earn points and stamps redeem amazing rewards</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {vendorBranches.map((branch) => (
                        <Link key={branch.id} to={`/customer/vendors/${vendorId}/branches/${branch.id}`}>
                            <Card className="flex items-center gap-3">
                                <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-800" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900">{branch.name}</p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} /> {branch.address}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                        <Clock size={12} /> {branch.hours}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                        <Phone size={12} /> {branch.phone}
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
                            Customers can collect and redeem rewards at any branch under {vendor?.name}.{' '}
                            <span className="font-medium text-brand-600">Learn More</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
