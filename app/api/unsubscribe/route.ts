import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  const { data: subscriber } = await getSupabase()
    .from('subscribers')
    .delete()
    .eq('unsubscribe_token', token)
    .select('id')
    .single();

  if (!subscriber) {
    await getSupabase()
      .from('comments')
      .update({ notify_replies: false })
      .eq('unsubscribe_token', token);
  }

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head><title>Unsubscribed</title></head>
      <body style="background:#1a1816;color:#f5f2ed;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
        <div style="text-align:center;max-width:400px;padding:24px;">
          <h1 style="color:#7d9a78;font-size:24px;">Unsubscribed</h1>
          <p style="color:#a89f91;line-height:1.6;">You've been unsubscribed and won't receive further notifications.</p>
          <a href="/" style="color:#7d9a78;text-decoration:underline;">Back to site</a>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
