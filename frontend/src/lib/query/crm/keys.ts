export const crmKeys = {
  all: ['crm'] as const,
  leads: () => [...crmKeys.all, 'leads'] as const,
};
