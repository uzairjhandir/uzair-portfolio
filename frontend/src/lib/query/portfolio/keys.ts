import { PortfolioFilters } from './types';

export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (filters: PortfolioFilters) => [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...portfolioKeys.details(), uuid] as const,
};
