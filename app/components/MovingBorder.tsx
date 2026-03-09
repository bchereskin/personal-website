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
      <div
        className="absolute inset-[-100%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, var(--primary) 10%, var(--accent) 20%, transparent 30%)`,
          animation: `spin-border ${duration}s linear infinite`,
        }}
      />
      <div className="relative z-10 rounded-[7px] bg-[var(--background)]">
        {children}
      </div>
    </div>
  );
}
