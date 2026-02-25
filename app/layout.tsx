import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aretifi | High-End Contractor Flyers',
  description: 'Precision marketing assets for local service professionals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="group">
                  <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic transition-all group-hover:text-blue-600">
                    ARETIFI
                  </span>
                </Link>
              </div>
              <div className="hidden md:flex space-x-6 items-center">
                <Link href="/preview" className="text-sm font-bold text-blue-600 hover:text-blue-700">Create Flyer</Link>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">My Projects</Link>
                <Link href="/login" className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-slate-800 transition-colors">Sign In</Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
