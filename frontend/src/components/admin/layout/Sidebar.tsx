'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { adminNavigation, NavItem } from '@/lib/config/adminNavigation';
import { usePermissions } from '@/lib/hooks/auth/usePermissions';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface SidebarItem {
  title: string;
  href?: string;
  icon?: React.ElementType;
  children?: SidebarItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  const renderNavItem = (item: NavItem, depth = 0) => {
    // Check permissions
    if (item.permission && !hasPermission(item.permission)) return null;
    if (item.hidden) return null;

    const isActive = pathname === item.href || (item.href && pathname.startsWith(`${item.href}/`)) || false;
    const isChildActive = item.children?.some(child => pathname === child.href || (child.href && pathname.startsWith(`${child.href}/`)));
    const [isOpen, setIsOpen] = React.useState(isActive || isChildActive);

    const Icon = item.icon;

    if (item.children && item.children.length > 0) {
      return (
        <div key={item.title} className="space-y-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
              isOpen ? "text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
            style={{ paddingLeft: `${depth * 1 + 0.75}rem` }}
          >
            <div className="flex items-center gap-3">
              {Icon && (() => {
                const IconToRender = Icon as any;
                return <IconToRender className={cn("w-5 h-5", isOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />;
              })()}
              <span>{item.title}</span>
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isOpen && (
            <div className="space-y-1 mt-1">
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href || item.title}
        href={item.href || "#"}
        className={cn(
          "flex items-center justify-between py-2.5 rounded-lg text-sm font-medium transition-all group relative pr-3",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 1 + 0.75}rem` }}
      >
        <div className="flex items-center gap-3">
          {depth === 0 && isActive && (
            <div className="absolute left-0 w-1 h-full bg-primary rounded-r-full" />
          )}
          {Icon && (() => {
            const IconToRender = Icon as any;
            return <IconToRender className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />;
          })()}
          <span>{item.title}</span>
        </div>
        {item.badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">
            {item.badge.text}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo variant="full" className="h-8" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Menu
        </div>

        {adminNavigation.map((item) => renderNavItem(item, 0))}
      </div>

      <div className="p-4 border-t border-border/50 shrink-0">
        <div className="bg-primary/5 rounded-lg p-4 flex flex-col items-center text-center border border-primary/10">
          <div className="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse" />
          <p className="text-xs font-medium text-foreground">API Connected</p>
          <p className="text-[10px] text-muted-foreground mt-1">Laravel 12 Sanctum</p>
        </div>
      </div>
    </aside>
  );
}
