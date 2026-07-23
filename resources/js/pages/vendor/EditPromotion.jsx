import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import PromotionForm from '../../components/vendor/PromotionForm';
import PromotionPreview from '../../components/vendor/PromotionPreview';
import { promotions } from '../../data/mock';

function toFormShape(promo) {
    const amount = parseInt(promo.requirement, 10) || 0;
    return {
        type: promo.type,
        category: promo.category,
        title: promo.title,
        description: promo.description,
        amount,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
    };
}

export default function EditPromotion() {
    const { promotionId } = useParams();
    const navigate = useNavigate();
    const promo = promotions.find((p) => String(p.id) === promotionId) ?? promotions[0];
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(() => toFormShape(promo));

    return (
        <div>
            <PageHeader title="Edit Promotion" onBack={() => (editing ? setEditing(false) : navigate(-1))} />
            <div className="px-4 py-4 pb-6">
                {editing ? <PromotionForm value={form} onChange={setForm} /> : <PromotionPreview value={form} audience="your customers" />}

                <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => (editing ? setEditing(false) : navigate(-1))}>
                        Back
                    </Button>
                    {editing ? (
                        <Button onClick={() => navigate('/vendor/promotions')}>Save</Button>
                    ) : (
                        <Button onClick={() => setEditing(true)}>Edit</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
