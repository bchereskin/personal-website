import { NextRequest, NextResponse } from 'next/server';
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
    .select('id, name, body, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
