export interface Taxonomy {
  uuid: string;
  name: string;
  slug: string;
  is_hierarchical: boolean;
}

export interface TaxonomyTerm {
  uuid: string;
  name: string;
  slug: string;
  parent_id: number | null;
  children: TaxonomyTerm[];
}
