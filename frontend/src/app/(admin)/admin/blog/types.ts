export interface BlogRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich text
  featured_image?: string;
  author_id: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  reading_time?: number;
  categories: string[];
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}
