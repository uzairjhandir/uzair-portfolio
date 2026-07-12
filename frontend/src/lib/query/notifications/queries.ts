import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { notificationKeys } from './keys';
import { NotificationLogListResponse } from './types';

/** Reuses the real GET /admin/notifications endpoint (delivery log viewer). */
export const useNotificationLogQuery = (filters: { status?: string; channel?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: ['notifications', 'logs', filters],
    queryFn: async (): Promise<NotificationLogListResponse> => {
      const response = await apiClient.get('/admin/notifications', { params: filters });
      return response.data;
    },
  });
};

export const useUnreadNotificationsQuery = () => {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await apiClient.get('/notifications/unread').catch(() => {
        return { data: { count: 0, items: [] } }; // Fallback
      });
      return response.data;
    },
  });
};
