import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
            <div className="app-shell max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
