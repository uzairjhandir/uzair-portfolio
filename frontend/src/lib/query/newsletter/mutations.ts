import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { newsletterKeys } from './keys';

export const useSubscribeNewsletterMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/newsletter/subscribe', { email });
      return response.data;
    },
  });
};

export const useDeleteSubscriberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/admin/newsletter/subscribers/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};

export interface CampaignPayload {
  name: string;
  subject: string;
  html_body: string;
  plain_body?: string;
  preview_text?: string;
  from_name?: string;
  from_email?: string;
  lists: string[];
  scheduled_at?: string | null;
}

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CampaignPayload) => {
      const response = await apiClient.post('/admin/newsletter/campaigns', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};

export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<CampaignPayload> }) => {
      const response = await apiClient.put(`/admin/newsletter/campaigns/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/admin/newsletter/campaigns/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};

export const useCreateNewsletterListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; slug: string; description?: string; is_public?: boolean; is_default?: boolean }) => {
      const response = await apiClient.post('/admin/newsletter/lists', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};

export const useDeleteNewsletterListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/admin/newsletter/lists/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsletterKeys.all }),
  });
};
