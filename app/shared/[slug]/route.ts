import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const admin = getAdminSupabase();

  const { data, error } = await admin
    .from('shared_pages')
    .select('html_content, is_active')
    .eq('slug', slug)
    .single();

  if (error || !data || !data.is_active) {
    return new NextResponse('Not found', { status: 404 });
  }

  admin.rpc('increment_shared_page_visits', { page_slug: slug }).catch((err) => {
    console.error('Visit increment failed:', err);
  });

  return new NextResponse(data.html_content, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'self'; script-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
