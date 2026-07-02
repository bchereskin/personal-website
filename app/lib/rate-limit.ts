import { NextRequest, NextResponse } from 'next/server';

const hits = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of hits) {
    if (val.resetAt <= now) hits.delete(key);
  }
}, 60_000);

export function rateLimit(
  request: NextRequest,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): NextResponse | null {
  // Prefer x-real-ip: on Vercel it's set by the platform to the true client IP
  // and can't be spoofed. The leftmost x-forwarded-for entry is client-supplied,
  // so it's only a fallback for non-Vercel environments.
  const ip =
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}
