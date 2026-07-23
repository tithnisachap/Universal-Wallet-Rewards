import { createContext, useContext, useMemo, useState } from 'react';

const SessionContext = createContext(null);

const STORAGE_KEY = 'uw_mock_session';

function readStoredSession() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
        return {};
    }
}

export function SessionProvider({ children }) {
    const [sessions, setSessions] = useState(readStoredSession);

    const value = useMemo(
        () => ({
            isAuthenticated: (role) => Boolean(sessions[role]),
            login: (role) => {
                setSessions((prev) => {
                    const next = { ...prev, [role]: true };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                    return next;
                });
            },
            logout: (role) => {
                setSessions((prev) => {
                    const next = { ...prev, [role]: false };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                    return next;
                });
            },
        }),
        [sessions],
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within SessionProvider');
    return ctx;
}
