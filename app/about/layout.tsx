import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Brett Chereskin — COO at dub, West Point graduate, 12-year Army veteran. Building the systems and teams that scale ambitious companies.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
