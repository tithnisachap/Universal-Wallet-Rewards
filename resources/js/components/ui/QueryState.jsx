import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

/**
 * Wraps the loading / error / empty / content branches every data-driven
 * screen needs so pages don't each hand-roll the same four-way branch.
 */
export default function QueryState({
    isLoading,
    isError,
    error,
    onRetry,
    isEmpty = false,
    emptyState = null,
    loadingLabel,
    children,
}) {
    if (isLoading) {
        return <LoadingState label={loadingLabel} />;
    }

    if (isError) {
        return <ErrorState message={error?.message} onRetry={onRetry} />;
    }

    if (isEmpty) {
        return emptyState;
    }

    return children;
}
