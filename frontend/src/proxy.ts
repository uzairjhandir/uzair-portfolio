import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (Middleware equivalent)
 *
 * Since Bearer tokens are stored in localStorage (not cookies), we cannot
 * inspect them in middleware (no DOM access). Auth guard is handled client-side
 * via the AuthGuard component which checks localStorage and redirects.
 *
 * This proxy only handles:
 * - Basic route structure (no redirect loops)
 */
// Next.js requires this exact (request: NextRequest) signature for the
// proxy/middleware entry point even though it's unused here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function proxy(request: NextRequest) {
  // Let all requests through — auth is enforced client-side by AuthGuard
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
