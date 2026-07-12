import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGenericService } from '../../api/services/genericService';
import { toast } from 'sonner';

import { ResourceKey } from '../../api/resources';

interface UseCrudMutationsOptions {
  queryKey: readonly unknown[];
  resourceKey: ResourceKey;
}

export const useCrudMutations = <T extends { id: string | number }>({ queryKey, resourceKey }: UseCrudMutationsOptions) => {
  const queryClient = useQueryClient();
  const service = createGenericService<T>(resourceKey);

  interface MutationContext {
    previousData: unknown;
  }

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => service.create(data),
    onSuccess: () => {
      toast.success('Record created successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create record');
    },
  });

  const updateMutation = useMutation<{ data: T }, Error, { id: string | number; data: Partial<T> }, MutationContext>({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) => service.update(id, data),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value (if it's in a list)
      // Note: Full generic optimistic update is complex because of pagination,
      // but we can try to update the specific item if found in any paginated page.
      queryClient.setQueriesData({ queryKey }, (oldData: { data?: T[] } | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((item: T) => (item.id === variables.id ? { ...item, ...variables.data } : item)),
        };
      });

      // Return context with the snapshotted value
      return { previousData };
    },
    onError: (error: Error, variables, context) => {
      toast.error(error.message || 'Failed to update record');
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey }, context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate to ensure sync with server
      queryClient.invalidateQueries({ queryKey });
      toast.success('Record updated successfully');
    },
  });

  const deleteMutation = useMutation<void, Error, string | number, MutationContext>({
    mutationFn: (id) => service.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically remove
      queryClient.setQueriesData({ queryKey }, (oldData: { data?: T[] } | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((item: T) => item.id !== id),
        };
      });

      return { previousData };
    },
    onError: (error: Error, variables, context) => {
      toast.error(error.message || 'Failed to delete record');
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey }, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Record deleted successfully');
    },
  });

  return {
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRecord: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
