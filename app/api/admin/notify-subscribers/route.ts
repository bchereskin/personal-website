import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';
import { getPostBySlug } from '@/app/blog/posts';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await request.json();
  const post = await getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });

  const admin = getAdminSupabase();
  const { data: subscribers } = await admin
    .from('subscribers')
    .select('email, unsubscribe_token');

  if (!subscribers?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brettchereskin.com';
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.batch.send(
    subscribers.map((sub) => ({
      from: 'blog@brettchereskin.com',
      to: sub.email,
      subject: `New post: ${post.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">New from Brett Chereskin</p>
          <h2 style="color:#f5f2ed;margin-bottom:12px;">
            <a href="${siteUrl}/blog/${post.slug}" style="color:#f5f2ed;text-decoration:none;">${post.title}</a>
          </h2>
          <p style="color:#a89f91;line-height:1.6;margin-bottom:24px;">${post.excerpt}</p>
          <a href="${siteUrl}/blog/${post.slug}" style="display:inline-block;background:#7d9a78;color:#1a1816;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Read the post
          </a>
          <hr style="border:none;border-top:1px solid #333;margin:32px 0 16px;" />
          <p style="font-size:12px;color:#888;">
            <a href="${siteUrl}/api/unsubscribe?token=${sub.unsubscribe_token}" style="color:#888;">Unsubscribe</a>
          </p>
        </div>
      `,
    }))
  );

  if (error) {
    console.error('Subscriber notification failed:', error);
    return NextResponse.json({ error: 'Failed to send some emails' }, { status: 500 });
  }

  return NextResponse.json({ sent: subscribers.length });
}
