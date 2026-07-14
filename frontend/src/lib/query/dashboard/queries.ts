import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  widgets: () => [...dashboardKeys.all, 'widgets'] as const,
};

export interface DashboardKpis {
  content: { published: number; draft: number; scheduled: number; total: number };
  users: { total: number; active_sessions: number };
  crm: { new_leads: number };
  newsletter: { subscribers: number };
  downloads_30d: number;
  storage_gb: number;
  search_index_size: number;
}

export interface DashboardActivityEntry {
  id: number;
  action: string;
  subject_type: string;
  subject_id: number;
  subject_label: string | null;
  actor: string | null;
  log_name: string;
  at: string;
}

export interface DashboardSystemHealth {
  score: number;
  status: 'ok' | 'warning' | 'critical' | 'unknown';
  label: string;
  color: string;
  total: number;
  passing: number;
  warnings: number;
  critical: number;
  unknown: number;
}

export interface DashboardStorage {
  breakdown: Record<string, { bytes: number; mb: number; gb: number; label: string }>;
  total: { bytes: number; mb: number; gb: number; label: string };
  media_files: number;
}

export interface DashboardWidgets {
  kpis?: DashboardKpis;
  activity?: { entries: DashboardActivityEntry[]; total: number };
  system_health?: DashboardSystemHealth;
  storage?: DashboardStorage;
}

/**
 * GET /admin/dashboard resolves every registered dashboard widget the
 * current user is authorized for (RBAC-filtered server-side), keyed by
 * widget key. Widgets the user lacks permission for are simply absent
 * from the payload — callers must treat each key as optional.
 */
export const useDashboardWidgetsQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.widgets(),
    queryFn: async (): Promise<DashboardWidgets> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};
