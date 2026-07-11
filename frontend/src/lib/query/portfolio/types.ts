export interface PortfolioProject {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  client_name?: string;
  project_url?: string;
  featured_image?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface PortfolioResponse {
  data: PortfolioProject[];
}
