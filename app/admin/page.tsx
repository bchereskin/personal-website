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

  const [{ data: contacts }, { data: comments }, { data: sharedPages }] = await Promise.all([
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
      .select('id, slug, title, created_at, visit_count, last_visited_at, is_active')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <AdminDashboard
      contacts={contacts ?? []}
      comments={comments ?? []}
      sharedPages={sharedPages ?? []}
      userEmail={user.email ?? ''}
    />
  );
}
