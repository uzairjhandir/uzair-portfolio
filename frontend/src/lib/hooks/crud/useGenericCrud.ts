import { useCrudList } from './useCrudList';
import { useCrudMutations } from './useCrudMutations';
import { useBulkActions } from './useBulkActions';
import { useCrudFilters, type CrudFilters } from './useCrudFilters';
import { ResourceKey } from '../../api/resources';

export interface UseGenericCrudOptions {
  resourceKey: ResourceKey;
  queryKey?: readonly unknown[];
  defaultSort?: { field: string; order: 'asc' | 'desc' };
  initialFilters?: Partial<CrudFilters>;
}

export const useGenericCrud = <T extends { id: string | number }>({ 
  resourceKey,
  queryKey: customQueryKey,
  defaultSort,
  initialFilters 
}: UseGenericCrudOptions) => {
  const queryKey = customQueryKey || [resourceKey];
  
  const { filters, updateFilter, resetFilters, setFilters } = useCrudFilters(initialFilters);
  
  const { 
    data: listData, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useCrudList<T>({ queryKey, resourceKey, filters, defaultSort });

  const { 
    create, 
    isCreating, 
    update, 
    isUpdating, 
    deleteRecord, 
    isDeleting 
  } = useCrudMutations<T>({ queryKey, resourceKey });

  const { 
    bulkAction, 
    isExecuting 
  } = useBulkActions<T>({ queryKey, resourceKey });

  return {
    // List & Pagination State
    filters,
    updateFilter,
    resetFilters,
    setFilters,
    
    // Data
    data: listData?.data || [],
    meta: listData?.meta,
    isLoading,
    isError,
    error,
    refetch,

    // Mutations
    create,
    isCreating,
    update,
    isUpdating,
    deleteRecord,
    isDeleting,

    // Bulk
    bulkAction,
    isBulkExecuting: isExecuting,
  };
};
