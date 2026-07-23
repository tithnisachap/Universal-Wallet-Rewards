import { Camera, Map } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { vendorBranches } from '../../data/mock';

export default function AddEditBranch() {
    const { branchId } = useParams();
    const navigate = useNavigate();
    const editing = Boolean(branchId);
    const branch = editing ? vendorBranches.find((b) => b.id === branchId) : null;

    return (
        <div>
            <PageHeader title={editing ? 'Edit Branch' : 'Add Branch'} />
            <form
                className="space-y-5 px-4 py-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    navigate(-1);
                }}
            >
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-8">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <Camera size={20} />
                    </span>
                    <span className="font-semibold text-gray-900">Upload Branch Photo</span>
                    <span className="text-xs text-gray-400">JPEG, PNG up to 5MB</span>
                    <input type="file" accept="image/png,image/jpeg" className="hidden" />
                </label>

                <Field label="Branch Name">
                    <Input placeholder="e.g. Green Valley - Central Mall" defaultValue={branch?.name} />
                </Field>

                <Field label="Address">
                    <div className="relative">
                        <Input placeholder="Enter full street address" defaultValue={branch?.address} className="pr-11" />
                        <Map size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-600" />
                    </div>
                </Field>

                <Field label="Phone Number">
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                        <Select defaultValue="+1">
                            <option value="+1">+1</option>
                            <option value="+855">+855</option>
                            <option value="+66">+66</option>
                        </Select>
                        <Input placeholder="000-000-0000" defaultValue={branch?.phone} />
                    </div>
                </Field>

                <Field label="Opening Hours">
                    <div className="space-y-3 rounded-xl bg-gray-50 p-3">
                        <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
                            <span className="text-sm text-gray-600">Mon - Fri</span>
                            <Input type="time" defaultValue="09:00" />
                            <Input type="time" defaultValue="21:00" />
                        </div>
                        <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
                            <span className="text-sm text-gray-600">Sat - Sun</span>
                            <Input type="time" defaultValue="10:00" />
                            <Input type="time" defaultValue="18:00" />
                        </div>
                    </div>
                </Field>

                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}
