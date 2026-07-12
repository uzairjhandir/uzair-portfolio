import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface WorkflowPayload {
  name: string;
  description?: string;
  is_active?: boolean;
}

export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WorkflowPayload) => {
      const response = await apiClient.post('/automation/workflows', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automation', 'workflows'] }),
  });
};

export const useUpdateWorkflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<WorkflowPayload> }) => {
      const response = await apiClient.put(`/automation/workflows/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automation', 'workflows'] }),
  });
};

export const useDeleteWorkflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/automation/workflows/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['automation', 'workflows'] }),
  });
};

export const usePublishVersionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, definition }: { uuid: string; definition: Record<string, unknown> }) => {
      const response = await apiClient.post(`/automation/workflows/${uuid}/versions`, { definition });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['automation', 'workflows', variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ['automation', 'workflows', variables.uuid, 'versions'] });
    },
  });
};
