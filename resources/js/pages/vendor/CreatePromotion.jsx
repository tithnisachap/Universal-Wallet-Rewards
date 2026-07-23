import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Stepper from '../../components/vendor/Stepper';
import PromotionForm, { defaultPromotionForm } from '../../components/vendor/PromotionForm';
import PromotionPreview from '../../components/vendor/PromotionPreview';

export default function CreatePromotion() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(defaultPromotionForm);
    const navigate = useNavigate();

    return (
        <div>
            <PageHeader title="Create Promotion" onBack={() => (step === 0 ? navigate(-1) : setStep(0))} />
            <Stepper steps={['Configure', 'Preview']} current={step} />

            <div className="px-4 pb-6">
                {step === 0 ? <PromotionForm value={form} onChange={setForm} /> : <PromotionPreview value={form} audience="your customers" />}

                <div className="mt-6">
                    {step === 0 ? (
                        <Button icon={ArrowRight} onClick={() => setStep(1)}>
                            Continue to Preview
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <Button icon={CheckCircle2} onClick={() => navigate('/vendor/promotions')}>
                                Publish Promotion
                            </Button>
                            <Button variant="outline" onClick={() => setStep(0)}>
                                Go Back to Edit
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
