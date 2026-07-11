export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface BlogResponse {
  data: BlogPost[];
}
