import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const useSubscribeNewsletterMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // In a real Laravel API, this could be /newsletter/subscribe or just POST /newsletter
      const response = await apiClient.post('/newsletter/subscribe', { email }).catch(() => {
        // Fallback to resource endpoint
        return apiClient.post('/newsletter', { email });
      });
      return response.data;
    },
  });
};
