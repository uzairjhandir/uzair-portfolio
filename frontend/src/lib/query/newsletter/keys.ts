export const newsletterKeys = {
  all: ['newsletter'] as const,
  subscribers: (filters: Record<string, string>) => [...newsletterKeys.all, 'subscribers', filters] as const,
  campaigns: (filters: Record<string, string>) => [...newsletterKeys.all, 'campaigns', filters] as const,
  lists: () => [...newsletterKeys.all, 'lists'] as const,
};
