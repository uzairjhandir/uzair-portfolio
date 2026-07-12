export interface WorkflowVersion {
  id: number;
  workflow_id: number;
  version: number;
  definition: Record<string, unknown>;
  published_by: string | null;
  published_at: string;
}

export interface Workflow {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  is_active: boolean;
  runs_count: number;
  latest_version: WorkflowVersion | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowListResponse {
  data: Workflow[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface WorkflowRun {
  id: number;
  uuid: string;
  workflow_id: number;
  version_id: number;
  status: string;
  context: Record<string, unknown> | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface WorkflowRunListResponse {
  data: WorkflowRun[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface ActionResult {
  id: number;
  run_id: number;
  node_id: string;
  action_type: string;
  status: string;
  output: Record<string, unknown> | null;
  exception: string | null;
  duration_ms: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface AutomationLog {
  id: number;
  run_id: number | null;
  level: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface RunDetail {
  run: WorkflowRun;
  action_results: ActionResult[];
  logs: AutomationLog[];
}
