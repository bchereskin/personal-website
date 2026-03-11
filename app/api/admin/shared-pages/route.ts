import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const VALID_TYPES = ['person', 'project', 'business'];

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

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .select('id, slug, title, html_content, created_at, visit_count, last_visited_at, is_active, recipient_name, recipient_type')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, html_content, is_active, recipient_name, recipient_type } = body;

  if (!slug || !title || !html_content) {
    return NextResponse.json({ error: 'slug, title, and html_content are required' }, { status: 400 });
  }

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  if (recipient_type && !VALID_TYPES.includes(recipient_type)) {
    return NextResponse.json({ error: 'recipient_type must be person, project, or business' }, { status: 400 });
  }

  const { data, error } = await getAdminSupabase()
    .from('shared_pages')
    .insert({
      slug,
      title,
      html_content,
      is_active: is_active ?? true,
      recipient_name: recipient_name || null,
      recipient_type: recipient_type || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
