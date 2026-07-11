import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { notificationKeys } from './keys';

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
