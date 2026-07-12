import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface SearchHealth {
  driver: string;
  driver_version: string | null;
  index_version: number;
  schema_version: number;
  indexed_documents: number;
  pending_documents: number;
  failed_documents: number;
  queue_backlog: number;
  last_rebuild: string | null;
  last_successful_index: string | null;
  last_failed_index: string | null;
  average_query_time_ms: number;
  capabilities: Record<string, boolean>;
}

const searchAdminKeys = {
  health: ['search-admin', 'health'] as const,
};

export const useSearchHealthQuery = () => {
  return useQuery({
    queryKey: searchAdminKeys.health,
    queryFn: async (): Promise<SearchHealth> => {
      const response = await apiClient.get('/admin/search/health');
      return response.data;
    },
    refetchInterval: 10000,
  });
};

export const useRebuildSearchIndexMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type?: string) => {
      const response = await apiClient.post('/search/rebuild', type ? { type } : {});
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: searchAdminKeys.health }),
  });
};

export const useFlushSearchIndexMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type?: string) => {
      const response = await apiClient.delete('/search/index', { params: type ? { type } : {} });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: searchAdminKeys.health }),
  });
};
