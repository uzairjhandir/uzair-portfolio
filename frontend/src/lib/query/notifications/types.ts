export interface NotificationLog {
  id: number;
  uuid: string;
  recipient_id: number | null;
  recipient_contact: string;
  channel: string;
  template_key: string;
  status: string;
  error_message: string | null;
  attempts: number;
  queued_at: string | null;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
}

export interface NotificationLogListResponse {
  data: NotificationLog[];
  current_page: number;
  last_page: number;
  total: number;
}
