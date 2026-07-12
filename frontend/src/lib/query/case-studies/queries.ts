import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { caseStudyKeys } from './keys';
import { CaseStudy, CaseStudyListResponse, CaseStudyFilters } from './types';

export const useCaseStudyListQuery = (filters: CaseStudyFilters = {}) => {
  return useQuery({
    queryKey: caseStudyKeys.list(filters),
    queryFn: async (): Promise<CaseStudyListResponse> => {
      const response = await apiClient.get('/case-studies', { params: filters });
      return response.data;
    },
  });
};

/** Public, unauthenticated (published-only), for the public /case-studies pages — never used by admin. */
export const usePublicCaseStudyListQuery = (filters: CaseStudyFilters = {}) => {
  return useQuery({
    queryKey: [...caseStudyKeys.list(filters), 'public'],
    queryFn: async (): Promise<CaseStudyListResponse> => {
      const response = await apiClient.get('/public/case-studies', { params: filters });
      return response.data;
    },
  });
};

export const useCaseStudyDetailQuery = (uuid: string) => {
  return useQuery({
    queryKey: caseStudyKeys.detail(uuid),
    queryFn: async (): Promise<CaseStudy> => {
      const response = await apiClient.get(`/case-studies/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
};
