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

  // useCrudFilters always populates sort_by/sort_dir with its own hardcoded
  // default, so this only takes effect for filter objects built without it.
  const effectiveFilters = defaultSort && !filters.sort_by
    ? { ...filters, sort_by: defaultSort.field, sort_dir: defaultSort.order }
    : filters;

  return useQuery({
    queryKey: [...queryKey, effectiveFilters],
    queryFn: () => service.getList(effectiveFilters),
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
};
