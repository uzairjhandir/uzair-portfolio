import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { pagesKeys } from './keys';

// The admin CRUD handles basic operations via genericService.
// This file is for specific actions like publishing or duplicating.

export const usePublishPageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await apiClient.post(`/pages/${id}/publish`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
    },
  });
};
