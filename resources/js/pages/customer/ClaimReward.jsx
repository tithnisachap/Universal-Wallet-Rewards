import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import QRCodeBlock from '../../components/ui/QRCodeBlock';
import QueryState from '../../components/ui/QueryState';
import { useClaimReward } from '../../queries/customer';

function useCountdown(secondsRemaining) {
    const [seconds, setSeconds] = useState(secondsRemaining ?? 0);
    const startedFrom = useRef(secondsRemaining);

    useEffect(() => {
        if (secondsRemaining == null || secondsRemaining === startedFrom.current) return;
        startedFrom.current = secondsRemaining;
        setSeconds(secondsRemaining);
    }, [secondsRemaining]);

    useEffect(() => {
        if (seconds <= 0) return undefined;
        const interval = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(interval);
    }, [seconds > 0]);

    return seconds;
}

export default function ClaimReward() {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const claimReward = useClaimReward(vendorId);
    const hasClaimed = useRef(false);

    useEffect(() => {
        if (hasClaimed.current) return;
        hasClaimed.current = true;
        claimReward.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const redemption = claimReward.data;
    const seconds = useCountdown(redemption?.seconds_remaining);
    const minutes = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');

    return (
        <div>
            <PageHeader title="Claim Reward" />
            <div className="px-4 py-6 text-center">
                <QueryState
                    isLoading={claimReward.isPending}
                    isError={claimReward.isError}
                    error={claimReward.error}
                    onRetry={() => claimReward.mutate()}
                    loadingLabel="Preparing your reward..."
                >
                    {redemption ? (
                        <>
                            <h1 className="text-xl font-bold text-gray-900">Congratulations!</h1>
                            <p className="mt-2 text-sm text-gray-500">
                                You completed all {redemption.promotion.required_amount} stamps. Claim your reward now!
                            </p>

                            <Card className="mt-6 p-0 text-left">
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <p className="font-bold text-gray-900">{redemption.promotion.title}</p>
                                    <p className="text-xs uppercase text-gray-400">{redemption.promotion.description}</p>
                                </div>
                                <div className="px-4 py-5">
                                    <p className="mb-4 text-center text-sm text-gray-500">
                                        Show this code to the staff to redeem your reward.
                                    </p>
                                    <QRCodeBlock value={redemption.code} />
                                    <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600">
                                        <Clock size={16} />
                                        {seconds > 0 ? (
                                            <>
                                                Code expires in {minutes}:{secs}
                                            </>
                                        ) : (
                                            'Code expired'
                                        )}
                                    </p>
                                    <p className="mt-1 text-center text-xs text-gray-400">This code can only be used once.</p>
                                </div>
                            </Card>

                            <Button className="mt-6" onClick={() => navigate(-1)}>
                                Done
                            </Button>
                        </>
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}
