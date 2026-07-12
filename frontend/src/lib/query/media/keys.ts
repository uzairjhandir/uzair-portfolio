export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...mediaKeys.lists(), filters] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...mediaKeys.details(), id] as const,
  folders: () => [...mediaKeys.all, 'folders'] as const,
};
