import { Media } from '@/lib/query/media/types';

export interface TaxonomyTermRef {
  uuid: string;
  name: string;
  slug: string;
}

export interface CaseStudySeo {
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og: { title: string | null; description: string | null };
}

export interface OutcomeMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived';
  author: { uuid: string; name: string } | null;
  featured_image: Media | null;
  gallery: Media[];
  seo: CaseStudySeo | null;
  portfolio: { uuid: string; title: string; slug: string } | null;
  is_primary: boolean;
  is_featured: boolean;
  challenge: string | null;
  solution: string | null;
  implementation: string | null;
  results: string | null;
  customer_quote: string | null;
  outcome_metrics: OutcomeMetric[] | null;
  duration_weeks: number | null;
  team_size: number | null;
  publish_at: string | null;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
  categories: TaxonomyTermRef[];
  technologies: TaxonomyTermRef[];
}

export interface CaseStudyListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CaseStudyListResponse {
  data: CaseStudy[];
  meta: CaseStudyListMeta;
}

export interface CaseStudyFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: 'title' | 'created_at' | 'updated_at';
  sort_dir?: 'asc' | 'desc';
}
