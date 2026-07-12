import { DownloadFilters } from './types';

export const downloadKeys = {
  all: ['downloads'] as const,
  lists: () => [...downloadKeys.all, 'list'] as const,
  list: (filters: DownloadFilters) => [...downloadKeys.lists(), filters] as const,
  details: () => [...downloadKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...downloadKeys.details(), uuid] as const,
};
