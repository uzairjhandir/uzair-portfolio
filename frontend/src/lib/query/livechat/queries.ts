import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const livechatKeys = {
  all: ['livechat'] as const,
  config: () => [...livechatKeys.all, 'config'] as const,
};

export interface LiveChatDriverConfig {
  provider: 'tawk.to' | 'crisp' | 'none';
  propertyId?: string | null;
  widgetId?: string | null;
  websiteId?: string | null;
  position?: string;
  mobile_enabled?: boolean;
}

export interface LiveChatConfigResponse {
  enabled: boolean;
  config: LiveChatDriverConfig;
}

export const useLiveChatConfigQuery = () => {
  return useQuery({
    queryKey: livechatKeys.config(),
    queryFn: async (): Promise<LiveChatConfigResponse> => {
      const response = await apiClient.get('/livechat/config').catch(() => {
        return { data: { enabled: false, config: { provider: 'none' as const } } };
      });
      return response.data;
    },
  });
};
