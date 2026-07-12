import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { TaxonomyTerm } from './types';

export const useCreateTaxonomyTermMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taxonomyUuid, name, slug }: { taxonomyUuid: string; name: string; slug: string }): Promise<TaxonomyTerm> => {
      const response = await apiClient.post(`/taxonomies/${taxonomyUuid}/terms`, { name, slug });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taxonomies', variables.taxonomyUuid, 'terms'] });
    },
  });
};
