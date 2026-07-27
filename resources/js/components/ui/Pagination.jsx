import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * `meta` is Laravel's paginator meta object (current_page, last_page, ...),
 * as returned by `getPaginated()`. Renders nothing for a single-page result.
 */
export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-1 py-3">
            <button
                type="button"
                onClick={() => onPageChange(meta.current_page - 1)}
                disabled={meta.current_page <= 1}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 disabled:opacity-40"
            >
                <ChevronLeft size={16} /> Prev
            </button>
            <p className="text-sm text-gray-500">
                Page {meta.current_page} of {meta.last_page}
            </p>
            <button
                type="button"
                onClick={() => onPageChange(meta.current_page + 1)}
                disabled={meta.current_page >= meta.last_page}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 disabled:opacity-40"
            >
                Next <ChevronRight size={16} />
            </button>
        </div>
    );
}
