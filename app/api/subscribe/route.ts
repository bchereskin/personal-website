import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/app/lib/supabase';
import { rateLimit } from '@/app/lib/rate-limit';

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { maxRequests: 5, windowMs: 3600_000 });
  if (limited) return limited;

  const { email, honeypot } = await request.json();

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { data: existing } = await getSupabase()
    .from('subscribers')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ ok: true, already: true }, { status: 200 });
  }

  const { data, error } = await getSupabase()
    .from('subscribers')
    .insert({ email: email.toLowerCase() })
    .select('unsubscribe_token')
    .single();

  if (error) {
    console.error('Subscribe insert failed:', error.message);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brettchereskin.com';
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${data.unsubscribe_token}`;

  const { error: emailError } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'blog@brettchereskin.com',
    to: email.toLowerCase(),
    subject: "You're subscribed to Brett Chereskin's blog",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#7d9a78;margin-bottom:8px;">You're subscribed!</h2>
        <p style="color:#ccc;line-height:1.6;">
          You'll get an email when I publish a new blog post. No spam, no fluff — just new writing about operations, AI, and building.
        </p>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
        <p style="font-size:12px;color:#888;">
          <a href="${unsubscribeUrl}" style="color:#888;">Unsubscribe</a>
        </p>
      </div>
    `,
  });

  if (emailError) {
    console.error('Subscribe confirmation email failed:', emailError);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
