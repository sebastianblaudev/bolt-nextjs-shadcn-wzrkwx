import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('product-store')?.value;
  const isAdminRoute = request.nextUrl.pathname.match(/^\/admin|^\/reports/);
  
  if (!currentUser) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminRoute && !currentUser.includes('"role":"admin"')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/reports/:path*', '/buy/:path*', '/sell/:path*'],
};