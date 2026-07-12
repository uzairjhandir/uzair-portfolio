import { BlogPost } from './types';

export type BlogStatus = BlogPost['status'];

export const STATUS_LABELS: Record<BlogStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

/**
 * Mirrors the backend's ContentStatusEnum::allowedTransitions() (excludes
 * needs_changes/expired, which the Blog content type never uses).
 * Kept in sync manually since there is no shared schema between the two apps.
 */
const ALLOWED_TRANSITIONS: Record<BlogStatus, BlogStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['approved', 'draft'],
  approved: ['scheduled', 'published', 'draft'],
  scheduled: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export function allowedNextStatuses(current: BlogStatus): BlogStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}
