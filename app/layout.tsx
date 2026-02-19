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
              
              {/* BRAND LOGO */}
              <div className="flex-shrink-0">
                <Link href="/" className="group">
                  <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase italic transition-all group-hover:text-blue-600">
                    ARETIFI
                  </span>
                </Link>
              </div>

              {/* CENTER/RIGHT NAVIGATION */}
              <div className="hidden md:flex space-x-6 items-center">
                {/* Product Links */}
                <Link href="/create" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  Create Flyer
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  My Projects
                </Link>
                
                {/* Informational Links (Restored) */}
                <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Pricing
                </Link>
                <Link href="/faq" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  FAQ
                </Link>
                <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Support
                </Link>

                {/* Account Action */}
                <Link 
                  href="/login" 
                  className="ml-4 bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>

        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="font-black tracking-tighter text-xl text-slate-900 uppercase italic">ARETIFI</span>
              <p className="mt-2 text-sm text-slate-500">Precision marketing for trades.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/faq" className="text-sm text-slate-600 hover:underline">Frequently Asked Questions</Link>
              <Link href="/terms" className="text-sm text-slate-600 hover:underline">Terms of Service</Link>
            </div>
            <div className="text-sm text-slate-500 md:text-right">
              © 2026 ARETIFI. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
