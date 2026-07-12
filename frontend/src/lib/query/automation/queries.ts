import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { WorkflowListResponse, Workflow, WorkflowVersion, WorkflowRunListResponse, RunDetail } from './types';

export const useWorkflowListQuery = (filters: { search?: string; is_active?: boolean } = {}) => {
  return useQuery({
    queryKey: ['automation', 'workflows', filters],
    queryFn: async (): Promise<WorkflowListResponse> => {
      const response = await apiClient.get('/automation/workflows', { params: filters });
      return response.data;
    },
  });
};

export const useWorkflowDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['automation', 'workflows', uuid],
    queryFn: async (): Promise<Workflow> => {
      const response = await apiClient.get(`/automation/workflows/${uuid}`);
      return response.data;
    },
    enabled: !!uuid,
  });
};

export const useWorkflowVersionsQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['automation', 'workflows', uuid, 'versions'],
    queryFn: async (): Promise<WorkflowVersion[]> => {
      const response = await apiClient.get(`/automation/workflows/${uuid}/versions`);
      return response.data;
    },
    enabled: !!uuid,
  });
};

export const useWorkflowRunsQuery = (uuid: string) => {
  return useQuery({
    queryKey: ['automation', 'workflows', uuid, 'runs'],
    queryFn: async (): Promise<WorkflowRunListResponse> => {
      const response = await apiClient.get(`/automation/workflows/${uuid}/runs`);
      return response.data;
    },
    enabled: !!uuid,
  });
};

export const useRunDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['automation', 'runs', id],
    queryFn: async (): Promise<RunDetail> => {
      const response = await apiClient.get(`/automation/runs/${id}`);
      return response.data;
    },
    enabled: id !== null,
  });
};
