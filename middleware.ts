import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Protect /admin but ALLOW /api/admin/seo to bypass this specific browser prompt
  // This allows the "Blast" button to work without a browser popup
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Use ADMIN_PASSCODE to match your other files
      if (user === 'admin' && pwd === process.env.ADMIN_PASSCODE) {
        return NextResponse.next();
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
