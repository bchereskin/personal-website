export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={Math.round((size * 108) / 68)}
      height={size}
      viewBox="0 0 108 68"
      role="img"
      aria-label="Brett Chereskin"
      className="text-[var(--ink)]"
    >
      <g fill="currentColor" opacity="0.35">
        <path d="M28 42 Q12 38 0 44 Q14 40 26 44 Z" />
        <path d="M80 42 Q96 38 108 44 Q94 40 82 44 Z" />
      </g>
      <g fill="currentColor" opacity="0.6">
        <path d="M30 38 Q14 32 2 34 Q16 32 28 36 Z" />
        <path d="M78 38 Q94 32 106 34 Q92 32 80 36 Z" />
      </g>
      <g fill="currentColor">
        <path d="M32 34 Q18 28 6 28 Q20 28 30 32 Z" />
        <path d="M76 34 Q90 28 102 28 Q88 28 78 32 Z" />
      </g>
      <g transform="translate(22 6)">
        <path
          d="M32 4 L56 12 V32 C56 44 46 54 32 60 C18 54 8 44 8 32 V12 Z"
          fill="var(--paper)"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M34 14 L22 34 H30 V48 L42 28 H34 Z" fill="currentColor" />
      </g>
      <path d="M54 0 L55 3 L58 4 L55 5 L54 8 L53 5 L50 4 L53 3 Z" fill="var(--accent)" />
    </svg>
  );
}
