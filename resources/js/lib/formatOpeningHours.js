function formatTime(value) {
    if (!value) return '';
    const [hourStr, minute] = value.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour}:${minute} ${period}`;
}

/**
 * Formats the branches.opening_hours jsonb column
 * ({ mon_fri: { open, close }, sat_sun: { open, close } }) into the single
 * display line the UI shows, e.g. "8:00 AM – 10:00 PM".
 */
export function formatOpeningHours(openingHours) {
    const range = openingHours?.mon_fri;

    if (!range?.open || !range?.close) {
        return 'Hours not set';
    }

    return `${formatTime(range.open)} – ${formatTime(range.close)}`;
}
