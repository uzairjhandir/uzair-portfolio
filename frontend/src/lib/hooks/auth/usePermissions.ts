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
    if (user.roles?.includes('Super Admin')) return true;

    return user.permissions?.includes(permission) ?? false;
  };

  return { hasPermission };
}
