import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface HealthCheckResultDto {
  name: string;
  label: string;
  group: string;
  status: 'ok' | 'warning' | 'critical' | 'unknown';
  status_label: string;
  color: string;
  message: string;
  duration_ms: number;
  metadata: Record<string, unknown>;
}

export interface HealthReportDto {
  score: number;
  status: 'ok' | 'warning' | 'critical' | 'unknown';
  label: string;
  color: string;
  total: number;
  passing: number;
  warnings: number;
  critical: number;
  unknown: number;
  groups: Record<string, HealthCheckResultDto[]>;
  checks: HealthCheckResultDto[];
}

export const useSystemHealthQuery = () => {
  return useQuery({
    queryKey: ['system-health', 'details'],
    queryFn: async (): Promise<HealthReportDto> => {
      const response = await apiClient.get('/health/details');
      return response.data;
    },
    refetchInterval: 15000,
  });
};
