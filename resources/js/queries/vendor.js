import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export function useVendorProfile() {
    return useQuery({
        queryKey: ['vendor', 'profile'],
        queryFn: () => api.get('/vendor/profile'),
        retry: false,
    });
}

export function useCreateVendorProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => api.post('/vendor/profile', formData),
        onSuccess: (data) => {
            queryClient.setQueryData(['vendor', 'profile'], data);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useUpdateVendorProfile(vendorId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => api.put(`/vendor/profile/${vendorId}`, formData),
        onSuccess: (data) => {
            queryClient.setQueryData(['vendor', 'profile'], data);
        },
    });
}

export function useVendorDashboard(branchId) {
    return useQuery({
        queryKey: ['vendor', 'dashboard', { branchId }],
        queryFn: () => api.get('/vendor/dashboard', { params: { branch_id: branchId || undefined } }),
    });
}

export function useVendorBranches() {
    return useQuery({
        queryKey: ['vendor', 'branches'],
        queryFn: () => api.get('/vendor/branches'),
    });
}

export function useVendorBranch(branchId) {
    return useQuery({
        queryKey: ['vendor', 'branches', branchId],
        queryFn: () => api.get(`/vendor/branches/${branchId}`),
        enabled: Boolean(branchId),
    });
}

export function useCreateBranch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => api.post('/vendor/branches', formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'branches'] });
        },
    });
}

export function useUpdateBranch(branchId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => api.put(`/vendor/branches/${branchId}`, formData),
        onSuccess: (data) => {
            queryClient.setQueryData(['vendor', 'branches', branchId], data);
            queryClient.invalidateQueries({ queryKey: ['vendor', 'branches'] });
        },
    });
}

export function useVendorPromotions() {
    return useQuery({
        queryKey: ['vendor', 'promotions'],
        queryFn: () => api.get('/vendor/promotions'),
    });
}

export function useVendorPromotion(promotionId) {
    return useQuery({
        queryKey: ['vendor', 'promotions', promotionId],
        queryFn: () => api.get(`/vendor/promotions/${promotionId}`),
        enabled: Boolean(promotionId),
    });
}

export function useCreatePromotion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post('/vendor/promotions', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'promotions'] });
        },
    });
}

export function useUpdatePromotion(promotionId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.put(`/vendor/promotions/${promotionId}`, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'promotions'] });
        },
    });
}

export function useScanCustomer() {
    return useMutation({
        mutationFn: (code) => api.post('/vendor/scan', { code }),
    });
}

function invalidateAfterTransaction(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'activities'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'analytics'] });
}

export function useAddStamps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post('/vendor/transactions/stamps', payload),
        onSuccess: () => invalidateAfterTransaction(queryClient),
    });
}

export function useAddPoints() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post('/vendor/transactions/points', payload),
        onSuccess: () => invalidateAfterTransaction(queryClient),
    });
}

export function useDeductPoints() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post('/vendor/transactions/points/deduct', payload),
        onSuccess: () => invalidateAfterTransaction(queryClient),
    });
}

export function useRedeemCode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code) => api.post('/vendor/redemptions/redeem', { code }),
        onSuccess: () => invalidateAfterTransaction(queryClient),
    });
}

export function useVendorActivityLog(filters = {}) {
    return useQuery({
        queryKey: ['vendor', 'activities', filters],
        queryFn: () =>
            api.get('/vendor/activities', {
                params: {
                    type: filters.type && filters.type !== 'all' ? filters.type : undefined,
                    branch_id: filters.branchId || undefined,
                    date: filters.date || undefined,
                },
            }),
    });
}

export function useVendorAnalytics(days = 7) {
    return useQuery({
        queryKey: ['vendor', 'analytics', { days }],
        queryFn: () => api.get('/vendor/analytics', { params: { days } }),
    });
}
