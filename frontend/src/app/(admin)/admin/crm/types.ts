export interface CrmRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "lost" | "won";
  priority: "low" | "medium" | "high";
  assigned_to?: string;
  notes?: string;
  timeline?: { date: string; event: string }[];
  reply_history?: { date: string; content: string }[];
  created_at?: string;
  updated_at?: string;
}
