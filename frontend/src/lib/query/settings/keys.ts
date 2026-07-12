export const settingsKeys = {
  all: ['settings'] as const,
  lists: () => [...settingsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...settingsKeys.lists(), filters] as const,
  details: () => [...settingsKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...settingsKeys.details(), id] as const,
};
