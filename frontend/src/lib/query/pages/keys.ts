export const pagesKeys = {
  all: ['pages'] as const,
  lists: () => [...pagesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...pagesKeys.lists(), filters] as const,
  details: () => [...pagesKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...pagesKeys.details(), id] as const,
  render: (slug: string) => [...pagesKeys.all, 'render', slug] as const,
};
