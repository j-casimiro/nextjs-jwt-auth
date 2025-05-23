import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // If no tokens exist, redirect to login if trying to access protected routes
  if (!accessToken || !refreshToken) {
    if (isDashboardPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If tokens exist and trying to access auth pages, redirect to dashboard
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For dashboard pages, let the client-side handle token validation and refresh
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
