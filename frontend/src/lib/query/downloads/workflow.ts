import { DownloadItem } from './types';

export type DownloadStatus = DownloadItem['status'];

export const STATUS_LABELS: Record<DownloadStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

/**
 * Mirrors the backend's ContentStatusEnum::allowedTransitions() — identical
 * to lib/query/blog/workflow.ts, portfolio/workflow.ts, case-studies/workflow.ts
 * since all content types share the same ContentPublishingService state machine.
 */
const ALLOWED_TRANSITIONS: Record<DownloadStatus, DownloadStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['approved', 'draft'],
  approved: ['scheduled', 'published', 'draft'],
  scheduled: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export function allowedNextStatuses(current: DownloadStatus): DownloadStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}
