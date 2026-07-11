export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: ['dashboard', 'stats'] as const,
    recentActivity: ['dashboard', 'recentActivity'] as const,
  },
  homepage: {
    all: ['homepage'] as const,
    lists: () => ['homepage', 'list'] as const,
    list: (filters: string) => ['homepage', 'list', { filters }] as const,
    details: () => ['homepage', 'detail'] as const,
    detail: (id: number) => ['homepage', 'detail', id] as const,
  },
  blog: {
    all: ['blog'] as const,
    lists: () => ['blog', 'list'] as const,
    list: (filters: string) => ['blog', 'list', { filters }] as const,
    details: () => ['blog', 'detail'] as const,
    detail: (id: number) => ['blog', 'detail', id] as const,
  },
  portfolio: {
    all: ['portfolio'] as const,
    lists: () => ['portfolio', 'list'] as const,
    list: (filters: string) => ['portfolio', 'list', { filters }] as const,
    details: () => ['portfolio', 'detail'] as const,
    detail: (id: number) => ['portfolio', 'detail', id] as const,
  },
  media: {
    all: ['media'] as const,
    lists: () => ['media', 'list'] as const,
    list: (filters: string) => ['media', 'list', { filters }] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters: string) => ['users', 'list', { filters }] as const,
    details: () => ['users', 'detail'] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  crm: {
    all: ['crm'] as const,
    lists: () => ['crm', 'list'] as const,
    list: (filters: string) => ['crm', 'list', { filters }] as const,
  },
  newsletter: {
    all: ['newsletter'] as const,
    lists: () => ['newsletter', 'list'] as const,
    list: (filters: string) => ['newsletter', 'list', { filters }] as const,
  },
  dummy: {
    all: ['dummy'] as const,
    lists: () => ['dummy', 'list'] as const,
    list: (filters: string) => ['dummy', 'list', { filters }] as const,
    details: () => ['dummy', 'detail'] as const,
    detail: (id: number | string) => ['dummy', 'detail', id] as const,
  }
} as const;
