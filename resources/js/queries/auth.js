import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';
import { useSession } from '../context/SessionContext';

export function useMe(options = {}) {
    const { token } = useSession();
    const { enabled = true, ...rest } = options;

    return useQuery({
        queryKey: ['me'],
        queryFn: () => api.get('/me'),
        enabled: Boolean(token) && enabled,
        retry: false,
        ...rest,
    });
}

export function useDevLogin() {
    const { login } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (email) => api.post('/auth/dev-login', { email }),
        onSuccess: (data) => {
            login(data.token);
            queryClient.setQueryData(['me'], data.user);
        },
    });
}

export function useLogout() {
    const { logout } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                await api.post('/auth/logout');
            } catch {
                // Token may already be invalid server-side — clear locally regardless.
            }
        },
        onSettled: () => {
            logout();
            queryClient.clear();
        },
    });
}
