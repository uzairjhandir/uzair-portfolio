export interface ResourceMeta {
  module: string;
  resource: string;
  endpoint: string;
}

export const Resources: Record<string, ResourceMeta> = {
  // Homepage sections (hero/services/skills/testimonials/client-logos/etc.)
  // are NOT flat CRUD resources — there is no backend route for them. They
  // are managed through the Pages -> Blocks -> BlockTypes architecture via
  // /admin/homepage-builder, not through this generic resource config.
  blog: {
    module: "blog",
    resource: "posts",
    endpoint: "",
  },
  portfolio: {
    module: "portfolio",
    resource: "projects",
    endpoint: "",
  },
  "case-studies": {
    module: "portfolio",
    resource: "case-studies",
    endpoint: "",
  },
  crm: {
    module: "crm",
    resource: "contacts",
    endpoint: "",
  },
  newsletter: {
    module: "newsletter",
    resource: "subscribers",
    endpoint: "",
  },
  users: {
    module: "users",
    resource: "users",
    endpoint: "",
  },
  roles: {
    module: "roles",
    resource: "roles",
    endpoint: "",
  },
  settings: {
    module: "settings",
    resource: "settings",
    endpoint: "",
  },
  media: {
    module: "media",
    resource: "media",
    endpoint: "",
  },
  pages: {
    module: "pages",
    resource: "pages",
    endpoint: "",
  },
  navigation: {
    module: "navigation",
    resource: "navigation",
    endpoint: "",
  },
  redirects: {
    module: "redirects",
    resource: "redirects",
    // Real backend routes are admin/redirects, not /redirects (that path is
    // taken by the public redirects/export endpoint for the edge middleware).
    endpoint: "/admin/redirects",
  },
  "cv-manager": {
    module: "cv-manager",
    resource: "cv-manager",
    endpoint: "",
  },
  awards: {
    module: "awards",
    resource: "awards",
    endpoint: "",
  },
  clients: {
    module: "clients",
    resource: "clients",
    endpoint: "",
  },
  "tech-stack": {
    module: "tech-stack",
    resource: "tech-stack",
    endpoint: "",
  },
  timeline: {
    module: "timeline",
    resource: "timeline",
    endpoint: "",
  },
  downloads: {
    module: "downloads",
    resource: "downloads",
    endpoint: "",
  }
};

export type ResourceKey = keyof typeof Resources;
