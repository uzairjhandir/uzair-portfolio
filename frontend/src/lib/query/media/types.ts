export interface Media {
  id: string | number;
  file_name: string;
  url: string;
  mime_type: string;
  size: number;
  collection_name?: string;
  custom_properties?: Record<string, any>;
  created_at: string;
}

export interface MediaUploadResponse {
  data: Media;
  message?: string;
}
