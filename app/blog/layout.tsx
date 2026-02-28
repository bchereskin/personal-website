import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on leadership, operations, AI, and building great companies.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
