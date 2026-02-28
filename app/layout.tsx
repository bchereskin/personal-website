import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brettchereskin.com'),
  title: {
    default: 'Brett Chereskin',
    template: '%s | Brett Chereskin',
  },
  description: 'COO at dub. West Point graduate and Army veteran building the systems and teams that scale ambitious companies.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.brettchereskin.com',
    siteName: 'Brett Chereskin',
    title: 'Brett Chereskin',
    description: 'COO at dub. West Point graduate and Army veteran building the systems and teams that scale ambitious companies.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Brett Chereskin' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@BChereskin',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
