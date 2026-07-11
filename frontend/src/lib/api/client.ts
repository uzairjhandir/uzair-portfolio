import axios from 'axios';

// API Base URL (defaults to Laravel backend)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Crucial for Sanctum cookies (CSRF & Auth)
});

// Request Interceptor: Attach bearer token if local storage holds it
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized globally throws users out of the admin panel
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // We can emit an event or redirect to login
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
