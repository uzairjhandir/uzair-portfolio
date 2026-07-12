import {
  Home,
  LayoutDashboard,
  Briefcase,
  FileText,
  Files,
  Compass,
  BookOpen,
  Download,
  Users,
  Shield,
  Settings,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  ArrowRightLeft,
  Activity,
  HeartPulse,
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
      {
        title: "Footer",
        href: "/admin/footer",
      },
    ]
  },
  {
    title: "Pages",
    icon: Files,
    href: "/admin/pages",
  },
  {
    title: "Navigation",
    icon: Compass,
    href: "/admin/navigation",
  },
  {
    title: "Portfolio",
    icon: Briefcase,
    href: "/admin/portfolio",
  },
  {
    title: "Case Studies",
    icon: BookOpen,
    href: "/admin/case-studies",
  },
  {
    title: "Blog",
    icon: FileText,
    href: "/admin/blog",
  },
  {
    title: "Downloads",
    icon: Download,
    href: "/admin/downloads",
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
    title: "Contact Submissions",
    icon: MessageSquare,
    href: "/admin/contact",
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
    title: "Redirects",
    icon: ArrowRightLeft,
    href: "/admin/redirects",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Roles",
    icon: Shield,
    href: "/admin/roles",
  },
  {
    title: "Activity Logs",
    icon: Activity,
    href: "/admin/activity-logs",
  },
  {
    title: "System Health",
    icon: HeartPulse,
    href: "/admin/system-health",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  }
];
