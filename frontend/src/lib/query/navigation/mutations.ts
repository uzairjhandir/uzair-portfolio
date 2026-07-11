import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { navigationKeys } from './keys';
import { NavigationMenu } from './types';

export const useUpdateNavigationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<NavigationMenu> }) => {
      const response = await apiClient.put(`/navigation/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: navigationKeys.all });
    },
  });
};
