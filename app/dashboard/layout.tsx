import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Crypto Strategy Dashboard',
  description:
    'Live dashboard for a sentiment-driven AI crypto portfolio monitor running on a $20K paper trading fund via Alpaca.',
  openGraph: {
    title: 'AI Crypto Strategy Dashboard — Brett Chereskin',
    description:
      'Sentiment-driven risk management on a $20K paper trading fund. 6 crypto positions monitored 3× daily.',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
