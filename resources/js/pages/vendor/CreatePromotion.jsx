import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Stepper from '../../components/vendor/Stepper';
import PromotionForm, { defaultPromotionForm } from '../../components/vendor/PromotionForm';
import PromotionPreview from '../../components/vendor/PromotionPreview';
import { useCreatePromotion, useVendorProfile } from '../../queries/vendor';

export default function CreatePromotion() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(defaultPromotionForm);
    const navigate = useNavigate();
    const { data: vendor } = useVendorProfile();
    const createPromotion = useCreatePromotion();

    function handlePublish() {
        createPromotion.mutate(
            {
                type: form.type,
                category: form.category,
                title: form.title,
                description: form.description,
                required_amount: form.amount,
                starts_at: form.startDate,
                ends_at: form.endDate,
            },
            { onSuccess: () => navigate('/vendor/promotions') },
        );
    }

    return (
        <div>
            <PageHeader title="Create Promotion" onBack={() => (step === 0 ? navigate(-1) : setStep(0))} />
            <Stepper steps={['Configure', 'Preview']} current={step} />

            <div className="px-4 pb-6">
                {step === 0 ? (
                    <PromotionForm value={form} onChange={setForm} />
                ) : (
                    <PromotionPreview value={form} vendor={vendor} audience="your customers" />
                )}

                {createPromotion.isError ? (
                    <p className="mt-4 text-sm text-danger-500">{createPromotion.error.message}</p>
                ) : null}

                <div className="mt-6">
                    {step === 0 ? (
                        <Button icon={ArrowRight} onClick={() => setStep(1)} disabled={!form.title}>
                            Continue to Preview
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <Button icon={CheckCircle2} onClick={handlePublish} disabled={createPromotion.isPending}>
                                {createPromotion.isPending ? 'Publishing...' : 'Publish Promotion'}
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
