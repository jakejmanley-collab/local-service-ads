import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
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
      <body className={inter.className}>
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* BRAND LOGO / HOME LINK */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="group flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic transition-all group-hover:text-blue-600">
                    ARETIFI
                  </span>
                </Link>
              </div>

              {/* NAVIGATION LINKS */}
              <div className="hidden md:flex space-x-8 items-center">
                <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Pricing
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  My Projects
                </Link>
                <Link 
                  href="/create" 
                  className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  Create Flyer
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>

        <footer className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-500">
              © 2026 ARETIFI. All rights reserved. Precision Marketing for Trades.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
