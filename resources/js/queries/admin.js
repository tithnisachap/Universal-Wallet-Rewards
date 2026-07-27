import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getPaginated } from '../lib/apiClient';

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

// "All Vendors" directory tab — separate from the pending/history queries
// above since it needs real page controls, not just a flat list.
export function useAdminVendorDirectory({ search = '', page = 1 } = {}) {
    return useQuery({
        queryKey: ['admin', 'vendors', 'directory', { search, page }],
        queryFn: () =>
            getPaginated('/admin/vendors', {
                params: { status: 'all', search: search || undefined, page, per_page: 10 },
            }),
        placeholderData: (previous) => previous,
    });
}

export function useAdminCustomers({ search = '', page = 1 } = {}) {
    return useQuery({
        queryKey: ['admin', 'customers', { search, page }],
        queryFn: () =>
            getPaginated('/admin/customers', {
                params: { search: search || undefined, page, per_page: 10 },
            }),
        placeholderData: (previous) => previous,
    });
}

export function useAdminCustomer(customerId) {
    return useQuery({
        queryKey: ['admin', 'customers', customerId],
        queryFn: () => api.get(`/admin/customers/${customerId}`),
        enabled: Boolean(customerId),
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
