import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { downloadKeys } from './keys';
import { DownloadItem, DownloadListResponse, DownloadFilters } from './types';

export const useDownloadListQuery = (filters: DownloadFilters = {}) => {
  return useQuery({
    queryKey: downloadKeys.list(filters),
    queryFn: async (): Promise<DownloadListResponse> => {
      const response = await apiClient.get('/downloads', { params: filters });
      return response.data;
    },
  });
};

export const useDownloadDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: downloadKeys.detail(uuid),
    queryFn: async (): Promise<DownloadItem> => {
      const response = await apiClient.get(`/downloads/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
};
