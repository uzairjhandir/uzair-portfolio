import { Media } from '@/lib/query/media/types';

export interface TaxonomyTermRef {
  uuid: string;
  name: string;
  slug: string;
}

export interface DownloadSeo {
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og: { title: string | null; description: string | null };
}

export interface DownloadItem {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived';
  author: { uuid: string; name: string } | null;
  seo: DownloadSeo | null;
  file: Media | null;
  preview_image: Media | null;
  latest_version: string | null;
  is_featured: boolean;
  requires_email: boolean;
  requires_accept_terms: boolean;
  requires_agreement: boolean;
  license_type: string | null;
  access_level: string;
  download_count: number;
  publish_at: string | null;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
  categories: TaxonomyTermRef[];
}

export interface DownloadListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DownloadListResponse {
  data: DownloadItem[];
  meta: DownloadListMeta;
}

export interface DownloadFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: 'title' | 'created_at' | 'updated_at' | 'download_count';
  sort_dir?: 'asc' | 'desc';
}
