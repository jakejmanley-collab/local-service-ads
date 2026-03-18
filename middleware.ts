import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Protect /admin and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // MATCHES VERCEL VARIABLE EXACTLY
        const masterKey = process.env.ADMIN_PASSWORD;

        if (user === 'admin' && pwd === masterKey) {
          return NextResponse.next();
        }
      } catch (e) {
        // Fall through to 401 if decoding fails
      }
    }

    return new NextResponse('Unauthorized access', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin HQ Restricted Access"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Exclude /api/admin/ so the route.ts can process the JSON passcode from the UI component securely
  matcher: ['/admin/:path*'],
};
