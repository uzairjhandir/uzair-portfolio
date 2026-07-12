import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { crmKeys } from './keys';
import { CrmContact, CrmContactListResponse, CrmContactFilters, CrmActivity } from './types';

export const useContactListQuery = (filters: CrmContactFilters = {}) => {
  return useQuery({
    queryKey: crmKeys.list(filters),
    queryFn: async (): Promise<CrmContactListResponse> => {
      const response = await apiClient.get('/crm/contacts', { params: filters });
      return response.data;
    },
  });
};

export const useContactDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: crmKeys.detail(uuid),
    queryFn: async (): Promise<CrmContact> => {
      const response = await apiClient.get(`/crm/contacts/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
};

export const useContactActivitiesQuery = (uuid: string) => {
  return useQuery({
    queryKey: crmKeys.activities(uuid),
    queryFn: async (): Promise<CrmActivity[]> => {
      const response = await apiClient.get(`/crm/contacts/${uuid}/activities`);
      return response.data;
    },
    enabled: !!uuid,
  });
};
