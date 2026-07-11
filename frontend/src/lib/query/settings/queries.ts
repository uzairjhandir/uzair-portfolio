import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { settingsKeys } from './keys';
import { Setting } from './types';

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: settingsKeys.lists(),
    queryFn: async (): Promise<Setting[]> => {
      const response = await apiClient.get('/settings');
      return response.data.data; 
    },
  });
};
