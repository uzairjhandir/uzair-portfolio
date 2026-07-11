export interface ContentBlock {
  id: string | number;
  name: string;
  type: string;
  schema: Record<string, any>;
  default_data: Record<string, any>;
  is_active: boolean;
}

export interface BlocksResponse {
  data: ContentBlock[];
}
