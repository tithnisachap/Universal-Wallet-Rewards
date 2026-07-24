import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { homeRoutesByRole } from '../../data/homeRoutes';
import { useDevSignup } from '../../queries/auth';

const roleLabels = {
    customer: 'Customer',
    vendor: 'Vendor',
};

export default function SignupAccountPicker() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const devSignup = useDevSignup();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const roleLabel = roleLabels[role];

    function handleSubmit(e) {
        e.preventDefault();
        if (!roleLabel) return;

        devSignup.mutate(
            { role, name: name.trim(), email: email.trim() },
            { onSuccess: () => navigate(homeRoutesByRole[role] ?? '/login') },
        );
    }

    if (!roleLabel) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <p className="text-sm text-gray-500">Please pick an account type first.</p>
                <Button className="mt-4 w-auto px-6" onClick={() => navigate('/signup')}>
                    Back to Sign Up
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center px-6 pt-16">
            <h1 className="text-xl font-bold text-gray-900">Create a {roleLabel} Account</h1>
            <p className="mt-2 text-center text-sm text-gray-500">
                Dev sign-in mock — stands in for the Google account picker.
            </p>

            <Card className="mt-8 w-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Full Name">
                        <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
                    </Field>
                    <Field label="Email">
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Field>

                    {devSignup.isError ? (
                        <p className="text-sm text-danger-500">{devSignup.error.message}</p>
                    ) : null}

                    <Button type="submit" disabled={devSignup.isPending || !name.trim() || !email.trim()}>
                        {devSignup.isPending ? 'Creating...' : 'Create Account'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
