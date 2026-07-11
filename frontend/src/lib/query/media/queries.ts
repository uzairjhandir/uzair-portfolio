import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { mediaKeys } from './keys';
import { Media } from './types';

export const useMediaQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: mediaKeys.list(filters || {}),
    queryFn: async (): Promise<{ data: Media[], meta: any }> => {
      const response = await apiClient.get('/media', { params: filters });
      return response.data;
    },
  });
};
