export interface PortfolioRecord {
  id: string;
  title: string;
  slug: string;
  client?: string;
  description: string;
  technologies: string[];
  featured_image?: string;
  gallery: string[];
  github_url?: string;
  live_url?: string;
  case_study_id?: string;
  status: "draft" | "published" | "archived";
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}
