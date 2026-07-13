import axios from 'axios';
import { toast } from 'sonner';

// API Base URL (defaults to Laravel backend)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  // Bearer token only — no cookies/sessions
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

/**
 * Response Interceptor: global handling for error classes that individual
 * callers rarely check for explicitly (auth redirects, permission denial,
 * rate limiting, network/timeout failures, server errors). Deliberately
 * does NOT toast on 404/409/422 — those are typically meaningful in
 * context (e.g. a form's own validation display, an isError branch that
 * renders "not found"), and a blanket toast here would double up with
 * whatever the caller already shows via getErrorMessage().
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // No response at all: network offline, DNS failure, CORS, or timeout
    // (axios sets error.code === 'ECONNABORTED' for our 30s timeout above).
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else if (!navigator.onLine) {
        toast.error('You appear to be offline. Check your connection.');
      } else {
        toast.error('Network error — could not reach the server.');
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const path = window.location.pathname;
    const isAdminRoute = path.startsWith('/admin') || path.startsWith('/dashboard') || path.startsWith('/secure-admin');

    if (status === 401) {
      // 401 Unauthorized globally throws users out of the admin panel
      if (isAdminRoute && !path.includes('/login')) {
        window.location.href = '/admin/login';
      }
    } else if (status === 403) {
      toast.error('You don\'t have permission to do that.');
    } else if (status === 429) {
      toast.error('Too many requests — please slow down and try again.');
    } else if (status >= 500) {
      toast.error('Server error — please try again shortly.');
    }

    return Promise.reject(error);
  }
);
