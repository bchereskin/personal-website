import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return user;
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await getAdminSupabase()
    .from('blog_posts')
    .select('id, slug, title, excerpt, date, read_time, category, is_published, created_at, updated_at, visit_count, last_visited_at')
    .order('date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, excerpt, content, date, read_time, category, is_published } = body;

  if (!slug || !title || !excerpt || !content || !date || !read_time || !category) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const { data, error } = await getAdminSupabase()
    .from('blog_posts')
    .insert({
      slug,
      title,
      excerpt,
      content,
      date,
      read_time,
      category,
      is_published: is_published ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
