import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Pasal Udhaar | BASNET KHADNYA BIKRI SASTA',
  description: 'Manage shop credit easily',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8FAFC] text-slate-800 pb-24 md:pb-0 md:pl-72 min-h-screen`}>
        <Navigation />
        <main className="max-w-3xl mx-auto px-5 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
