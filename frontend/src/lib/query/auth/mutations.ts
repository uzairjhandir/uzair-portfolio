import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { authKeys } from './keys';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      // CSRF cookie setup for Laravel Sanctum
      await apiClient.get('/sanctum/csrf-cookie', { baseURL: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:8000' });
      
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the user query to refetch the fresh user data
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
      queryClient.clear(); // Clear all queries to prevent data leaking
      window.location.href = '/admin/login';
    },
  });
};
