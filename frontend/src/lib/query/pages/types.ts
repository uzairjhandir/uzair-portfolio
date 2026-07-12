export interface PageBlockRender {
  uuid: string;
  type: string;
  anchor: string | null;
  sort_order: number;
  content: Record<string, unknown> | null;
  instance_settings: Record<string, unknown> | null;
  visibility: Record<string, unknown> | null;
  responsive: Record<string, unknown> | null;
  animation: Record<string, unknown> | null;
}

export interface PageRender {
  page: {
    uuid: string;
    title: string;
    slug: string;
    seo: {
      title: string | null;
      description: string | null;
    };
    status: string;
  };
  layout: Record<string, unknown>;
  blocks: PageBlockRender[];
}
