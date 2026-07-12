import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { authKeys } from './keys';
import { User } from './types';

export const useUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get('/auth/me');
      const { user, roles, permissions } = response.data.data;
      return { ...user, roles, permissions };
    },
    retry: false, // Don't retry if unauthenticated
    refetchOnMount: false, // Prevents infinite loop when children mount
    refetchOnWindowFocus: false,
  });
};
