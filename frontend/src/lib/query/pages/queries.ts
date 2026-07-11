import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { pagesKeys } from './keys';
import { Page } from './types';

export const usePageRenderQuery = (slug: string) => {
  return useQuery({
    queryKey: pagesKeys.render(slug),
    queryFn: async (): Promise<Page> => {
      const response = await apiClient.get(`/pages/render`, { params: { slug } });
      return response.data.data;
    },
    retry: false, // Don't retry 404s
  });
};
