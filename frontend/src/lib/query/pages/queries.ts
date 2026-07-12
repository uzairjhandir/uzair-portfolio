import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { pagesKeys } from './keys';
import { PageRender } from './types';

export const usePageRenderQuery = (slug: string) => {
  return useQuery({
    queryKey: pagesKeys.render(slug),
    queryFn: async (): Promise<PageRender> => {
      // PageRenderResource is a JsonResource, which Laravel auto-wraps in
      // {data: {...}} — response.data is the envelope, response.data.data
      // is the actual {page, layout, blocks} payload.
      const response = await apiClient.get(`/public/pages/${slug}/render`);
      return response.data.data;
    },
    retry: false, // Don't retry 404s
  });
};
