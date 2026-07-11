import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { searchKeys } from './keys';

export interface SearchResult {
  id: string | number;
  title: string;
  type: string;
  url: string;
  excerpt?: string;
}

export const useGlobalSearchQuery = (query: string) => {
  return useQuery({
    queryKey: searchKeys.query(query),
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query) return [];
      const response = await apiClient.get('/search', { params: { q: query } });
      // Depending on the API, it might be response.data.data or response.data
      return response.data.data || response.data || [];
    },
    enabled: query.length > 2, // Only search if more than 2 chars
  });
};
