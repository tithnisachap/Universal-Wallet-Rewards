import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import PromotionForm from '../../components/vendor/PromotionForm';
import PromotionPreview from '../../components/vendor/PromotionPreview';
import { useUpdatePromotion, useVendorPromotion, useVendorProfile } from '../../queries/vendor';

function toFormShape(promo) {
    return {
        type: promo.type,
        category: promo.category,
        title: promo.title,
        description: promo.description ?? '',
        amount: promo.required_amount,
        startDate: promo.starts_at?.slice(0, 10) ?? '',
        endDate: promo.ends_at?.slice(0, 10) ?? '',
        is_active: promo.is_active,
    };
}

export default function EditPromotion() {
    const { promotionId } = useParams();
    const navigate = useNavigate();
    const { data: vendor } = useVendorProfile();
    const { data: promotion, isLoading, isError, error, refetch } = useVendorPromotion(promotionId);
    const updatePromotion = useUpdatePromotion(promotionId);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (promotion && !form) {
            setForm(toFormShape(promotion));
        }
    }, [promotion, form]);

    function handleSave() {
        updatePromotion.mutate(
            {
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
            <PageHeader title="Edit Promotion" onBack={() => (editing ? setEditing(false) : navigate(-1))} />
            <div className="px-4 py-4 pb-6">
                <QueryState isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
                    {form ? (
                        <>
                            {editing ? (
                                <PromotionForm value={form} onChange={setForm} />
                            ) : (
                                <PromotionPreview value={form} vendor={vendor} audience="your customers" />
                            )}

                            {updatePromotion.isError ? (
                                <p className="mt-4 text-sm text-danger-500">{updatePromotion.error.message}</p>
                            ) : null}

                            <div className="mt-6 flex gap-3">
                                <Button variant="outline" onClick={() => (editing ? setEditing(false) : navigate(-1))}>
                                    Back
                                </Button>
                                {editing ? (
                                    <Button onClick={handleSave} disabled={updatePromotion.isPending}>
                                        {updatePromotion.isPending ? 'Saving...' : 'Save'}
                                    </Button>
                                ) : (
                                    <Button onClick={() => setEditing(true)}>Edit</Button>
                                )}
                            </div>
                        </>
                    ) : null}
                </QueryState>
            </div>
        </div>
    );
}
