'use client';

import { useEffect } from 'react';

/**
 * Root Error Boundary — catches errors thrown inside the root layout itself
 * (providers, fonts, root-level data fetching), which app/error.tsx cannot
 * catch since it renders *inside* that layout. Must render its own
 * <html>/<body> and stay dependency-free — anything imported here could be
 * the thing that crashed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Root Error Boundary]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0A0F1A',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            fontSize: 28,
          }}
        >
          !
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>The application failed to load</h1>
        <p style={{ color: '#9ca3af', maxWidth: 420, marginBottom: 32 }}>
          A critical error occurred. Please try reloading the page.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            borderRadius: 999,
            background: '#ffffff',
            color: '#0A0F1A',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
