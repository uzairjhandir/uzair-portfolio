import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { newsletterKeys } from './keys';
import { SubscriberListResponse, CampaignListResponse, NewsletterListRef } from './types';

export const useSubscriberListQuery = (filters: { status?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: newsletterKeys.subscribers(filters as Record<string, string>),
    queryFn: async (): Promise<SubscriberListResponse> => {
      const response = await apiClient.get('/admin/newsletter/subscribers', { params: filters });
      return response.data;
    },
  });
};

export const useCampaignListQuery = (filters: { status?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: newsletterKeys.campaigns(filters as Record<string, string>),
    queryFn: async (): Promise<CampaignListResponse> => {
      const response = await apiClient.get('/admin/newsletter/campaigns', { params: filters });
      return response.data;
    },
  });
};

export const useNewsletterListsQuery = () => {
  return useQuery({
    queryKey: newsletterKeys.lists(),
    queryFn: async (): Promise<NewsletterListRef[]> => {
      const response = await apiClient.get('/admin/newsletter/lists');
      return response.data;
    },
  });
};
