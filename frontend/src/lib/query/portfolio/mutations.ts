import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { portfolioKeys } from './keys';

export interface PortfolioPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status?: string;
  client_name?: string;
  project_url?: string;
  repository_url?: string;
  completion_date?: string | null;
  featured_image_id?: string | null;
  gallery?: string[];
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
  };
  categories?: string[];
  technologies?: string[];
}

export const useCreatePortfolioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PortfolioPayload) => {
      const response = await apiClient.post('/portfolios', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
};

export const useUpdatePortfolioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<PortfolioPayload> }) => {
      const response = await apiClient.put(`/portfolios/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
};

export const useDeletePortfolioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/portfolios/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
};

export const useDuplicatePortfolioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/portfolios/${uuid}/duplicate`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
};
