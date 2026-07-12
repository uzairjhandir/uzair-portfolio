import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { mediaKeys } from './keys';
import { Media, MediaUploadResponse } from './types';

export const useUploadMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folderUuid }: { file: File; folderUuid?: string }): Promise<MediaUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      if (folderUuid) formData.append('folder_uuid', folderUuid);

      const response = await apiClient.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useUpdateMediaMetadataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<Media> }) => {
      const response = await apiClient.put(`/media/${uuid}/metadata`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useReplaceMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uuid, file }: { uuid: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(`/media/${uuid}/replace`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/media/${uuid}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};

export const useRestoreMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/media/${uuid}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
};
