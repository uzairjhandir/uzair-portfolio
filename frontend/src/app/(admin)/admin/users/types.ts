export interface UsersRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}
