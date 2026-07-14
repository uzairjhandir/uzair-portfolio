import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blocksKeys } from './keys';
import { ContentBlock, BlockType } from './types';

export const useBlocksQuery = () => {
  return useQuery({
    queryKey: blocksKeys.lists(),
    queryFn: async (): Promise<ContentBlock[]> => {
      const response = await apiClient.get('/blocks', { params: { per_page: 100 } });
      return response.data.data;
    },
  });
};

export const useBlockTypesQuery = () => {
  return useQuery({
    queryKey: blocksKeys.types(),
    queryFn: async (): Promise<BlockType[]> => {
      const response = await apiClient.get('/block-types');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
