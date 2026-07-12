import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { crmKeys } from './keys';

export interface ContactCreatePayload {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  message?: string;
  source?: string;
}

export interface ContactUpdatePayload {
  status?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  /** The assignee's UUID (see GET /users' UserResource.id) — resolved to the internal integer FK server-side. */
  assigned_to?: string | null;
  company?: string;
  job_title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
}

export const useCreateContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContactCreatePayload) => {
      const response = await apiClient.post('/crm/contacts', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmKeys.contacts() }),
  });
};

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: ContactUpdatePayload }) => {
      const response = await apiClient.put(`/crm/contacts/${uuid}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: crmKeys.detail(variables.uuid) });
    },
  });
};

export const useDeleteContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/crm/contacts/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: crmKeys.contacts() }),
  });
};

export interface PublicContactFormInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  project: string;
  budget: string;
  timeline: string;
  message: string;
}

/** Reuses the real public contact endpoint (POST /contact -> ContactController@publicSubmit). */
export const useSubmitContactFormMutation = () => {
  return useMutation({
    mutationFn: async (data: PublicContactFormInput) => {
      const response = await apiClient.post('/contact', {
        first_name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        subject: data.project,
        message: `Project: ${data.project}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\n${data.message}`,
      });
      return response.data;
    },
  });
};

export const useAddActivityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, type, body }: { uuid: string; type: string; body: string }) => {
      const response = await apiClient.post(`/crm/contacts/${uuid}/activities`, { type, body });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: crmKeys.activities(variables.uuid) });
      queryClient.invalidateQueries({ queryKey: crmKeys.detail(variables.uuid) });
    },
  });
};
