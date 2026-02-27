import type { Metadata } from 'next';
import { Inter, Anton, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const anton = Anton({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-anton'
});

const poppins = Poppins({ 
  weight: ['400', '600', '700', '800'], 
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Local Service Ads',
  description: 'Generate advertising flyers for local businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
