export interface CrmUserRef {
  uuid: string;
  name: string;
}

export interface CrmPipelineStageRef {
  uuid: string;
  name: string;
  color: string | null;
  is_won: boolean;
  is_lost: boolean;
}

export interface CrmContact {
  uuid: string;
  full_name: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  website: string | null;
  status: string | null;
  source: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  message: string | null;
  gdpr_consented: boolean;
  assigned_to: CrmUserRef | null;
  pipeline_stage: CrmPipelineStageRef | null;
  activities_count: number;
  last_contacted_at: string | null;
  created_at: string;
}

export interface CrmActivity {
  id: number;
  uuid: string;
  contact_id: number;
  performed_by: number | null;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'sms' | 'whatsapp' | 'reminder' | 'status_change' | 'assignment' | 'stage_change';
  source: string;
  subject: string | null;
  body: string;
  performed_at: string;
  is_pinned: boolean;
  created_at: string;
}

export interface CrmContactListResponse {
  data: CrmContact[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: unknown;
}

export interface CrmContactFilters {
  status?: string;
  stage?: string;
  assigned_to?: string;
  search?: string;
}
