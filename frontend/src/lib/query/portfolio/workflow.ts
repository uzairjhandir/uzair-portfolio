import { PortfolioProject } from './types';

export type PortfolioStatus = PortfolioProject['status'];

export const STATUS_LABELS: Record<PortfolioStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

/**
 * Mirrors the backend's ContentStatusEnum::allowedTransitions() (excludes
 * needs_changes/expired, which Portfolio never uses). Kept identical to
 * lib/query/blog/workflow.ts since both content types share the same
 * ContentPublishingService state machine.
 */
const ALLOWED_TRANSITIONS: Record<PortfolioStatus, PortfolioStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['approved', 'draft'],
  approved: ['scheduled', 'published', 'draft'],
  scheduled: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export function allowedNextStatuses(current: PortfolioStatus): PortfolioStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}
