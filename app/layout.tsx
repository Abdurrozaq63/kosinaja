// layout.tsx (SERVER component)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from './ClientWrapper';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KOSIN',
  description: 'Tugas Akhir Kuliah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-zinc-200 overflow-x-hidden`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
