import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/supabase';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!SLUG_PATTERN.test(slug)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const { data, error } = await getSupabase()
    .from('shared_pages')
    .select('html_content')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return new NextResponse('Not found', { status: 404 });
  }

  getAdminSupabase()
    .rpc('increment_shared_page_visits', { page_slug: slug })
    .then(({ error: rpcError }) => {
      if (rpcError) console.error('Visit increment failed:', rpcError.message);
    });

  return new NextResponse(data.html_content, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}
