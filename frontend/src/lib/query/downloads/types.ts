export interface Download {
  id: string | number;
  title: string;
  slug: string;
  file_url: string;
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadsResponse {
  data: Download[];
  meta: any;
}
