import type { Metadata } from 'next';
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
        {/* Critical: Downloads Anton and Roboto so they work in your flyer SVG */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
