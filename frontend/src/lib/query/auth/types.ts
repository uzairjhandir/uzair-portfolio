export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // If relying on Bearer tokens instead of cookies
}
