import { useQuery } from '@tanstack/react-query';
import { createGenericService } from '../../api/services/genericService';
import type { CrudFilters } from './useCrudFilters';
import { ResourceKey } from '../../api/resources';

interface UseCrudListOptions {
  queryKey: readonly unknown[];
  resourceKey: ResourceKey;
  filters: CrudFilters;
  defaultSort?: { field: string; order: 'asc' | 'desc' };
  enabled?: boolean;
}

export const useCrudList = <T>({ queryKey, resourceKey, filters, defaultSort, enabled = true }: UseCrudListOptions) => {
  const service = createGenericService<T>(resourceKey);

  return useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => service.getList(filters),
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
};
