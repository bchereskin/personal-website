import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/app/lib/supabase';
import { getPostBySlug } from '@/app/blog/posts';
import { escapeHtml, sanitizeInput } from '@/app/lib/sanitize';
import { rateLimit } from '@/app/lib/rate-limit';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from('comments')
    .select('id, name, body, created_at, parent_id')
    .eq('slug', slug)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Comments fetch failed:', error.message);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { maxRequests: 10, windowMs: 3600_000 });
  if (limited) return limited;

  const body = await request.json();
  const {
    slug,
    name,
    email,
    body: commentBody,
    honeypot,
    parent_id,
    notify_replies,
  } = body;

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!slug || !name || !email || !commentBody) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!getPostBySlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  if (name.length > 100 || email.length > 200 || commentBody.length > 2000) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const cleanName = sanitizeInput(name);
  const cleanEmail = sanitizeInput(email);
  const cleanBody = sanitizeInput(commentBody);

  if (!cleanName || !cleanEmail || !cleanBody) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (parent_id) {
    const { data: parentComment } = await getSupabase()
      .from('comments')
      .select('id')
      .eq('id', parent_id)
      .eq('slug', slug)
      .single();

    if (!parentComment) {
      return NextResponse.json({ error: 'Parent comment not found' }, { status: 400 });
    }
  }

  const { data, error } = await getSupabase()
    .from('comments')
    .insert({
      slug,
      name: cleanName,
      email: cleanEmail,
      body: cleanBody,
      parent_id: parent_id || null,
      notify_replies: !!notify_replies,
    })
    .select('id, name, body, created_at, parent_id, edit_token')
    .single();

  if (error) {
    console.error('Comment insert failed:', error.message);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }

  const post = getPostBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brettchereskin.com';

  const { error: emailError } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'comments@brettchereskin.com',
    to: process.env.CONTACT_EMAIL!,
    replyTo: cleanEmail,
    subject: `[Comment] ${post!.title} — ${cleanName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#7d9a78;margin-bottom:4px;">New ${parent_id ? 'reply' : 'comment'} from ${escapeHtml(cleanName)}</h2>
        <p style="color:#888;font-size:14px;margin-top:0;">${new Date().toLocaleString()}</p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p><strong>Post:</strong> <a href="${siteUrl}/blog/${slug}">${escapeHtml(post!.title)}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p style="white-space:pre-wrap;">${escapeHtml(cleanBody)}</p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p style="font-size:12px;color:#888;">Sent via brettchereskin.com</p>
      </div>
    `,
  });

  if (emailError) {
    console.error('Comment notification email failed:', emailError);
  }

  if (parent_id) {
    sendReplyNotification(parent_id, cleanName, cleanBody, slug, post!.title, cleanEmail).catch(
      (err) => console.error('Reply notification failed:', err)
    );
  }

  return NextResponse.json(data, { status: 201 });
}

const EDIT_WINDOW_MS = 15 * 60 * 1000;

export async function PUT(request: NextRequest) {
  const { id, edit_token, body: newBody } = await request.json();

  if (!id || !edit_token || !newBody) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (typeof newBody !== 'string' || newBody.length > 2000 || !newBody.trim()) {
    return NextResponse.json({ error: 'Invalid comment body' }, { status: 400 });
  }

  const cleanNewBody = sanitizeInput(newBody);
  if (!cleanNewBody) {
    return NextResponse.json({ error: 'Invalid comment body' }, { status: 400 });
  }

  const { data: comment, error: fetchError } = await getSupabase()
    .from('comments')
    .select('id, edit_token, created_at')
    .eq('id', id)
    .single();

  if (fetchError || !comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  if (comment.edit_token !== edit_token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  const created = new Date(comment.created_at).getTime();
  if (Date.now() - created > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: 'Edit window has expired' }, { status: 403 });
  }

  const { data: updated, error: updateError } = await getSupabase()
    .from('comments')
    .update({ body: cleanNewBody })
    .eq('id', id)
    .select('id, name, body, created_at')
    .single();

  if (updateError) {
    console.error('Comment update failed:', updateError.message);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }

  return NextResponse.json(updated);
}

async function sendReplyNotification(
  parentId: number,
  replyAuthor: string,
  replyBody: string,
  slug: string,
  postTitle: string,
  replyEmail: string,
) {
  const { data: parent } = await getSupabase()
    .from('comments')
    .select('email, name, notify_replies, unsubscribe_token')
    .eq('id', parentId)
    .single();

  if (!parent || !parent.notify_replies || parent.email === replyEmail) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brettchereskin.com';
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${parent.unsubscribe_token}`;

  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'comments@brettchereskin.com',
    to: parent.email,
    subject: `${replyAuthor} replied to your comment on "${postTitle}"`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#7d9a78;margin-bottom:8px;">New reply to your comment</h2>
        <p style="color:#ccc;line-height:1.6;">
          Hi ${escapeHtml(parent.name)}, <strong>${escapeHtml(replyAuthor)}</strong> replied to your comment on
          <a href="${siteUrl}/blog/${slug}" style="color:#7d9a78;">${escapeHtml(postTitle)}</a>.
        </p>
        <div style="background:#242220;border-left:3px solid #7d9a78;padding:12px 16px;margin:16px 0;border-radius:4px;">
          <p style="color:#f5f2ed;white-space:pre-wrap;margin:0;">${escapeHtml(replyBody)}</p>
        </div>
        <a href="${siteUrl}/blog/${slug}" style="display:inline-block;background:#7d9a78;color:#1a1816;padding:8px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          View the conversation
        </a>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0 16px;" />
        <p style="font-size:12px;color:#888;">
          <a href="${unsubscribeUrl}" style="color:#888;">Unsubscribe from reply notifications</a>
        </p>
      </div>
    `,
  });
}
