'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isError } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Only the very first auth check should hide the tree behind a spinner.
  // Later loading flickers (e.g. a query re-fetching in the background)
  // must not unmount `children`, since that would drop the component that
  // owns the auth query's observer and re-trigger the fetch that caused
  // the flicker in the first place — an infinite mount/fetch loop. This is
  // a deliberate one-shot latch (isLoading false -> true forever), not a
  // derived-state anti-pattern; the alternative (a ref mutated during
  // render) trips the stricter react-hooks/refs rule instead.
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isLoading) setHasCheckedOnce(true);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if ((isError || !user) && !isLoginPage) {
        router.push('/admin/login');
      } else if (user && isLoginPage) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, isLoading, isError, router, pathname, isLoginPage]);

  if (isLoading && !hasCheckedOnce) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Authenticating secure session...</p>
        </div>
      </div>
    );
  }

  if (hasCheckedOnce && (isError || !user) && !isLoginPage) {
    return null; // Will redirect in useEffect
  }

  // Data Loaded State
  return <>{children}</>;
}
