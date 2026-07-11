import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/analytics/overview').catch(() => {
        return { data: { data: {} } }; // Fallback
      });
      return response.data?.data || response.data || {};
    },
  });
};
