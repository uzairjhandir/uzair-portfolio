export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const,
};
