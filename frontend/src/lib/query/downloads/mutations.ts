import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { downloadKeys } from './keys';

export interface DownloadPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status?: string;
  latest_version?: string;
  media_id?: string | null;
  preview_media_id?: string | null;
  requires_email?: boolean;
  requires_accept_terms?: boolean;
  license_type?: string;
  access_level?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
  };
  categories?: string[];
}

export const useCreateDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DownloadPayload) => {
      const response = await apiClient.post('/downloads', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: downloadKeys.all }),
  });
};

export const useUpdateDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<DownloadPayload> }) => {
      const response = await apiClient.put(`/downloads/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: downloadKeys.all }),
  });
};

export const useDeleteDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/downloads/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: downloadKeys.all }),
  });
};

export const useDuplicateDownloadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/downloads/${uuid}/duplicate`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: downloadKeys.all }),
  });
};
