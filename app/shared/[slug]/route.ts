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
    .select('html_content, title, recipient_name')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return new NextResponse('Not found', { status: 404 });
  }

  getAdminSupabase()
    .rpc('increment_shared_page_visits', { page_slug: slug })
    .then(({ error: rpcError }) => {
      if (rpcError) console.error('Visit increment failed:', rpcError.message);
    });

  const ogTags = [
    `<meta property="og:title" content="${(data.title || 'Shared Page').replace(/"/g, '&quot;')}" />`,
    `<meta property="og:image" content="https://www.brettchereskin.com/api/og/shared/${slug}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="https://www.brettchereskin.com/shared/${slug}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${(data.title || 'Shared Page').replace(/"/g, '&quot;')}" />`,
    `<meta name="twitter:image" content="https://www.brettchereskin.com/api/og/shared/${slug}" />`,
  ].join('\n    ');

  let html = data.html_content;
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n    ${ogTags}`);
  } else if (html.includes('<html')) {
    html = html.replace(/<html[^>]*>/, `$&\n  <head>\n    ${ogTags}\n  </head>`);
  } else {
    html = `<head>\n    ${ogTags}\n  </head>\n${html}`;
  }

  return new NextResponse(html, {
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
