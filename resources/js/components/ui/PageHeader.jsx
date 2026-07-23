import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, onBack, right }) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-4">
            <button
                onClick={onBack ?? (() => navigate(-1))}
                className="rounded-full p-1 text-gray-700 hover:bg-gray-100"
                aria-label="Go back"
            >
                <ArrowLeft size={20} />
            </button>
            <h1 className="flex-1 text-base font-bold text-gray-900">{title}</h1>
            {right}
        </div>
    );
}
