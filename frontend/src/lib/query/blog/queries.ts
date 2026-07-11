import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blogKeys } from './keys';
import { BlogPost } from './types';

export const useBlogListQuery = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: blogKeys.list(filters || {}),
    queryFn: async (): Promise<{ data: BlogPost[], meta: any }> => {
      const response = await apiClient.get('/blogs', { params: filters });
      return response.data;
    },
  });
};

export const useBlogDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async (): Promise<BlogPost> => {
      const response = await apiClient.get(`/blogs/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};
