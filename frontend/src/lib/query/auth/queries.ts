import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { authKeys } from './keys';
import { User } from './types';

export const useUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get('/auth/me');
      return response.data.data; // Standard Laravel API resource response
    },
    retry: false, // Don't retry if unauthenticated
  });
};
