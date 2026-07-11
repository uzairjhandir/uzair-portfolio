import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const livechatKeys = {
  all: ['livechat'] as const,
  config: () => [...livechatKeys.all, 'config'] as const,
};

export const useLiveChatConfigQuery = () => {
  return useQuery({
    queryKey: livechatKeys.config(),
    queryFn: async () => {
      const response = await apiClient.get('/livechat/config').catch(() => {
        return { data: { enabled: false, provider: null } }; // Fallback
      });
      return response.data;
    },
  });
};
