export const navigationKeys = {
  all: ['navigation'] as const,
  lists: () => [...navigationKeys.all, 'list'] as const,
  list: (location: string) => [...navigationKeys.lists(), { location }] as const,
};
