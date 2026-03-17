import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Protect all routes starting with /admin
  if (pathname.startsWith('/admin')) {
    
    // 2. INTERNAL BYPASS: Allow the SEO API to talk to the dashboard 
    // without triggering a browser login popup.
    if (pathname.startsWith('/api/admin/seo')) {
      return NextResponse.next();
    }

    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // 3. AUTH LOGIC:
        // Username is hardcoded as 'admin'
        // Password MUST match your ADMIN_PASSCODE environment variable in Vercel
        const validPassword = process.env.ADMIN_PASSCODE;

        if (user === 'admin' && pwd === validPassword) {
          return NextResponse.next();
        }
      } catch (e) {
        // If decoding fails, continue to the unauthorized response
      }
    }

    // 4. UNAUTHORIZED: Trigger the native browser login prompt
    return new NextResponse('Unauthorized access', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin HQ Restricted Access"',
      },
    });
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths to save performance
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
