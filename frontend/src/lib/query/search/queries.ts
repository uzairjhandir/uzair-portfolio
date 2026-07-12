import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { searchKeys } from './keys';

export interface SearchResultItem {
  uuid: string;
  type: string;
  module: string;
  locale: string;
  title: string;
  summary: string | null;
  url: string;
  image: string | null;
  boost: number;
  published_at: string | null;
  metadata: Record<string, unknown> | null;
}

export interface SearchResponse {
  query: string;
  data: SearchResultItem[];
  total: number;
  took: number;
  page: number;
  per_page: number;
  last_page: number;
  has_more: boolean;
  facets: Record<string, Record<string, number>>;
  suggestions: string[];
  capabilities: Record<string, unknown>;
}

export const useGlobalSearchQuery = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: [...searchKeys.query(query), page],
    queryFn: async (): Promise<SearchResponse> => {
      const response = await apiClient.get('/search', { params: { q: query, page } });
      return response.data;
    },
    enabled: query.length > 2,
  });
};

export interface SearchSuggestion {
  title: string;
  type: string;
  url: string;
  image: string | null;
}

export const useSearchSuggestQuery = (query: string) => {
  return useQuery({
    queryKey: [...searchKeys.all, 'suggest', query],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      const response = await apiClient.get('/search/suggest', { params: { q: query } });
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: query.length >= 2,
  });
};
