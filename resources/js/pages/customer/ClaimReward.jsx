import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCodeBlock from '../../components/ui/QRCodeBlock';
import { vendors, currentCustomer } from '../../data/mock';

export default function ClaimReward() {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const vendor = vendors.find((v) => v.id === vendorId);

    return (
        <div>
            <PageHeader title="Claim Reward" />
            <div className="px-4 py-6 text-center">
                <h1 className="text-xl font-bold text-gray-900">Congratulations!</h1>
                <p className="mt-2 text-sm text-gray-500">
                    You completed all {vendor.stampsRequired} stamps. Claim your reward now!
                </p>

                <Card className="mt-6 p-0 text-left">
                    <div className="border-b border-gray-100 px-4 py-3">
                        <p className="font-bold text-gray-900">1 Free Drink (Big size)</p>
                        <p className="text-xs uppercase text-gray-400">{vendor.name}</p>
                    </div>
                    <div className="px-4 py-5">
                        <p className="mb-4 text-center text-sm text-gray-500">Show this code to the staff to redeem your reward.</p>
                        <QRCodeBlock value={`REWARD-${vendorId}-${currentCustomer.id}`} />
                        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600">
                            <Clock size={16} /> Code expires in 4:59
                        </p>
                        <p className="mt-1 text-center text-xs text-gray-400">This code can only be used once.</p>
                    </div>
                </Card>

                <Button className="mt-6" onClick={() => navigate(-1)}>
                    Done
                </Button>
            </div>
        </div>
    );
}
