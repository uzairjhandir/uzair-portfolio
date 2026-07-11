export interface SettingsRecord {
  id: string;
  group: "general" | "seo" | "social" | "email" | "analytics" | "security" | "storage" | "api" | "appearance";
  key: string;
  value: string;
  description?: string;
  type: "string" | "boolean" | "number" | "json";
  updated_at?: string;
}
