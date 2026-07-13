'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Public Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
        <AlertTriangle size={28} />
      </div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-10">
        An unexpected error occurred while loading this page. You can try again, or head back home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors"
        >
          <RotateCcw size={18} />
          <span>Try again</span>
        </button>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
