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

  admin.rpc('increment_shared_page_visits', { page_slug: slug }).then(() => {});

  return new NextResponse(data.html_content, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}
