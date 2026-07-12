export interface User {
  id: string;      // UUID
  name: string;
  email: string;
  status: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: 'Bearer';
    expires_at: string | null;
    user: User;
    roles: string[];
    permissions: string[];
  };
  errors: null;
  meta: null;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    roles: string[];
    permissions: string[];
  };
  errors: null;
  meta: null;
}
