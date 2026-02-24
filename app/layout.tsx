import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aretifi Studio | Commercial Asset Generator',
  description: 'Generate high-end local service ads instantly.',
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
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {/* --- GLOBAL WEBSITE HEADER --- */}
        <header className="w-full bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Aretifi
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/preview" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase">
                Flyer Studio
              </Link>
              <Link href="/ai-writer" className="text-sm font-bold text-slate-600 hover:text-slate-900 uppercase">
                AI Writer
              </Link>
              <Link href="/login" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </header>

        {/* This renders the content of your individual pages */}
        {children}
      </body>
    </html>
  );
}
