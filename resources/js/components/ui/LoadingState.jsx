import { cn } from '../../lib/cn';

export default function LoadingState({ label = 'Loading...', className, fullScreen = false }) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 py-16 text-gray-400',
                fullScreen && 'min-h-screen',
                className,
            )}
        >
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600" />
            <p className="text-sm">{label}</p>
        </div>
    );
}
