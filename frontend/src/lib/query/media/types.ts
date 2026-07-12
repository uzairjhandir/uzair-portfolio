export interface Media {
  uuid: string;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
  preview_url: string;
  alt_text: string | null;
  caption: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

export interface MediaUploadResponse {
  data: Media;
  message?: string;
}

export interface MediaFolder {
  uuid: string;
  name: string;
  children?: MediaFolder[];
}
