import { useUserQuery } from '@/lib/query/auth/queries';

export function usePermissions() {
  const { data: user } = useUserQuery();

  /**
   * Evaluates if the current user has the specified permission.
   */
  const hasPermission = (permission?: string) => {
    if (!permission) return true; // Allow if no specific permission is required
    
    if (!user) return false;

    // Super Admin override
    if (user.role === 'admin' || user.role === 'super_admin') return true;

    // Check against specific permissions array if the backend provides it
    // Example: return user.permissions?.includes(permission);
    return false;
  };

  return { hasPermission };
}
