export const downloadKeys = {
  all: ['downloads'] as const,
  lists: () => [...downloadKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...downloadKeys.lists(), filters] as const,
  details: () => [...downloadKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...downloadKeys.details(), id] as const,
};
