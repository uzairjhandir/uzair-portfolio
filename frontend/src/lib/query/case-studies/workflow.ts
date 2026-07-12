import { CaseStudy } from './types';

export type CaseStudyStatus = CaseStudy['status'];

export const STATUS_LABELS: Record<CaseStudyStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

/**
 * Mirrors the backend's ContentStatusEnum::allowedTransitions() — identical
 * to lib/query/blog/workflow.ts and lib/query/portfolio/workflow.ts since
 * all three content types share the same ContentPublishingService state
 * machine.
 */
const ALLOWED_TRANSITIONS: Record<CaseStudyStatus, CaseStudyStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['approved', 'draft'],
  approved: ['scheduled', 'published', 'draft'],
  scheduled: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export function allowedNextStatuses(current: CaseStudyStatus): CaseStudyStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}
