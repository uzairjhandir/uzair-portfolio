import { CrmContactFilters } from './types';

export const crmKeys = {
  all: ['crm'] as const,
  contacts: () => [...crmKeys.all, 'contacts'] as const,
  list: (filters: CrmContactFilters) => [...crmKeys.contacts(), 'list', filters] as const,
  detail: (uuid: string) => [...crmKeys.contacts(), 'detail', uuid] as const,
  activities: (uuid: string) => [...crmKeys.contacts(), uuid, 'activities'] as const,
};
