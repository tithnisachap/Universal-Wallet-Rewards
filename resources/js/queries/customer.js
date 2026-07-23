import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

export function useCustomerProfile() {
    return useQuery({
        queryKey: ['customer', 'profile'],
        queryFn: () => api.get('/customer/profile'),
    });
}

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.put('/customer/profile', payload),
        onSuccess: (data) => {
            queryClient.setQueryData(['customer', 'profile'], data);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useVendorDirectory(search = '') {
    return useQuery({
        queryKey: ['customer', 'vendors', { search }],
        queryFn: () => api.get('/customer/vendors', { params: { search: search || undefined } }),
        placeholderData: (previous) => previous,
    });
}

export function useVendorDetail(vendorId) {
    return useQuery({
        queryKey: ['customer', 'vendors', vendorId],
        queryFn: () => api.get(`/customer/vendors/${vendorId}`),
        enabled: Boolean(vendorId),
    });
}

export function useVendorBranchesForCustomer(vendorId) {
    return useQuery({
        queryKey: ['customer', 'vendors', vendorId, 'branches'],
        queryFn: () => api.get(`/customer/vendors/${vendorId}/branches`),
        enabled: Boolean(vendorId),
    });
}

export function useVendorLoyalty(vendorId) {
    return useQuery({
        queryKey: ['customer', 'vendors', vendorId, 'loyalty'],
        queryFn: () => api.get(`/customer/vendors/${vendorId}/loyalty`),
        enabled: Boolean(vendorId),
    });
}

export function useVendorActivities(vendorId) {
    return useQuery({
        queryKey: ['customer', 'vendors', vendorId, 'activities'],
        queryFn: () => api.get(`/customer/vendors/${vendorId}/activities`),
        enabled: Boolean(vendorId),
    });
}

export function useClaimReward(vendorId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.post(`/customer/vendors/${vendorId}/redemptions`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer', 'vendors', vendorId, 'loyalty'] });
        },
    });
}

export function useNearbyBranches({ lat, lng, category, radiusKm } = {}) {
    return useQuery({
        queryKey: ['customer', 'branches', 'nearby', { lat, lng, category, radiusKm }],
        queryFn: () =>
            api.get('/customer/branches/nearby', {
                params: { lat, lng, category: category || undefined, radius_km: radiusKm || undefined },
            }),
        enabled: Boolean(lat) && Boolean(lng),
    });
}

export function useQrCode() {
    return useQuery({
        queryKey: ['customer', 'qr-code'],
        queryFn: () => api.get('/customer/qr-code'),
    });
}
