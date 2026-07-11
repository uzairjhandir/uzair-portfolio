export interface PageBlock {
  id: string;
  type: string;
  data: Record<string, any>;
  order: number;
}

export interface Page {
  id: string | number;
  title: string;
  slug: string;
  content: string; // If basic HTML
  blocks: PageBlock[]; // If builder blocks
  seo_title?: string;
  seo_description?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface PageRenderResponse {
  data: Page;
}
