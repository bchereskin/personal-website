import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSupabase } from '@/app/lib/supabase';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data } = await getSupabase()
    .from('shared_pages')
    .select('title, recipient_name')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const title = data?.title || 'Shared Page';
  const recipient = data?.recipient_name;

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

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="64"
          height="64"
          style={{ marginBottom: 20 }}
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

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#f5f2ed',
            marginBottom: 12,
            display: 'flex',
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {recipient && (
          <div
            style={{
              fontSize: 24,
              color: '#7d7468',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Made for {recipient}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            fontSize: 20,
            color: '#5c554b',
          }}
        >
          brettchereskin.com
        </div>

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
