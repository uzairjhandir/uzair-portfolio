import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { mediaKeys } from './keys';
import { Media, MediaFolder } from './types';

export const useMediaQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: mediaKeys.list(filters || {}),
    queryFn: async (): Promise<{ data: Media[], meta: any }> => {
      const response = await apiClient.get('/media', { params: filters });
      return response.data;
    },
  });
};

export const useMediaFoldersQuery = () => {
  return useQuery({
    queryKey: mediaKeys.folders(),
    queryFn: async (): Promise<MediaFolder[]> => {
      const response = await apiClient.get('/media-folders');
      return response.data.data;
    },
  });
};
