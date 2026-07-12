import { CaseStudyFilters } from './types';

export const caseStudyKeys = {
  all: ['case-study'] as const,
  lists: () => [...caseStudyKeys.all, 'list'] as const,
  list: (filters: CaseStudyFilters) => [...caseStudyKeys.lists(), filters] as const,
  details: () => [...caseStudyKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...caseStudyKeys.details(), uuid] as const,
};
