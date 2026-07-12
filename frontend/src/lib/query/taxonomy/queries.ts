import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Taxonomy, TaxonomyTerm } from './types';

export const useTaxonomiesQuery = () => {
  return useQuery({
    queryKey: ['taxonomies'],
    queryFn: async (): Promise<Taxonomy[]> => {
      const response = await apiClient.get('/taxonomies');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTaxonomyTermsQuery = (taxonomyUuid: string | undefined) => {
  return useQuery({
    queryKey: ['taxonomies', taxonomyUuid, 'terms'],
    queryFn: async (): Promise<TaxonomyTerm[]> => {
      const response = await apiClient.get(`/taxonomies/${taxonomyUuid}/terms`);
      return response.data;
    },
    enabled: !!taxonomyUuid,
  });
};
