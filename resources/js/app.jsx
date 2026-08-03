import './bootstrap';
import '../css/app.css';
import 'leaflet/dist/leaflet.css';

import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
});

import { SessionProvider } from './context/SessionContext';
import AppShell from './layouts/AppShell';
import { router } from './router';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
        },
        mutations: {
            retry: 0,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AppShell>
                    <RouterProvider router={router} />
                </AppShell>
            </SessionProvider>
        </QueryClientProvider>
    );
}

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(<App />);
}
