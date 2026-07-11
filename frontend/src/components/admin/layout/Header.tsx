'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUnreadNotificationsQuery } from '@/lib/query/notifications/queries';

export function Header() {
  const { logout, user, isLoggingOut } = useAuth();

  const { data: notifications } = useUnreadNotificationsQuery();
  const unreadCount = notifications?.count || 0;

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          )}
        </button>
        
        <div className="h-8 w-px bg-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'admin@uzair.dev'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
