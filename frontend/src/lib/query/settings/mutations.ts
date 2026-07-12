import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { settingsKeys } from './keys';

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Record<string, unknown>) => {
      const response = await apiClient.put('/settings', { settings });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() });
    },
  });
};

export interface SmtpTestResult {
  success: boolean;
  message: string;
}

export const useTestEmailConnectionMutation = () => {
  return useMutation({
    mutationFn: async (): Promise<SmtpTestResult> => {
      try {
        const response = await apiClient.post('/settings/email/test-connection', {});
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: SmtpTestResult } };
        if (axiosErr.response?.data) return axiosErr.response.data;
        throw err;
      }
    },
  });
};

export const useTestEmailSendMutation = () => {
  return useMutation({
    mutationFn: async (to: string): Promise<SmtpTestResult> => {
      try {
        const response = await apiClient.post('/settings/email/test-send', { to });
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: SmtpTestResult } };
        if (axiosErr.response?.data) return axiosErr.response.data;
        throw err;
      }
    },
  });
};
