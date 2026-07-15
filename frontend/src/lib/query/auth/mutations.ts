import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { authKeys } from './keys';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      // Bearer-only: no CSRF cookie needed
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage for Bearer auth
      const token = data?.data?.token;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      // Invalidate user query so /auth/me is re-fetched with the new token
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      queryClient.clear();
      window.location.href = '/admin/login';
    },
  });
};
