export interface NavigationItem {
  id: string | number;
  label: string;
  url: string;
  target?: '_blank' | '_self';
  order: number;
  parent_id?: string | number | null;
  children?: NavigationItem[];
}

export interface NavigationMenu {
  id: string | number;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: NavigationItem[];
}

export interface NavigationResponse {
  data: NavigationMenu;
}
