import { useNavigate } from 'react-router-dom';

const features = [
    { icon: 'fi-sr-wallet', label: 'Obtain Wallet' },
    { icon: 'fi-sr-badge', label: 'Collect Stamps and points' },
    { icon: 'fi-sr-gift', label: 'Claim Rewards' },
];

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Hero */}
            <div className="relative flex flex-1 flex-col items-center justify-center bg-brand-600 px-6 pb-24 pt-16 text-center">
                <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
                    Universal<br />Wallet
                </h1>
                <p className="mt-3 text-base text-brand-200">
                    Your personal wallet, for <em>every</em> shop
                </p>

                <div className="mt-12 flex w-full max-w-xs justify-between gap-4">
                    {features.map((feat) => (
                        <div key={feat.icon} className="flex flex-1 flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                                <i className={`fi ${feat.icon} text-2xl text-white`} style={{ lineHeight: 1 }} />
                            </div>
                            <p className="text-center text-xs font-semibold leading-snug text-white/90">{feat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Wave */}
                <div className="absolute inset-x-0 bottom-0 leading-none">
                    <svg viewBox="0 0 430 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-16 w-full">
                        <path d="M0,30 C80,60 180,0 280,30 C360,54 410,20 430,30 L430,60 L0,60 Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center bg-white px-6 pb-12 pt-6">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full max-w-xs rounded-full bg-brand-600 py-4 text-base font-bold text-white shadow-lg active:scale-95"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
