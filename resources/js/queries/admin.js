import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export function useAdminDashboard() {
    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => api.get('/admin/dashboard'),
    });
}

export function useAdminVendors(status = 'pending') {
    return useQuery({
        queryKey: ['admin', 'vendors', { status }],
        queryFn: () => api.get('/admin/vendors', { params: { status } }),
        placeholderData: (previous) => previous,
    });
}

export function useAdminVendor(vendorId) {
    return useQuery({
        queryKey: ['admin', 'vendors', vendorId],
        queryFn: () => api.get(`/admin/vendors/${vendorId}`),
        enabled: Boolean(vendorId),
    });
}

function invalidateVendorLists(queryClient, vendorId) {
    queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    if (vendorId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'vendors', vendorId] });
    }
}

export function useReviewVendor(vendorId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post(`/admin/vendors/${vendorId}/review`, payload),
        onSuccess: () => invalidateVendorLists(queryClient, vendorId),
    });
}

export function useSuspendVendor(vendorId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post(`/admin/vendors/${vendorId}/suspend`, payload),
        onSuccess: () => invalidateVendorLists(queryClient, vendorId),
    });
}

export function useReinstateVendor(vendorId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.post(`/admin/vendors/${vendorId}/reinstate`),
        onSuccess: () => invalidateVendorLists(queryClient, vendorId),
    });
}

export function useAdminAnalytics(period = 'month') {
    return useQuery({
        queryKey: ['admin', 'analytics', { period }],
        queryFn: () => api.get('/admin/analytics', { params: { period } }),
    });
}

export function usePlatformSettings() {
    return useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => api.get('/admin/settings'),
    });
}

export function useUpdatePlatformSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.put('/admin/settings', payload),
        onSuccess: (data) => {
            queryClient.setQueryData(['admin', 'settings'], data);
        },
    });
}
