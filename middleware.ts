import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only protect the /admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // The username will be 'admin', and the password will be pulled from Vercel
      if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }

    // If no password or wrong password, show the native browser login prompt
    return new NextResponse('Unauthorized access', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin HQ Restricted Access"',
      },
    });
  }

  return NextResponse.next();
}
