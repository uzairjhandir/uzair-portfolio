import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGenericService } from '../../api/services/genericService';
import { toast } from 'sonner';

import { ResourceKey } from '../../api/resources';

interface UseBulkActionsOptions {
  queryKey: readonly unknown[];
  resourceKey: ResourceKey;
}

export const useBulkActions = <T>({ queryKey, resourceKey }: UseBulkActionsOptions) => {
  const queryClient = useQueryClient();
  const service = createGenericService<T>(resourceKey);

  const bulkMutation = useMutation({
    mutationFn: ({ action, ids }: { action: string; ids: (string | number)[] }) => 
      service.bulkAction(action, ids),
    onSuccess: (data, variables) => {
      toast.success(`Bulk ${variables.action} executed successfully`);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bulk action failed');
    },
  });

  return {
    bulkAction: bulkMutation.mutateAsync,
    isExecuting: bulkMutation.isPending,
  };
};
