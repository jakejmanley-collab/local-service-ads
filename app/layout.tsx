import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aretifi.com'),
  title: 'Aretifi | High-End Contractor Flyers',
  description: 'Precision marketing assets for local service professionals.',
  alternates: {
    canonical: '/',
  },
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
          href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Roboto:wght@400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">
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
        
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <footer className="bg-slate-950 text-slate-400 py-12 border-t-8 border-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-black text-2xl tracking-tighter text-white uppercase italic mb-4">
                ARETIFI
              </div>
              <p className="font-bold">Turn free listings into high-paying clients with commercial-grade ad assets.</p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="font-black text-white uppercase tracking-wider mb-2">Platform</h3>
              <Link href="/preview" className="hover:text-white transition-colors">Free Generator</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>

            {/* Popular Locations Directory for SEO Crawling */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-black text-white uppercase tracking-wider mb-2">Popular Guides</h3>
              <Link href="/guides/electrician-marketing" className="hover:text-white transition-colors">Electrician Marketing</Link>
              <Link href="/guides/plumbing-ads-tips" className="hover:text-white transition-colors">Plumbing Ad Tips</Link>
              <Link href="/guides/hvac-social-media" className="hover:text-white transition-colors">HVAC Social Media</Link>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-black text-white uppercase tracking-wider mb-2">Legal</h3>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-xs font-bold text-center">
            &copy; {new Date().getFullYear()} Aretifi. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}
