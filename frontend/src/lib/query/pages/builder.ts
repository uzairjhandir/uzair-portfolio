import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { pagesKeys } from './keys';

export interface AdminPage {
  uuid: string;
  title: string;
  slug: string;
  status: string;
  template: string | null;
}

/**
 * Homepage CMS is built through the existing Page Builder chain
 * (Pages -> PageBlocks -> Blocks -> BlockTypes), not a dedicated
 * "homepage" endpoint. This resolves the seeded slug="home" Page record.
 */
export const useHomePageQuery = () => {
  return useQuery({
    queryKey: pagesKeys.list({ search: 'home' }),
    queryFn: async (): Promise<AdminPage | null> => {
      const response = await apiClient.get('/pages', { params: { search: 'home', per_page: 50 } });
      const pages: AdminPage[] = response.data.data;
      return pages.find((p) => p.slug === 'home') ?? null;
    },
  });
};

export const useSyncPageBuilderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pageUuid,
      blocks,
    }: {
      pageUuid: string;
      blocks: { uuid: string }[];
    }) => {
      const response = await apiClient.post(`/pages/${pageUuid}/builder/sync`, { blocks });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
    },
  });
};

export const usePublishPageBuilderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pageUuid, status }: { pageUuid: string; status: string }) => {
      const response = await apiClient.post(`/pages/${pageUuid}/builder/publish`, {
        status,
        publish_at: null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
    },
  });
};
