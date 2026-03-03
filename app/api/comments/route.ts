import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/app/lib/supabase';
import { getPostBySlug } from '@/app/blog/posts';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from('comments')
    .select('id, name, body, created_at')
    .eq('slug', slug)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, name, email, body: commentBody, honeypot } = body;

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

  const { data, error } = await getSupabase()
    .from('comments')
    .insert({ slug, name, email, body: commentBody })
    .select('id, name, body, created_at, edit_token')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const post = getPostBySlug(slug);
  const { error: emailError } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'comments@brettchereskin.com',
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `[Comment] ${post!.title} — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#7d9a78;margin-bottom:4px;">New comment from ${name}</h2>
        <p style="color:#888;font-size:14px;margin-top:0;">${new Date().toLocaleString()}</p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p><strong>Post:</strong> <a href="https://brettchereskin.com/blog/${slug}">${post!.title}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p style="white-space:pre-wrap;">${commentBody}</p>
        <hr style="border:none;border-top:1px solid #333;margin:16px 0;" />
        <p style="font-size:12px;color:#888;">Sent via brettchereskin.com</p>
      </div>
    `,
  });

  if (emailError) {
    console.error('Comment notification email failed:', emailError);
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
    .update({ body: newBody.trim() })
    .eq('id', id)
    .select('id, name, body, created_at')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
