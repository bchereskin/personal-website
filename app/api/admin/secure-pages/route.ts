import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminSupabase();

  const { data: pages, error } = await admin
    .from('secure_pages')
    .select('id, slug, title, html_content, created_at, visit_count, last_visited_at, is_active')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: access } = await admin
    .from('secure_page_access')
    .select('page_id, email');

  const accessMap: Record<string, string[]> = {};
  (access ?? []).forEach((a: { page_id: string; email: string }) => {
    if (!accessMap[a.page_id]) accessMap[a.page_id] = [];
    accessMap[a.page_id].push(a.email);
  });

  const pagesWithAccess = (pages ?? []).map((p: { id: string }) => ({
    ...p,
    allowed_emails: accessMap[p.id] || [],
  }));

  return NextResponse.json(pagesWithAccess);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, html_content, is_active, allowed_emails } = body;

  if (!slug || !title || !html_content) {
    return NextResponse.json({ error: 'slug, title, and html_content are required' }, { status: 400 });
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const admin = getAdminSupabase();

  const { data: page, error } = await admin
    .from('secure_pages')
    .insert({ slug, title, html_content, is_active: is_active ?? true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (allowed_emails?.length) {
    const rows = allowed_emails.map((email: string) => ({
      page_id: page.id,
      email: email.trim().toLowerCase(),
    }));
    await admin.from('secure_page_access').insert(rows);
  }

  return NextResponse.json({ ...page, allowed_emails: allowed_emails || [] }, { status: 201 });
}
