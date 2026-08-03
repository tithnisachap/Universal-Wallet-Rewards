import { useMe } from '../../queries/auth';

const panelLabels = {
    customer: 'Customer',
    vendor: 'Vendor',
    branch_staff: 'Branch Staff',
    admin: 'Admin',
};

export default function TopBar({ panel }) {
    const { data: me } = useMe();
    const label = panel ?? (me?.role ? panelLabels[me.role] : null);

    return (
        <div className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-between overflow-hidden border-b border-gray-100 bg-white px-4">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="shrink-0 text-sm font-bold text-brand-600">Universal Wallet</span>
                {label ? (
                    <>
                        <span className="shrink-0 text-gray-300">·</span>
                        <span className="truncate text-sm font-medium text-gray-500">{label}</span>
                    </>
                ) : null}
            </div>
            {me?.name ? (
                <span className="ml-3 max-w-[120px] shrink-0 truncate text-sm font-medium text-gray-700">{me.name}</span>
            ) : null}
        </div>
    );
}
