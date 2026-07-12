import { Media } from '@/lib/query/media/types';

export interface TaxonomyTermRef {
  uuid: string;
  name: string;
  slug: string;
}

export interface PortfolioSeo {
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og: { title: string | null; description: string | null };
}

export interface PortfolioProject {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived';
  author: { uuid: string; name: string } | null;
  featured_image: Media | null;
  gallery: Media[];
  seo: PortfolioSeo | null;
  client_name: string | null;
  project_url: string | null;
  repository_url: string | null;
  completion_date: string | null;
  is_featured: boolean;
  is_open_source: boolean;
  project_status: string | null;
  publish_at: string | null;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
  categories: TaxonomyTermRef[];
  technologies: TaxonomyTermRef[];
}

export interface PortfolioListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PortfolioListResponse {
  data: PortfolioProject[];
  meta: PortfolioListMeta;
}

export interface PortfolioFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: 'title' | 'created_at' | 'completion_date' | 'updated_at';
  sort_dir?: 'asc' | 'desc';
}
