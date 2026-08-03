import { Upload } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCodeBlock from '../../components/ui/QRCodeBlock';
import QueryState from '../../components/ui/QueryState';
import { useQrCode } from '../../queries/customer';

export default function MyQRCode() {
    const { data: qr, isLoading, isError, error, refetch } = useQrCode();

    function saveToPhotos() {
        const canvas = document.querySelector('#customer-qr-code svg');
        if (!canvas) return;

        const svgData = new XMLSerializer().serializeToString(canvas);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${qr?.customer_code ?? 'my-qr-code'}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="px-4 pb-6 pt-6">
            <h1 className="text-2xl font-bold text-gray-900">My QR Code</h1>
            <p className="mt-1 text-sm text-gray-500">Show this to staff to collect stamps and redeem rewards.</p>

            <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                {qr ? (
                    <>
                        <Card className="mt-5 p-0">
                            <div id="customer-qr-code" className="p-5">
                                <QRCodeBlock value={qr.qr_value} />
                            </div>
                            <div className="border-t border-gray-100 px-5 py-4 text-center">
                                <p className="text-xs uppercase tracking-wide text-gray-400">Customer ID</p>
                                <p className="text-lg font-bold text-brand-600">{qr.customer_code}</p>
                            </div>
                        </Card>

                        <Button variant="primary" icon={Upload} className="mt-5" onClick={saveToPhotos}>
                            Save to Photos
                        </Button>
                    </>
                ) : null}
            </QueryState>
        </div>
    );
}
