import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blocksKeys } from './keys';
import { BlockContent, ContentBlock } from './types';

export const useCreateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      block_type_uuid: string;
      name?: string;
      status?: string;
      content: BlockContent;
    }) => {
      const response = await apiClient.post('/blocks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksKeys.all });
    },
  });
};

export const useUpdateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Pick<ContentBlock, 'name' | 'status' | 'variant' | 'content' | 'settings'>> }) => {
      const response = await apiClient.put(`/blocks/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksKeys.all });
    },
  });
};

export const useDeleteBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/blocks/${uuid}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksKeys.all });
    },
  });
};

export const useDuplicateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/blocks/${uuid}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blocksKeys.all });
    },
  });
};
