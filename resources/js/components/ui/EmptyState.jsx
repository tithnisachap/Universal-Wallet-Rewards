export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            {Icon ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Icon size={24} />
                </div>
            ) : null}
            <div>
                <p className="font-semibold text-gray-900">{title}</p>
                {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
            </div>
            {action}
        </div>
    );
}
