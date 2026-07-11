'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { adminNavigation, NavItem } from '@/lib/config/adminNavigation';

function findBreadcrumbs(items: NavItem[], pathname: string, currentPath: NavItem[] = []): NavItem[] | null {
  for (const item of items) {
    const newPath = [...currentPath, item];
    
    if (item.href === pathname) {
      return newPath;
    }

    if (item.children) {
      const found = findBreadcrumbs(item.children, pathname, newPath);
      if (found) return found;
    }
  }
  
  // As a fallback, try to match partial paths for deeper routes (e.g. /edit)
  for (const item of items) {
    if (item.href && item.href !== '/admin' && pathname.startsWith(item.href)) {
       return [...currentPath, item];
    }
    if (item.children) {
       const found = findBreadcrumbs(item.children, pathname, [...currentPath, item]);
       if (found) return found;
    }
  }

  return null;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Dashboard is base, but we always render it as first item if we are in admin
  const breadcrumbs = findBreadcrumbs(adminNavigation, pathname) || [];

  // Remove duplicates or root if it's already dashboard
  const cleanBreadcrumbs = breadcrumbs.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);

  if (pathname === '/admin/dashboard') {
    return (
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
        <Home className="w-4 h-4 mr-2" />
        <span>Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4 space-x-2">
      <Link href="/admin/dashboard" className="hover:text-foreground flex items-center transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {cleanBreadcrumbs.map((crumb, index) => {
        if (crumb.title === 'Dashboard') return null; // We already have home icon
        
        const isLast = index === cleanBreadcrumbs.length - 1;
        
        return (
          <React.Fragment key={crumb.title}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-foreground">{crumb.title}</span>
            ) : (
              <span className="cursor-default">{crumb.title}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
