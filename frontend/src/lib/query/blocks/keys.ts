export const blocksKeys = {
  all: ['blocks'] as const,
  lists: () => [...blocksKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...blocksKeys.lists(), filters] as const,
  details: () => [...blocksKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...blocksKeys.details(), id] as const,
  types: () => [...blocksKeys.all, 'types'] as const,
};
