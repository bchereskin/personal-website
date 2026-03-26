import { getAdminSupabase } from '@/app/lib/supabase-admin';
import { getSupabase } from '@/app/lib/supabase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  is_published: boolean;
  visit_count: number;
  last_visited_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  is_published: boolean;
  visit_count: number;
  last_visited_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    ...row,
    readTime: row.read_time,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: false });

  return (data ?? []).map(rowToPost);
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  return (data ?? []).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  return data ? rowToPost(data) : null;
}

export async function postExistsBySlug(slug: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .single();

  return !!data;
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('date', { ascending: false })
    .limit(limit);

  if (data && data.length >= limit) return data.map(rowToPost);

  const remaining = limit - (data?.length ?? 0);
  const excludeSlugs = [currentSlug, ...(data?.map(d => d.slug) ?? [])];
  const { data: fallback } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .not('slug', 'in', `(${excludeSlugs.join(',')})`)
    .order('date', { ascending: false })
    .limit(remaining);

  return [...(data ?? []), ...(fallback ?? [])].map(rowToPost);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
