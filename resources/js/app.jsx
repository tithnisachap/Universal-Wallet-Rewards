import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { SessionProvider } from './context/SessionContext';
import AppShell from './layouts/AppShell';
import { router } from './router';

function App() {
    return (
        <SessionProvider>
            <AppShell>
                <RouterProvider router={router} />
            </AppShell>
        </SessionProvider>
    );
}

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(<App />);
}
