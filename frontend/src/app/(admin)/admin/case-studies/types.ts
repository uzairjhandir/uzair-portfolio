export interface CaseStudiesRecord {
  id: string;
  title: string;
  slug: string;
  client: string;
  challenge: string;
  solution: string;
  results: string;
  status: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
}
