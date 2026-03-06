export const API_URL = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.PROD ? '' : 'http://localhost:3001');

export const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
