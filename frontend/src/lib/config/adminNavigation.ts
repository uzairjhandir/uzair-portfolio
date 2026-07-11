import { 
  Home, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  Image as ImageIcon,
  Mail,
  UserCircle
} from "lucide-react";
import * as React from "react";

export interface NavBadge {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ElementType;
  permission?: string;
  hidden?: boolean;
  external?: boolean;
  badge?: NavBadge;
  children?: NavItem[];
}

export const adminNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Homepage CMS",
    icon: Home,
    permission: "homepage.view",
    children: [
      {
        title: "Hero Section",
        href: "/admin/homepage/hero",
        permission: "homepage.hero.view",
      },
      {
        title: "About",
        href: "/admin/homepage/about",
        permission: "homepage.about.view",
      },
      {
        title: "Services",
        href: "/admin/homepage/services",
        permission: "homepage.services.view",
      },
      {
        title: "Skills",
        href: "/admin/homepage/skills",
        permission: "homepage.skills.view",
      },
      {
        title: "Experience",
        href: "/admin/homepage/experience",
        permission: "homepage.experience.view",
      },
      {
        title: "Technologies",
        href: "/admin/homepage/technologies",
        permission: "homepage.technologies.view",
      },
      {
        title: "Process",
        href: "/admin/homepage/process",
        permission: "homepage.process.view",
      },
      {
        title: "Client Logos",
        href: "/admin/homepage/client-logos",
        permission: "homepage.client-logos.view",
      },
      {
        title: "Testimonials",
        href: "/admin/homepage/testimonials",
        permission: "homepage.testimonials.view",
      },
      {
        title: "FAQ",
        href: "/admin/homepage/faq",
        permission: "homepage.faq.view",
      },
      {
        title: "Contact Section",
        href: "/admin/homepage/contact",
        permission: "homepage.contact.view",
      },
      {
        title: "SEO",
        href: "/admin/homepage/seo",
        permission: "homepage.seo.view",
      },
      {
        title: "Settings",
        href: "/admin/homepage/settings",
        permission: "homepage.settings.view",
      },
    ]
  },
  {
    title: "Portfolio",
    icon: Briefcase,
    href: "/admin/portfolio",
  },
  {
    title: "Blog",
    icon: FileText,
    href: "/admin/blog",
  },
  {
    title: "Media Library",
    icon: ImageIcon,
    href: "/admin/media",
  },
  {
    title: "CRM / Leads",
    icon: Mail,
    href: "/admin/crm",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Profile",
    icon: UserCircle,
    href: "/admin/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  }
];
