export interface SettingItem {
  uuid: string;
  key: string;
  value: unknown;
  default_value: unknown;
  type: 'string' | 'textarea' | 'boolean' | 'integer' | 'json' | 'image' | 'password';
  validation: unknown;
  is_public: boolean;
  is_encrypted: boolean;
  is_system: boolean;
}

export interface SettingCategory {
  uuid: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  settings: SettingItem[];
}

export type SettingsGrouped = Record<string, SettingCategory>;
