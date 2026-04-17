import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login');

  const admin = getAdminSupabase();

  const [{ data: contacts }, { data: comments }, { data: sharedPages }, { data: blogPosts }, { data: commentCounts }, { data: securePageRows }, { data: secureAccess }] = await Promise.all([
    admin
      .from('contacts')
      .select('id, name, email, subject, message, created_at')
      .order('created_at', { ascending: false }),
    admin
      .from('comments')
      .select('id, slug, name, email, body, created_at')
      .order('created_at', { ascending: false }),
    admin
      .from('shared_pages')
      .select('id, slug, title, html_content, created_at, visit_count, last_visited_at, is_active, recipient_name, recipient_type')
      .order('created_at', { ascending: false }),
    admin
      .from('blog_posts')
      .select('id, slug, title, excerpt, date, read_time, category, content, is_published, created_at, updated_at, visit_count, last_visited_at')
      .order('date', { ascending: false }),
    admin
      .from('comments')
      .select('slug'),
    admin
      .from('secure_pages')
      .select('id, slug, title, html_content, created_at, visit_count, last_visited_at, is_active')
      .order('created_at', { ascending: false }),
    admin
      .from('secure_page_access')
      .select('page_id, email'),
  ]);

  const commentCountMap: Record<string, number> = {};
  (commentCounts ?? []).forEach((c: { slug: string }) => {
    commentCountMap[c.slug] = (commentCountMap[c.slug] || 0) + 1;
  });

  const accessMap: Record<string, string[]> = {};
  (secureAccess ?? []).forEach((a: { page_id: string; email: string }) => {
    if (!accessMap[a.page_id]) accessMap[a.page_id] = [];
    accessMap[a.page_id].push(a.email);
  });
  const securePages = (securePageRows ?? []).map((p: Record<string, unknown> & { id: string }) => ({
    ...p,
    allowed_emails: accessMap[p.id] || [],
  })) as Array<{
    id: string;
    slug: string;
    title: string;
    html_content: string;
    created_at: string;
    visit_count: number;
    last_visited_at: string | null;
    is_active: boolean;
    allowed_emails: string[];
  }>;

  return (
    <AdminDashboard
      contacts={contacts ?? []}
      comments={comments ?? []}
      sharedPages={sharedPages ?? []}
      blogPosts={blogPosts ?? []}
      securePages={securePages}
      commentCountMap={commentCountMap}
      userEmail={user.email ?? ''}
    />
  );
}
