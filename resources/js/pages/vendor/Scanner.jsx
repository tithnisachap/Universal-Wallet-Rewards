import { Zap, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { useScanCustomer } from '../../queries/vendor';

export default function Scanner() {
    const navigate = useNavigate();
    const scanCustomer = useScanCustomer();

    function handleScan() {
        // No camera/QR-reading library is wired up yet, so scanning is
        // simulated by typing in the code a real camera scan would decode.
        const code = window.prompt('Enter customer code (e.g. CUS-000125)');
        if (!code) return;

        scanCustomer.mutate(code.trim(), {
            onSuccess: (customer) => navigate(`/vendor/wallet/${customer.customer_code}`),
            onError: (error) => window.alert(error.message),
        });
    }

    return (
        <div className="flex min-h-screen flex-col">
            <PageHeader title="Scanner" />
            <button
                onClick={handleScan}
                disabled={scanCustomer.isPending}
                className="relative flex flex-1 items-center justify-center bg-gray-900"
            >
                <div className="absolute inset-8 rounded-3xl border-2 border-transparent">
                    <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-brand-400" />
                    <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-brand-400" />
                    <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-brand-400" />
                    <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-brand-400" />
                </div>
                <div className="flex flex-col items-center gap-3 text-brand-300">
                    <QrCode size={64} />
                    <p className="text-lg font-semibold">{scanCustomer.isPending ? 'Looking up customer...' : 'Scan Customer QR'}</p>
                    <p className="max-w-xs text-center text-sm text-gray-400">Place the customer's QR code within the frame</p>
                </div>
            </button>
            <div className="flex flex-col items-center gap-2 bg-white py-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <Zap size={18} />
                </span>
                <span className="text-sm text-gray-500">Flash</span>
            </div>
        </div>
    );
}
