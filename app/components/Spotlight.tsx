'use client';

import { motion } from 'motion/react';

export default function Spotlight({
  className = '',
  fill = 'var(--primary)',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: '-72%', y: '-62%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-40%' }}
      transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
      className={`pointer-events-none absolute ${className}`}
    >
      <svg
        viewBox="0 0 580 1380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[40rem] h-auto"
      >
        <ellipse
          cx="290"
          cy="690"
          rx="290"
          ry="690"
          fill={fill}
          fillOpacity="0.12"
          filter="url(#spotlightBlur)"
        />
        <defs>
          <filter id="spotlightBlur">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
