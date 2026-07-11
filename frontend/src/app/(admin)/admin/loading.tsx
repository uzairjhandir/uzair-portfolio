'use client';

import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">Loading content...</p>
    </div>
  );
}
