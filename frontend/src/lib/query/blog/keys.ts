import { BlogFilters } from './types';

export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: BlogFilters) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...blogKeys.details(), uuid] as const,
};
