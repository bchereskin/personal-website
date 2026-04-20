import type { Metadata } from "next";
import { Source_Serif_4, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const serif = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brettchereskin.com'),
  title: {
    default: 'Brett Chereskin',
    template: '%s | Brett Chereskin',
  },
  description: 'COO at dub — a venture-backed consumer fintech. Fintech operator, AI practitioner, angel investor. West Point \'06.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.brettchereskin.com',
    siteName: 'Brett Chereskin',
    title: 'Brett Chereskin',
    description: 'COO at dub — a venture-backed consumer fintech. Fintech operator, AI practitioner, angel investor.',
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
  description: 'COO at dub — a venture-backed consumer fintech. Fintech operator, AI practitioner, angel investor.',
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
        className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
