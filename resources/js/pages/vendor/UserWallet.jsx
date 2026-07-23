import { useState } from 'react';
import { Minus, Plus, PlusCircle, MinusCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import StampGrid from '../../components/ui/StampGrid';
import { SegmentedControl } from '../../components/ui/Tabs';
import { scannedCustomer } from '../../data/mock';

export default function UserWallet() {
    const [mode, setMode] = useState('stamp');
    const [stampsToAdd, setStampsToAdd] = useState(1);
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [pointsToDeduct, setPointsToDeduct] = useState(100);

    return (
        <div>
            <PageHeader title="User Wallet" />
            <div className="space-y-4 px-4 py-4">
                <Card className="flex items-center gap-3">
                    <Avatar size={44} />
                    <div>
                        <p className="font-bold text-gray-900">{scannedCustomer.name}</p>
                        <p className="text-sm text-gray-500">{scannedCustomer.id}</p>
                    </div>
                </Card>

                <SegmentedControl
                    options={[
                        { value: 'stamp', label: 'Stamp' },
                        { value: 'points', label: 'Points' },
                    ]}
                    value={mode}
                    onChange={setMode}
                />

                {mode === 'stamp' ? (
                    <>
                        <Card className="bg-brand-50">
                            <p className="text-xs uppercase text-brand-500">Stamp Balance</p>
                            <p className="mt-1 text-2xl font-bold text-brand-700">{scannedCustomer.stamps} stamps</p>
                        </Card>

                        <Card>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-semibold text-gray-900">Collect stamps</p>
                                <p className="font-bold text-brand-600">
                                    {scannedCustomer.stamps} / {scannedCustomer.stampsRequired}
                                </p>
                            </div>
                            <StampGrid total={scannedCustomer.stampsRequired} collected={scannedCustomer.stamps} />
                        </Card>

                        <Card>
                            <p className="mb-3 text-center font-semibold text-gray-900">Amount of Stamps to Add</p>
                            <div className="flex items-center justify-between">
                                <RoundButton onClick={() => setStampsToAdd((v) => Math.max(1, v - 1))} icon={Minus} />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stampsToAdd}</p>
                                    <p className="text-xs text-gray-400">Stamps</p>
                                </div>
                                <RoundButton onClick={() => setStampsToAdd((v) => v + 1)} icon={Plus} filled />
                            </div>
                        </Card>

                        <Button icon={PlusCircle}>Add Stamp</Button>
                    </>
                ) : (
                    <>
                        <Card className="bg-brand-50">
                            <p className="text-xs uppercase text-brand-500">Points BALANCE</p>
                            <p className="mt-1 text-2xl font-bold text-brand-700">{scannedCustomer.points} points</p>
                        </Card>

                        <Card>
                            <p className="mb-3 text-center text-xs font-semibold uppercase text-gray-400">Points to Add</p>
                            <div className="flex items-center justify-between">
                                <RoundButton onClick={() => setPointsToAdd((v) => Math.max(0, v - 10))} icon={Minus} />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{pointsToAdd}</p>
                                    <p className="text-xs text-gray-400">Manual Entry</p>
                                </div>
                                <RoundButton onClick={() => setPointsToAdd((v) => v + 10)} icon={Plus} filled />
                            </div>
                            <div className="mt-3 flex gap-2">
                                {[10, 50, 100].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setPointsToAdd((v) => v + amount)}
                                        className="flex-1 rounded-full bg-brand-50 py-1.5 text-sm font-medium text-brand-600"
                                    >
                                        +{amount}
                                    </button>
                                ))}
                                <button onClick={() => setPointsToAdd(0)} className="flex-1 rounded-full bg-gray-100 py-1.5 text-sm font-medium text-gray-500">
                                    Reset
                                </button>
                            </div>
                        </Card>

                        <Button icon={PlusCircle}>Add Points</Button>

                        <Card>
                            <p className="mb-3 text-center font-semibold text-gray-900">Points to Deduct</p>
                            <div className="flex items-center justify-between">
                                <RoundButton onClick={() => setPointsToDeduct((v) => Math.max(0, v - 10))} icon={Minus} danger />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-danger-500">{pointsToDeduct}</p>
                                    <p className="text-xs text-gray-400">Points</p>
                                </div>
                                <RoundButton onClick={() => setPointsToDeduct((v) => v + 10)} icon={Plus} danger />
                            </div>
                        </Card>

                        <Button variant="danger" icon={MinusCircle}>
                            Deduct Points
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

function RoundButton({ onClick, icon: Icon, filled, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                danger ? 'bg-danger-50 text-danger-500' : filled ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'
            }`}
        >
            <Icon size={18} />
        </button>
    );
}
