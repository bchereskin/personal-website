import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;
const VALID_TYPES = ['person', 'project', 'business'];
const MAX_HTML_SIZE = 5_000_000;
const MAX_TITLE_LENGTH = 500;
const MAX_NAME_LENGTH = 200;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= maxRequests;
}

function authenticate(request: NextRequest): boolean {
  const key = process.env.PUBLISH_API_KEY;
  if (!key) return false;
  const provided = request.headers.get('Authorization') ?? '';
  const expected = `Bearer ${key}`;
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function rateLimited() {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}

function serverError() {
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

function parseBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  return request.json().catch(() => null);
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) return rateLimited();
  if (!authenticate(request)) return unauthorized();

  const body = await parseBody(request);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const { slug, title, html_content, recipient_name, recipient_type } = body;

  if (!isString(slug) || !isString(title) || !isString(html_content)) {
    return NextResponse.json(
      { error: 'slug, title, and html_content are required strings' },
      { status: 400 }
    );
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json({ error: 'title exceeds maximum length' }, { status: 400 });
  }

  if (html_content.length > MAX_HTML_SIZE) {
    return NextResponse.json({ error: 'html_content exceeds maximum size (5MB)' }, { status: 413 });
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens (max 100 chars).' },
      { status: 400 }
    );
  }

  if (recipient_name !== undefined && (!isString(recipient_name) || recipient_name.length > MAX_NAME_LENGTH)) {
    return NextResponse.json({ error: 'Invalid recipient_name' }, { status: 400 });
  }

  if (recipient_type !== undefined && (!isString(recipient_type) || !VALID_TYPES.includes(recipient_type))) {
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
      recipient_name: (recipient_name as string) || null,
      recipient_type: (recipient_type as string) || null,
    })
    .select('id, slug')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error('Publish POST error:', error.message);
    return serverError();
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
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) return rateLimited();
  if (!authenticate(request)) return unauthorized();

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .select('id, slug, title, is_active, visit_count, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Publish GET error:', error.message);
    return serverError();
  }

  return NextResponse.json({ pages: data });
}

export async function PUT(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) return rateLimited();
  if (!authenticate(request)) return unauthorized();

  const body = await parseBody(request);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const { slug } = body;

  if (!isString(slug)) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const allowed = ['title', 'html_content', 'is_active', 'recipient_name', 'recipient_type'] as const;
  const filtered: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key in body) {
      const val = body[key];
      if (key === 'is_active') {
        if (typeof val !== 'boolean') {
          return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 });
        }
      } else if (key === 'title') {
        if (!isString(val) || val.length > MAX_TITLE_LENGTH) {
          return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
        }
      } else if (key === 'html_content') {
        if (!isString(val) || val.length > MAX_HTML_SIZE) {
          return NextResponse.json({ error: 'html_content exceeds maximum size (5MB)' }, { status: 413 });
        }
      } else if (key === 'recipient_name') {
        if (!isString(val) || val.length > MAX_NAME_LENGTH) {
          return NextResponse.json({ error: 'Invalid recipient_name' }, { status: 400 });
        }
      } else if (key === 'recipient_type') {
        if (!isString(val) || !VALID_TYPES.includes(val)) {
          return NextResponse.json({ error: `recipient_type must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 });
        }
      }
      filtered[key] = val;
    }
  }

  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  if ('is_active' in filtered) {
    console.log(`Shared page "${slug}" is_active changed to ${filtered.is_active}`);
  }

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .update(filtered)
    .eq('slug', slug)
    .select('id, slug, title, is_active')
    .single();

  if (error) {
    console.error('Publish PUT error:', error.message);
    return serverError();
  }

  if (!data) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) return rateLimited();
  if (!authenticate(request)) return unauthorized();

  const body = await parseBody(request);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const { slug } = body;

  if (!isString(slug)) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .delete()
    .eq('slug', slug)
    .select('id')
    .single();

  if (error && error.code === 'PGRST116') {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  if (error) {
    console.error('Publish DELETE error:', error.message);
    return serverError();
  }

  return NextResponse.json({ ok: true, deleted: data?.id });
}
