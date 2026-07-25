import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import VendorAvatar from '../../components/VendorAvatar';
import { useUpdateVendorProfile, useVendorProfile } from '../../queries/vendor';

export default function EditProfile() {
    const navigate = useNavigate();
    const { data: vendor, isLoading, isError, error, refetch } = useVendorProfile();
    const updateProfile = useUpdateVendorProfile(vendor?.id);

    const [logoName, setLogoName] = useState('');
    const logoInputRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();

        const form = new FormData(e.target);
        const payload = new FormData();
        payload.set('business_name', form.get('business_name'));
        payload.set('category', form.get('category'));
        payload.set('phone', form.get('phone') ?? '');
        payload.set('email', form.get('email') ?? '');
        payload.set('website', form.get('website') ?? '');
        if (logoInputRef.current?.files[0]) payload.set('logo', logoInputRef.current.files[0]);

        updateProfile.mutate(payload, {
            onSuccess: () => navigate('/vendor/profile'),
        });
    }

    if (isLoading) {
        return (
            <div>
                <PageHeader title="Edit Profile" />
                <QueryState isLoading />
            </div>
        );
    }

    if (isError || !vendor) {
        return (
            <div>
                <PageHeader title="Edit Profile" />
                <div className="px-4 py-4">
                    <QueryState isError error={error} onRetry={refetch} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Edit Profile" />
            <form className="space-y-5 px-4 py-4" onSubmit={handleSubmit}>
                <Field label="Business Logo">
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-8">
                        {logoName ? (
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white">
                                <Upload size={20} />
                            </span>
                        ) : (
                            <VendorAvatar vendor={vendor} size="lg" />
                        )}
                        <span className="font-semibold text-brand-600">{logoName || 'Change Logo'}</span>
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
                    <Input name="business_name" defaultValue={vendor.business_name} required />
                </Field>

                <Field label="Category">
                    <Select name="category" defaultValue={vendor.category} required>
                        <option value="Coffee Shop">Coffee Shop</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Retail">Retail</option>
                    </Select>
                </Field>

                <Field label="Phone Number">
                    <Input name="phone" defaultValue={vendor.phone ?? ''} placeholder="+855 12 345 678" />
                </Field>

                <Field label="Email">
                    <Input name="email" type="email" defaultValue={vendor.email ?? ''} placeholder="you@business.com" />
                </Field>

                <Field label="Website (Optional)">
                    <Input name="website" defaultValue={vendor.website ?? ''} placeholder="https://yourwebsite.com" />
                </Field>

                <p className="text-xs text-gray-400">
                    Shop location is managed from Branches — edit your main branch there to move the pin.
                </p>

                {updateProfile.isError ? <p className="text-sm text-danger-500">{updateProfile.error.message}</p> : null}

                <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
}
