export interface Setting {
  id: number | string;
  key: string;
  value: string | boolean | number | Record<string, any>;
  group: 'general' | 'seo' | 'social' | 'mail' | 'theme';
  type: 'string' | 'boolean' | 'integer' | 'json';
  description?: string;
  is_public: boolean;
}

export interface SettingsResponse {
  data: Setting[];
}
