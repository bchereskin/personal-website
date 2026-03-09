'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export default function MovingBorder({
  children,
  duration = 3,
  className = '',
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg p-[1px] ${className}`}>
      <motion.div
        className="absolute inset-[-100%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, var(--primary) 10%, var(--accent) 20%, transparent 30%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative z-10 rounded-[7px] bg-[var(--background)]">
        {children}
      </div>
    </div>
  );
}
