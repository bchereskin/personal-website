import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const VALID_TYPES = ['person', 'project', 'business'];

function authenticate(request: NextRequest): boolean {
  const key = process.env.PUBLISH_API_KEY;
  if (!key) return false;
  return request.headers.get('Authorization') === `Bearer ${key}`;
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  if (!authenticate(request)) return unauthorized();

  const body = await request.json();
  const { slug, title, html_content, recipient_name, recipient_type } = body;

  if (!slug || !title || !html_content) {
    return NextResponse.json(
      { error: 'slug, title, and html_content are required' },
      { status: 400 }
    );
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens.' },
      { status: 400 }
    );
  }

  if (recipient_type && !VALID_TYPES.includes(recipient_type)) {
    return NextResponse.json(
      { error: `recipient_type must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .insert({
      slug,
      title,
      html_content,
      is_active: true,
      recipient_name: recipient_name || null,
      recipient_type: recipient_type || null,
    })
    .select('id, slug')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      slug: data.slug,
      url: `https://www.brettchereskin.com/shared/${data.slug}`,
    },
    { status: 201 }
  );
}

export async function GET(request: NextRequest) {
  if (!authenticate(request)) return unauthorized();

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .select('id, slug, title, is_active, visit_count, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ pages: data });
}

export async function PUT(request: NextRequest) {
  if (!authenticate(request)) return unauthorized();

  const body = await request.json();
  const { slug, ...updates } = body;

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  if (updates.recipient_type && !VALID_TYPES.includes(updates.recipient_type)) {
    return NextResponse.json(
      { error: `recipient_type must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  const allowed = ['title', 'html_content', 'is_active', 'recipient_name', 'recipient_type'];
  const filtered: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key];
  }

  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .update(filtered)
    .eq('slug', slug)
    .select('id, slug, title, is_active')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!authenticate(request)) return unauthorized();

  const body = await request.json();
  const { slug } = body;

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const { error } = await getAdminSupabase()
    .from('shared_pages')
    .delete()
    .eq('slug', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
