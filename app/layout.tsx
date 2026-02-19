import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata = {
  title: 'Aretifi | High-End Contractor Flyers',
  description: 'Generate commercial-grade marketing assets for local service professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans">
        <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="font-extrabold text-2xl text-blue-600 tracking-tight">
            <span className="font-black tracking-tighter">ARETIFI</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-semibold text-sm text-slate-600">
            <Link href="/preview" className="hover:text-blue-600 transition">Free Preview</Link>
            <Link href="/ai-writer" className="hover:text-blue-600 transition">AI Ad Writer</Link>
            <Link href="/#pricing" className="hover:text-blue-600 transition">Pricing</Link>
            <Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="hidden sm:block text-slate-600 hover:text-blue-600 font-semibold text-sm px-4 py-2">
              Sign In
            </Link>
            <Link href="/preview" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">
              Get Started
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
