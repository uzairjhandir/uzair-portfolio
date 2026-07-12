export interface MediaRef {
  id: string;
  url: string;
}

export interface SectionAction {
  label: string;
  href: string;
}

export interface SectionItem {
  title: string;
  description?: string;
  link?: string;
  media?: MediaRef | null;
}

export interface BlockContent {
  headline?: string;
  description?: string;
  media?: MediaRef | null;
  actions?: SectionAction[];
  items?: SectionItem[];
  content?: string;
  [key: string]: unknown;
}

export interface ContentBlock {
  uuid: string;
  type: string; // block type slug, e.g. "hero"
  name: string | null;
  variant: string | null;
  is_global: boolean | null;
  is_locked: boolean | null;
  content: BlockContent | null;
  settings: Record<string, unknown> | null;
  status: 'draft' | 'published' | 'archived' | string;
  version: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockType {
  uuid: string;
  name: string;
  slug: string;
  category: string | null;
  icon: string | null;
  is_singleton: boolean;
  allowed_zones: string[];
  slots: string[] | null;
  status: string;
}
