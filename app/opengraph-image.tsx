import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brett Chereskin';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1816',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#7d9a78',
            opacity: 0.15,
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: '#c4785a',
            opacity: 0.15,
            filter: 'blur(80px)',
          }}
        />

        {/* Shield logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="80"
          height="80"
          style={{ marginBottom: 24 }}
        >
          <path
            d="M256 32 L416 96 V288 C416 368 336 432 256 480 C176 432 96 368 96 288 V96 Z"
            fill="none"
            stroke="#7d9a78"
            strokeWidth="24"
            strokeLinejoin="round"
          />
          <path
            d="M256 120 L320 240 H288 V360 H224 V240 H192 Z"
            fill="#7d9a78"
          />
        </svg>

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#f5f2ed',
            marginBottom: 12,
            display: 'flex',
          }}
        >
          Brett Chereskin
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#7d7468',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <span>COO at dub</span>
          <span style={{ color: '#5c554b' }}>|</span>
          <span>West Point Graduate</span>
          <span style={{ color: '#5c554b' }}>|</span>
          <span>Army Veteran</span>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #7d9a78, #c4785a)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
