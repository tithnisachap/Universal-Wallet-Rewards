import axios from 'axios';

const TOKEN_KEY = 'uw_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Laravel doesn't parse multipart bodies on PUT/PATCH requests, so
    // FormData updates go out as POST with a spoofed _method field instead.
    if (config.data instanceof FormData && ['put', 'patch'].includes(config.method)) {
        config.data.append('_method', config.method.toUpperCase());
        config.method = 'post';
    }

    return config;
});

/**
 * Normalizes an Axios/Laravel error into { message, errors, status }.
 * `errors` is the field => [messages] map from a 422 validation response,
 * or null for anything else (401/403/404/500/network failure).
 */
export function normalizeError(error) {
    const status = error.response?.status ?? null;
    const body = error.response?.data;

    return {
        status,
        message: body?.message || error.message || 'Something went wrong.',
        errors: status === 422 ? (body?.errors ?? null) : null,
    };
}

/**
 * Thin wrappers around apiClient that always throw the normalized error
 * shape, and always return `response.data.data` (every endpoint in this
 * API wraps its payload in a `data` envelope). Used by every query/mutation
 * hook so error handling is identical everywhere.
 */
async function unwrap(promise) {
    try {
        const { data } = await promise;
        return data.data;
    } catch (error) {
        throw normalizeError(error);
    }
}

export const api = {
    get: (url, config) => unwrap(apiClient.get(url, config)),
    post: (url, body, config) => unwrap(apiClient.post(url, body, config)),
    put: (url, body, config) => unwrap(apiClient.put(url, body, config)),
    delete: (url, config) => unwrap(apiClient.delete(url, config)),
};

/**
 * Like api.get, but keeps Laravel's pagination meta (current_page,
 * last_page, total, ...) alongside the data array instead of discarding
 * it — needed anywhere the UI shows real page controls, not just a list.
 */
export async function getPaginated(url, config) {
    try {
        const { data } = await apiClient.get(url, config);
        return { data: data.data, meta: data.meta };
    } catch (error) {
        throw normalizeError(error);
    }
}

export default apiClient;
