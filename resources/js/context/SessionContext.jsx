import { createContext, useCallback, useContext, useState } from 'react';
import { clearToken, getToken, setToken } from '../lib/apiClient';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
    const [token, setTokenState] = useState(() => getToken());

    const login = useCallback((newToken) => {
        setToken(newToken);
        setTokenState(newToken);
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setTokenState(null);
    }, []);

    const value = {
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
    };

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used within SessionProvider');
    return ctx;
}
