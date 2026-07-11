import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { portfolioKeys } from './keys';
import { PortfolioProject } from './types';

export const usePortfolioListQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: portfolioKeys.list(filters || {}),
    queryFn: async (): Promise<{ data: PortfolioProject[], meta: any }> => {
      const response = await apiClient.get('/portfolios', { params: filters });
      return response.data;
    },
  });
};

export const usePortfolioDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: portfolioKeys.detail(slug),
    queryFn: async (): Promise<PortfolioProject> => {
      const response = await apiClient.get(`/portfolios/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};
