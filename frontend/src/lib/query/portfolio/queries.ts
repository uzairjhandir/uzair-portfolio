import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { portfolioKeys } from './keys';
import { PortfolioProject, PortfolioListResponse, PortfolioFilters } from './types';

export const usePortfolioListQuery = (filters: PortfolioFilters = {}) => {
  return useQuery({
    queryKey: portfolioKeys.list(filters),
    queryFn: async (): Promise<PortfolioListResponse> => {
      const response = await apiClient.get('/portfolios', { params: filters });
      return response.data;
    },
  });
};

export const usePortfolioDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: portfolioKeys.detail(uuid),
    queryFn: async (): Promise<PortfolioProject> => {
      const response = await apiClient.get(`/portfolios/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
};
