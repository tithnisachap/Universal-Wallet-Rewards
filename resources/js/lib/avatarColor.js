const PALETTE = [
    'bg-amber-900',
    'bg-emerald-700',
    'bg-gray-900',
    'bg-orange-600',
    'bg-indigo-700',
    'bg-rose-700',
    'bg-teal-700',
    'bg-sky-800',
];

/**
 * Deterministically maps an id/name to one of the fixed brand-safe colors
 * so vendor initial-avatars stay visually stable across renders without
 * the backend needing to store a color.
 */
export function colorFor(seed) {
    const str = String(seed ?? '');
    let hash = 0;

    for (let i = 0; i < str.length; i += 1) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return PALETTE[hash % PALETTE.length];
}
