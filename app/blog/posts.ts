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
  track: string;
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
  track: string;
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

// Main blog / RSS: operator "notes" track only. Technical work lives in The Lab.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('track', 'notes')
    .order('date', { ascending: false });

  return (data ?? []).map(rowToPost);
}

// The Lab: technical / build-in-public track.
export async function getLabPosts(): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('track', 'lab')
    .order('date', { ascending: false });

  return (data ?? []).map(rowToPost);
}

// Every published post regardless of track (used by sitemap).
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
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
    .eq('is_published', true)
    .single();

  return data ? rowToPost(data) : null;
}

export async function postExistsBySlug(slug: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return !!data;
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3, track = 'notes'): Promise<BlogPost[]> {
  const { data } = await getAdminSupabase()
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('track', track)
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
    .eq('track', track)
    .not('slug', 'in', `(${excludeSlugs.join(',')})`)
    .order('date', { ascending: false })
    .limit(remaining);

  return [...(data ?? []), ...(fallback ?? [])].map(rowToPost);
}

export function formatDate(dateString: string): string {
  // Date-only strings parse as UTC midnight; format in UTC so the day doesn't shift
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
