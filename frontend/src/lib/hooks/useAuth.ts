import { useUserQuery } from '../query/auth/queries';
import { useLoginMutation, useLogoutMutation } from '../query/auth/mutations';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils';

export const useAuth = () => {
  const router = useRouter();

  const userQuery = useUserQuery();
  
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = async (credentials: Record<string, string>) => {
    try {
      await loginMutation.mutateAsync(credentials);
      toast.success('Logged in successfully');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    login,
    isLoggingIn: loginMutation.isPending,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
};
