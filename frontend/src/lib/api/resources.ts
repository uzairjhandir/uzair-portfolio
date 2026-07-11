export interface ResourceMeta {
  module: string;
  resource: string;
  endpoint: string;
}

export const Resources: Record<string, ResourceMeta> = {
  hero: {
    module: "homepage",
    resource: "hero",
    endpoint: "",
  },
  services: {
    module: "homepage",
    resource: "services",
    endpoint: "",
  },
  skills: {
    module: "homepage",
    resource: "skills",
    endpoint: "",
  },
  testimonials: {
    module: "homepage",
    resource: "testimonials",
    endpoint: "",
  },
  "client-logos": {
    module: "homepage",
    resource: "client-logos",
    endpoint: "",
  },
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
  "activity-logs": {
    module: "system",
    resource: "activity-logs",
    endpoint: "",
  },
  "system-health": {
    module: "system",
    resource: "system-health",
    endpoint: "",
  },
  pages: {
    module: "pages",
    resource: "pages",
    endpoint: "",
  },
  contact: {
    module: "contact",
    resource: "contact",
    endpoint: "",
  },
  navigation: {
    module: "navigation",
    resource: "navigation",
    endpoint: "",
  },
  footer: {
    module: "footer",
    resource: "footer",
    endpoint: "",
  },
  redirects: {
    module: "redirects",
    resource: "redirects",
    endpoint: "",
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
