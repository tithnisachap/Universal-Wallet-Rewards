import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger-100 bg-danger-50 px-6 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-danger-500">
                <AlertTriangle size={20} />
            </span>
            <div>
                <p className="font-semibold text-gray-900">{title}</p>
                {message ? <p className="mt-1 text-sm text-gray-500">{message}</p> : null}
            </div>
            {onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry} className="w-auto px-6">
                    Try Again
                </Button>
            ) : null}
        </div>
    );
}
