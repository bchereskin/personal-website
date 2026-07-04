import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/app/lib/supabase-server';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    robots: { index: false, follow: false },
  };
}

export default async function SecurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/secure/login?redirect=/secure/${encodeURIComponent(slug)}`);
  }

  const { data: page } = await supabase
    .from('secure_pages')
    .select('id, title, html_content, is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!page) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--neutral-800)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--neutral-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[var(--neutral-50)] mb-2">Page not available</h1>
          <p className="text-sm text-[var(--neutral-400)] max-w-xs mx-auto">
            This page doesn&apos;t exist or you don&apos;t have access. Contact the owner if you think this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  getAdminSupabase()
    .rpc('increment_secure_page_visits', { page_slug: slug })
    .then(({ error }) => {
      if (error) console.error('Visit increment failed:', error.message);
    });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--neutral-50)]">{page.title}</h1>
          <span className="text-xs text-[var(--neutral-500)] bg-[var(--neutral-800)] px-2 py-1 rounded">
            {user.email}
          </span>
        </div>
        <div
          className="prose prose-invert max-w-none bg-[var(--card-bg)] border border-[var(--neutral-700)] rounded-xl p-6 md:p-8 [&_a]:text-[var(--primary)] [&_a:hover]:text-[var(--primary-light)] [&_h1]:text-[var(--neutral-50)] [&_h2]:text-[var(--neutral-100)] [&_h3]:text-[var(--neutral-200)] [&_p]:text-[var(--neutral-300)] [&_li]:text-[var(--neutral-300)] [&_strong]:text-[var(--neutral-100)] [&_img]:rounded-lg [&_img]:mx-auto"
          dangerouslySetInnerHTML={{ __html: page.html_content }}
        />
      </div>
    </div>
  );
}
