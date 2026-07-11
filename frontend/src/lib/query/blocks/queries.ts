import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blocksKeys } from './keys';
import { ContentBlock } from './types';

export const useBlocksQuery = () => {
  return useQuery({
    queryKey: blocksKeys.lists(),
    queryFn: async (): Promise<ContentBlock[]> => {
      const response = await apiClient.get(`/blocks`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // Blocks rarely change
  });
};
