import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import Button from '../../components/ui/Button';

export default function ShopSetup() {
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    if (submitted) {
        return (
            <div>
                <PageHeader title="Set Up Your Shop" onBack={() => setSubmitted(false)} />
                <div className="flex flex-col items-center px-6 py-16 text-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
                    <h1 className="mt-6 text-xl font-bold text-gray-900">Your shop has been submitted</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Your shop is now pending review by our admin. We will notify you once your shop is approved or rejected.
                    </p>
                    <Button className="mt-10" onClick={() => navigate('/vendor/dashboard')}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Set Up Your Shop" />
            <form
                className="space-y-5 px-4 py-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}
            >
                <div>
                    <p className="font-bold text-gray-900">Business Information</p>
                    <p className="text-sm text-gray-500">Complete your profile to start creating loyalty programs.</p>
                </div>

                <Field label="Business Logo">
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-8">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white">
                            <Upload size={20} />
                        </span>
                        <span className="font-semibold text-brand-600">Upload Logo</span>
                        <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                        <input type="file" accept="image/png,image/jpeg" className="hidden" />
                    </label>
                </Field>

                <Field label="Business Name">
                    <Input placeholder="Enter business name" required />
                </Field>

                <Field label="Category">
                    <Select defaultValue="">
                        <option value="" disabled>
                            Select category
                        </option>
                        <option value="coffee">Coffee Shop</option>
                        <option value="bakery">Bakery</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="retail">Retail</option>
                    </Select>
                </Field>

                <div className="grid grid-cols-[100px_1fr] gap-3">
                    <Field label="Code">
                        <Select defaultValue="+855">
                            <option value="+855">+855</option>
                            <option value="+1">+1</option>
                            <option value="+66">+66</option>
                        </Select>
                    </Field>
                    <Field label="Phone Number">
                        <Input placeholder="12 345 678" />
                    </Field>
                </div>

                <Field label="Address">
                    <Textarea placeholder="Enter business address" />
                </Field>

                <Field label="Website (Optional)">
                    <Input placeholder="https://yourwebsite.com" />
                </Field>

                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}
