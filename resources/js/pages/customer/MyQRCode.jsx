import { Upload } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCodeBlock from '../../components/ui/QRCodeBlock';
import { currentCustomer } from '../../data/mock';

export default function MyQRCode() {
    return (
        <div className="px-4 pb-6 pt-6">
            <p className="text-lg font-bold text-brand-600">Universal Wallet</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">My QR Code</h1>
            <p className="mt-1 text-sm text-gray-500">Show this to staff to collect stamps and redeem rewards.</p>

            <Card className="mt-5 p-0">
                <div className="p-5">
                    <QRCodeBlock value={currentCustomer.id} />
                </div>
                <div className="border-t border-gray-100 px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Customer ID</p>
                    <p className="text-lg font-bold text-brand-600">{currentCustomer.id}</p>
                </div>
            </Card>

            <Button variant="primary" icon={Upload} className="mt-5">
                Save to Photos
            </Button>
        </div>
    );
}
