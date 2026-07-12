import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface AssignableUser {
  id: string; // this is actually the user's uuid (see UserResource)
  name: string;
}

/** Reuses the existing GET /users endpoint for the assignment picker. */
export const useAssignableUsersQuery = () => {
  return useQuery({
    queryKey: ['crm', 'assignable-users'],
    queryFn: async (): Promise<AssignableUser[]> => {
      const response = await apiClient.get('/users');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
