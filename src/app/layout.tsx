import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { Inter, Roboto } from 'next/font/google';

// Primary font - Inter for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

// Supporting font - Roboto for headings/labels
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BidQuotes Internal Dashboard',
  description: 'Internal admin dashboard for BidQuotes platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} ${roboto.variable} font-inter antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
