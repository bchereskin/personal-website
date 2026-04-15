'use client';

import { motion } from 'motion/react';

const CRYPTO_COLORS: Record<string, string> = {
  'BTC/USD': '#f7931a',
  'ETH/USD': '#627eea',
  'SOL/USD': '#9945ff',
  'DOGE/USD': '#c2a633',
  'LINK/USD': '#2a5ada',
  'AVAX/USD': '#e84142',
  Cash: '#3b82f6',
};

const LABELS: Record<string, string> = {
  'BTC/USD': 'BTC',
  'ETH/USD': 'ETH',
  'SOL/USD': 'SOL',
  'DOGE/USD': 'DOGE',
  'LINK/USD': 'LINK',
  'AVAX/USD': 'AVAX',
  Cash: 'Cash',
};

interface Slice {
  key: string;
  pct: number;
}

export default function DonutChart({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: Slice[];
  centerLabel: string;
  centerValue: string;
}) {
  const radius = 80;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => {
            const dashLength = (slice.pct / 100) * circumference;
            const dashGap = circumference - dashLength;
            const offset = cumulativeOffset;
            cumulativeOffset += dashLength;

            return (
              <motion.circle
                key={slice.key}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={CRYPTO_COLORS[slice.key] || '#666'}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${dashGap}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-[var(--neutral-400)] uppercase tracking-wider">
            {centerLabel}
          </span>
          <span className="text-xl font-bold text-[var(--neutral-50)]">
            {centerValue}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: CRYPTO_COLORS[slice.key] || '#666' }}
            />
            <span className="text-[var(--neutral-300)]">
              {LABELS[slice.key] || slice.key}{' '}
              <span className="text-[var(--neutral-500)]">
                {slice.pct.toFixed(1)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
