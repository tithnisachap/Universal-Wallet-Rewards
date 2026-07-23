export const ACTIVITY_LABELS = {
    points_earned: 'Points Earned',
    points_deducted: 'Points Deducted',
    stamp_earned: 'Stamp Earned',
    reward_redeemed: 'Reward Redeemed',
};

export function activityLabel(type) {
    return ACTIVITY_LABELS[type] ?? type;
}

export function formatAmount(amount) {
    return amount > 0 ? `+${amount}` : `${amount}`;
}

/**
 * Vendor Activity feed's compact line, e.g. "+25 Points", "+1 Stamp",
 * "-150 Points", or "Redeemed 10 Stamps" for a completed reward.
 */
export function vendorActivityLine(item) {
    if (item.type === 'reward_redeemed') {
        return `Redeemed ${Math.abs(item.amount)} Stamps`;
    }

    const unit = item.type === 'stamp_earned' ? 'Stamp' : 'Points';
    return `${formatAmount(item.amount)} ${unit}`;
}

export function formatDateTime(isoString) {
    const date = new Date(isoString);

    return {
        date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    };
}
