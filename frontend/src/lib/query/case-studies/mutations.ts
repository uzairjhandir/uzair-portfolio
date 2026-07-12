import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { caseStudyKeys } from './keys';
import { OutcomeMetric } from './types';

export interface CaseStudyPayload {
  title: string;
  slug: string;
  excerpt?: string;
  status?: string;
  portfolio_uuid?: string | null;
  is_primary?: boolean;
  is_featured?: boolean;
  challenge?: string;
  solution?: string;
  implementation?: string;
  results?: string;
  customer_quote?: string;
  outcome_metrics?: OutcomeMetric[];
  duration_weeks?: number | null;
  team_size?: number | null;
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

export const useCreateCaseStudyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CaseStudyPayload) => {
      const response = await apiClient.post('/case-studies', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all }),
  });
};

export const useUpdateCaseStudyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<CaseStudyPayload> }) => {
      const response = await apiClient.put(`/case-studies/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all }),
  });
};

export const useDeleteCaseStudyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/case-studies/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all }),
  });
};

export const useDuplicateCaseStudyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/case-studies/${uuid}/duplicate`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all }),
  });
};
