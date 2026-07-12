import {
  Home,
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  Image as ImageIcon,
  Mail,
  UserCircle,
  Send,
  Workflow,
  Bell
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
        title: "Homepage Builder",
        href: "/admin/homepage-builder",
        permission: "homepage.view",
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
    title: "Newsletter",
    icon: Send,
    href: "/admin/newsletter",
  },
  {
    title: "Automation",
    icon: Workflow,
    href: "/admin/automation",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
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
