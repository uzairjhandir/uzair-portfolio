import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { settingsKeys } from './keys';
import { Setting } from './types';

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Setting>[]) => {
      // Backend bulk update or single update depending on API
      const response = await apiClient.post('/settings/bulk', { settings: data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() });
    },
  });
};
