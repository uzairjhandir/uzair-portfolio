import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blogKeys } from './keys';

export interface BlogPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status?: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  featured_image_id?: string | null;
  publish_at?: string | null;
  seo?: {
    title?: string;
    description?: string;
    canonical_url?: string;
  };
  categories?: string[];
  tags?: string[];
}

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BlogPayload) => {
      const response = await apiClient.post('/blogs', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, data }: { uuid: string; data: Partial<BlogPayload> }) => {
      const response = await apiClient.put(`/blogs/${uuid}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await apiClient.delete(`/blogs/${uuid}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const usePublishBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/blogs/${uuid}/publish`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const useUnpublishBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/blogs/${uuid}/unpublish`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};

export const useDuplicateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await apiClient.post(`/blogs/${uuid}/duplicate`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
};
