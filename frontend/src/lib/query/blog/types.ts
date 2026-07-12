import { Media } from '@/lib/query/media/types';

export interface TaxonomyTermRef {
  uuid: string;
  name: string;
  slug: string;
}

export interface BlogSeo {
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og: {
    title: string | null;
    description: string | null;
  };
}

export interface BlogPost {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived';
  author: { uuid: string; name: string } | null;
  featured_image: Media | null;
  seo: BlogSeo | null;
  publish_at: string | null;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time: number | null;
  is_featured: boolean;
  is_pinned: boolean;
  categories: TaxonomyTermRef[];
  tags: TaxonomyTermRef[];
}

export interface BlogListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BlogListResponse {
  data: BlogPost[];
  meta: BlogListMeta;
}

export interface BlogFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: 'title' | 'created_at' | 'publish_at' | 'updated_at';
  sort_dir?: 'asc' | 'desc';
}
