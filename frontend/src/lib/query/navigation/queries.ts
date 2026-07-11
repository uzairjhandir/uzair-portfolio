import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { navigationKeys } from './keys';
import { NavigationMenu } from './types';

export const useNavigationQuery = (location: 'header' | 'footer' | 'sidebar') => {
  return useQuery({
    queryKey: navigationKeys.list(location),
    queryFn: async (): Promise<NavigationMenu> => {
      // Backend returns the menu specific to the requested location
      const response = await apiClient.get(`/navigation`, { params: { location } });
      return response.data.data; 
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since navigation rarely changes
  });
};
