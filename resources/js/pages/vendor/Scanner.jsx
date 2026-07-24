import { useEffect, useRef, useState } from 'react';
import { Zap, ZapOff, Keyboard, VideoOff, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { Field, Input } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { useRedeemCode, useScanCustomer } from '../../queries/vendor';

export default function Scanner({ basePath = '/vendor' }) {
    const navigate = useNavigate();
    const scanCustomer = useScanCustomer();
    const redeemCode = useRedeemCode();
    const videoRef = useRef(null);
    const scannerRef = useRef(null);
    const processingRef = useRef(false);

    const [cameraError, setCameraError] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [redeemed, setRedeemed] = useState(null);
    const [hasFlash, setHasFlash] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [manualOpen, setManualOpen] = useState(false);
    const [manualCode, setManualCode] = useState('');

    // A scanned/typed code can be either a customer's permanent ID QR or a
    // one-time reward redemption code. There's no reliable way to tell them
    // apart up front, so try the customer lookup first and only fall back to
    // redemption if that fails.
    function submitCode(code) {
        if (!code || processingRef.current) return;
        processingRef.current = true;
        const trimmed = code.trim();

        scanCustomer.mutate(trimmed, {
            onSuccess: (customer) => navigate(`${basePath}/wallet/${customer.customer_code}`),
            onError: () => attemptRedemption(trimmed),
        });
    }

    function attemptRedemption(code) {
        redeemCode.mutate(code, {
            onSuccess: (redemption) => {
                scannerRef.current?.stop();
                setRedeemed(redemption);
            },
            onError: (error) => {
                scannerRef.current?.stop();
                setScanError(error.message);
            },
        });
    }

    useEffect(() => {
        const scanner = new QrScanner(videoRef.current, (result) => submitCode(result.data), {
            preferredCamera: 'environment',
            highlightScanRegion: false,
            highlightCodeOutline: false,
            maxScansPerSecond: 5,
        });
        scannerRef.current = scanner;

        scanner
            .start()
            .then(() => scanner.hasFlash())
            .then(setHasFlash)
            .catch((error) => setCameraError(error?.message || 'Could not access the camera.'));

        return () => {
            scanner.stop();
            scanner.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function resumeScanning() {
        setScanError(null);
        setRedeemed(null);
        processingRef.current = false;
        scannerRef.current?.start().catch((error) => setCameraError(error?.message || 'Could not access the camera.'));
    }

    function toggleFlash() {
        scannerRef.current?.toggleFlash().then(() => setFlashOn(Boolean(scannerRef.current?.isFlashOn())));
    }

    function openManualEntry() {
        setManualCode('');
        setManualOpen(true);
    }

    function handleManualSubmit(e) {
        e.preventDefault();
        if (!manualCode.trim()) return;
        setManualOpen(false);
        submitCode(manualCode);
    }

    return (
        <div className="flex min-h-screen flex-col">
            <PageHeader title="Scanner" />

            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gray-900">
                <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" muted playsInline />

                {!cameraError && !scanError && !redeemed ? (
                    <div className="pointer-events-none absolute inset-8 rounded-3xl border-2 border-transparent">
                        <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-brand-400" />
                        <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-brand-400" />
                        <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-brand-400" />
                        <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-brand-400" />
                    </div>
                ) : null}

                {cameraError ? (
                    <div className="relative flex flex-col items-center gap-3 px-8 text-center text-brand-300">
                        <VideoOff size={48} />
                        <p className="text-lg font-semibold">Camera unavailable</p>
                        <p className="max-w-xs text-sm text-gray-400">{cameraError}</p>
                        <p className="mt-1 text-sm text-gray-400">Use "Enter Code" below instead.</p>
                    </div>
                ) : redeemed ? (
                    <div className="relative flex flex-col items-center gap-3 px-8 text-center text-brand-300">
                        <CheckCircle2 size={48} className="text-success-500" />
                        <p className="text-lg font-semibold text-white">Reward Redeemed!</p>
                        <p className="max-w-xs text-sm text-gray-400">
                            {redeemed.promotion?.title}
                            {redeemed.customer_code ? ` — ${redeemed.customer_code}` : ''}
                        </p>
                        <button
                            onClick={resumeScanning}
                            className="mt-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Scan Again
                        </button>
                    </div>
                ) : scanError ? (
                    <div className="relative flex flex-col items-center gap-3 px-8 text-center text-brand-300">
                        <VideoOff size={48} />
                        <p className="text-lg font-semibold">Scan failed</p>
                        <p className="max-w-xs text-sm text-gray-400">{scanError}</p>
                        <button
                            onClick={resumeScanning}
                            className="mt-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Scan Again
                        </button>
                    </div>
                ) : (
                    <div className="pointer-events-none relative mt-auto mb-10 flex flex-col items-center gap-3 text-center text-brand-300">
                        <p className="text-lg font-semibold">
                            {scanCustomer.isPending || redeemCode.isPending ? 'Looking up code...' : 'Scan Customer QR'}
                        </p>
                        <p className="max-w-xs text-sm text-gray-400">Place the customer's QR code within the frame</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-10 bg-white py-6">
                <button
                    onClick={toggleFlash}
                    disabled={!hasFlash}
                    className="flex flex-col items-center gap-2 disabled:opacity-40"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        {flashOn ? <ZapOff size={18} /> : <Zap size={18} />}
                    </span>
                    <span className="text-sm text-gray-500">Flash</span>
                </button>
                <button onClick={openManualEntry} className="flex flex-col items-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        <Keyboard size={18} />
                    </span>
                    <span className="text-sm text-gray-500">Enter Code</span>
                </button>
            </div>

            <Modal open={manualOpen} onClose={() => setManualOpen(false)} title="Enter Code">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <Field label="Customer or Reward Code" hint="e.g. CUS-000125">
                        <Input
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            autoFocus
                            required
                        />
                    </Field>
                    <Button type="submit" disabled={!manualCode.trim()}>
                        Submit
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
