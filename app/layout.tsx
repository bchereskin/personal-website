import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SmoothScrollProvider from "@/app/components/SmoothScrollProvider";
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
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Brett Chereskin',
  jobTitle: 'Chief Operating Officer',
  worksFor: {
    '@type': 'Organization',
    name: 'dub',
    url: 'https://dub.co',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'United States Military Academy at West Point',
    },
  ],
  url: 'https://www.brettchereskin.com',
  sameAs: [
    'https://www.linkedin.com/in/brett-chereskin/',
    'https://x.com/BChereskin',
  ],
  description: 'COO at dub. West Point graduate and Army veteran building the systems and teams that scale ambitious companies.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brett Chereskin',
  url: 'https://www.brettchereskin.com',
  author: { '@type': 'Person', name: 'Brett Chereskin' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
