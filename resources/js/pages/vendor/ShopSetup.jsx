import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import LocationPicker from '../../components/LocationPicker';
import { useCreateVendorProfile } from '../../queries/vendor';

export default function ShopSetup() {
    const [submitted, setSubmitted] = useState(false);
    const [logoName, setLogoName] = useState('');
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(false);
    const logoInputRef = useRef(null);
    const navigate = useNavigate();
    const createProfile = useCreateVendorProfile();

    function handleSubmit(e) {
        e.preventDefault();

        if (!location) {
            setLocationError(true);
            return;
        }
        setLocationError(false);

        const form = new FormData(e.target);

        const phoneCode = form.get('phone_code');
        const phoneNumber = form.get('phone_number');
        const payload = new FormData();
        payload.set('business_name', form.get('business_name'));
        payload.set('category', form.get('category'));
        if (phoneNumber) payload.set('phone', `${phoneCode} ${phoneNumber}`);
        payload.set('latitude', location.latitude);
        payload.set('longitude', location.longitude);
        if (form.get('website')) payload.set('website', form.get('website'));
        if (logoInputRef.current?.files[0]) payload.set('logo', logoInputRef.current.files[0]);

        createProfile.mutate(payload, {
            onSuccess: () => setSubmitted(true),
        });
    }

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
            <form className="space-y-5 px-4 py-4" onSubmit={handleSubmit}>
                <div>
                    <p className="font-bold text-gray-900">Business Information</p>
                    <p className="text-sm text-gray-500">Complete your profile to start creating loyalty programs.</p>
                </div>

                <Field label="Business Logo">
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-8">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white">
                            <Upload size={20} />
                        </span>
                        <span className="font-semibold text-brand-600">{logoName || 'Upload Logo'}</span>
                        <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => setLogoName(e.target.files[0]?.name ?? '')}
                        />
                    </label>
                </Field>

                <Field label="Business Name">
                    <Input name="business_name" placeholder="Enter business name" required />
                </Field>

                <Field label="Category">
                    <Select name="category" defaultValue="" required>
                        <option value="" disabled>
                            Select category
                        </option>
                        <option value="Coffee Shop">Coffee Shop</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Retail">Retail</option>
                    </Select>
                </Field>

                <div className="grid grid-cols-[100px_1fr] gap-3">
                    <Field label="Code">
                        <Select name="phone_code" defaultValue="+855">
                            <option value="+855">+855</option>
                            <option value="+1">+1</option>
                            <option value="+66">+66</option>
                        </Select>
                    </Field>
                    <Field label="Phone Number">
                        <Input name="phone_number" placeholder="12 345 678" />
                    </Field>
                </div>

                <Field label="Location">
                    <LocationPicker onChange={setLocation} />
                    {locationError ? (
                        <p className="mt-1 text-sm text-danger-500">Tap the map or search to set your shop's location.</p>
                    ) : null}
                </Field>

                <Field label="Website (Optional)">
                    <Input name="website" placeholder="https://yourwebsite.com" />
                </Field>

                {createProfile.isError ? <p className="text-sm text-danger-500">{createProfile.error.message}</p> : null}

                <Button type="submit" disabled={createProfile.isPending}>
                    {createProfile.isPending ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </div>
    );
}
