import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brett Chereskin — fintech operator, AI practitioner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Field Notes brand: warm paper, ink text, single ink-blue accent.
const PAPER = '#efe9db';
const INK = '#1a1814';
const INK_3 = '#6a6355';
const ACCENT = '#1f4a7a';
const RULE = '#c9bf9f';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: PAPER,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          position: 'relative',
        }}
      >
        {/* Top row: mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="72" height="72">
            <path
              d="M256 32 L416 96 V288 C416 368 336 432 256 480 C176 432 96 368 96 288 V96 Z"
              fill="none"
              stroke={ACCENT}
              strokeWidth="26"
              strokeLinejoin="round"
            />
            <path d="M256 120 L320 240 H288 V360 H224 V240 H192 Z" fill={ACCENT} />
          </svg>
          <div style={{ fontSize: 30, fontWeight: 600, color: INK, letterSpacing: -0.5 }}>
            Brett Chereskin
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 700, color: INK, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
            The operator who builds with AI.
          </div>
          <div style={{ fontSize: 30, color: INK_3, marginTop: 24, display: 'flex' }}>
            Fintech COO · AI practitioner · West Point · Army veteran
          </div>
        </div>

        {/* Bottom rule + url */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px solid ${RULE}`, paddingTop: 24 }}>
          <div style={{ fontSize: 24, color: INK_3 }}>brettchereskin.com</div>
          <div style={{ fontSize: 24, color: ACCENT, fontWeight: 600 }}>Field Notes · The Lab</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
