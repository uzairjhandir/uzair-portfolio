import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blogKeys } from './keys';
import { BlogPost, BlogListResponse, BlogFilters } from './types';

export const useBlogListQuery = (filters: BlogFilters = {}) => {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: async (): Promise<BlogListResponse> => {
      const response = await apiClient.get('/blogs', { params: filters });
      return response.data;
    },
  });
};

export const useBlogDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: blogKeys.detail(uuid),
    queryFn: async (): Promise<BlogPost> => {
      const response = await apiClient.get(`/blogs/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
};
