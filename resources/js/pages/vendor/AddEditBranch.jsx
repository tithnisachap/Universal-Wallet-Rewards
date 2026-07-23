import { useEffect, useRef, useState } from 'react';
import { Camera, Map } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import QueryState from '../../components/ui/QueryState';
import { useCreateBranch, useUpdateBranch, useVendorBranch } from '../../queries/vendor';

export default function AddEditBranch() {
    const { branchId } = useParams();
    const navigate = useNavigate();
    const editing = Boolean(branchId);

    const { data: branch, isLoading, isError, error, refetch } = useVendorBranch(editing ? branchId : undefined);
    const createBranch = useCreateBranch();
    const updateBranch = useUpdateBranch(branchId);
    const mutation = editing ? updateBranch : createBranch;

    const [photoName, setPhotoName] = useState('');
    const photoInputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (branch && formRef.current) {
            formRef.current.name.value = branch.name;
            formRef.current.address.value = branch.address;
            if (branch.phone) formRef.current.phone_number.value = branch.phone;
            formRef.current.mon_fri_open.value = branch.opening_hours?.mon_fri?.open ?? '09:00';
            formRef.current.mon_fri_close.value = branch.opening_hours?.mon_fri?.close ?? '21:00';
            formRef.current.sat_sun_open.value = branch.opening_hours?.sat_sun?.open ?? '10:00';
            formRef.current.sat_sun_close.value = branch.opening_hours?.sat_sun?.close ?? '18:00';
        }
    }, [branch]);

    function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);

        const payload = new FormData();
        payload.set('name', form.get('name'));
        payload.set('address', form.get('address'));
        if (form.get('phone_number')) {
            payload.set('phone', `${form.get('phone_code')} ${form.get('phone_number')}`);
        }
        payload.set('opening_hours[mon_fri][open]', form.get('mon_fri_open'));
        payload.set('opening_hours[mon_fri][close]', form.get('mon_fri_close'));
        payload.set('opening_hours[sat_sun][open]', form.get('sat_sun_open'));
        payload.set('opening_hours[sat_sun][close]', form.get('sat_sun_close'));
        if (photoInputRef.current?.files[0]) payload.set('photo', photoInputRef.current.files[0]);

        mutation.mutate(payload, {
            onSuccess: () => navigate(editing ? `/vendor/branches/${branchId}` : '/vendor/branches'),
        });
    }

    if (editing && isLoading) {
        return (
            <div>
                <PageHeader title="Edit Branch" />
                <QueryState isLoading />
            </div>
        );
    }

    if (editing && isError) {
        return (
            <div>
                <PageHeader title="Edit Branch" />
                <div className="px-4 py-4">
                    <QueryState isError error={error} onRetry={refetch} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title={editing ? 'Edit Branch' : 'Add Branch'} />
            <form ref={formRef} className="space-y-5 px-4 py-4" onSubmit={handleSubmit}>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-8">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <Camera size={20} />
                    </span>
                    <span className="font-semibold text-gray-900">{photoName || 'Upload Branch Photo'}</span>
                    <span className="text-xs text-gray-400">JPEG, PNG up to 5MB</span>
                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => setPhotoName(e.target.files[0]?.name ?? '')}
                    />
                </label>

                <Field label="Branch Name">
                    <Input name="name" placeholder="e.g. Green Valley - Central Mall" required />
                </Field>

                <Field label="Address">
                    <div className="relative">
                        <Input name="address" placeholder="Enter full street address" className="pr-11" required />
                        <Map size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-600" />
                    </div>
                </Field>

                <Field label="Phone Number">
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                        <Select name="phone_code" defaultValue="+1">
                            <option value="+1">+1</option>
                            <option value="+855">+855</option>
                            <option value="+66">+66</option>
                        </Select>
                        <Input name="phone_number" placeholder="000-000-0000" />
                    </div>
                </Field>

                <Field label="Opening Hours">
                    <div className="space-y-3 rounded-xl bg-gray-50 p-3">
                        <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
                            <span className="text-sm text-gray-600">Mon - Fri</span>
                            <Input name="mon_fri_open" type="time" defaultValue="09:00" />
                            <Input name="mon_fri_close" type="time" defaultValue="21:00" />
                        </div>
                        <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
                            <span className="text-sm text-gray-600">Sat - Sun</span>
                            <Input name="sat_sun_open" type="time" defaultValue="10:00" />
                            <Input name="sat_sun_close" type="time" defaultValue="18:00" />
                        </div>
                    </div>
                </Field>

                {mutation.isError ? <p className="text-sm text-danger-500">{mutation.error.message}</p> : null}

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </div>
    );
}
