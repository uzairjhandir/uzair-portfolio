import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (excluding /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check if Laravel Sanctum cookie exists (laravel_session or XSRF-TOKEN)
    const sessionCookie = request.cookies.get('laravel_session');
    
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login
  if (pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('laravel_session');
    if (sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
