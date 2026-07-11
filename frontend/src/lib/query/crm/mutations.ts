import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface CRMLeadInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  project: string;
  budget: string;
  timeline: string;
  message: string;
  honey?: string;
}

export const useCreateLeadMutation = () => {
  return useMutation({
    mutationFn: async (data: CRMLeadInput) => {
      const response = await apiClient.post('/crm/leads', data);
      return response.data;
    },
  });
};
