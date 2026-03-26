import Link from 'next/link';
import { BlogPost, formatDate } from '@/app/blog/posts';

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[var(--neutral-700)] font-sans">
      <h2 className="text-xl font-bold text-[var(--neutral-50)] mb-6">Read Next</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] transition-colors"
          >
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                {post.category}
              </span>
              <span className="text-[var(--neutral-500)] font-mono">{formatDate(post.date)}</span>
              <span className="text-[var(--neutral-600)]">/</span>
              <span className="text-[var(--neutral-500)] font-mono">{post.readTime}</span>
            </div>
            <h3 className="text-[var(--neutral-100)] group-hover:text-[var(--primary)] transition-colors font-semibold leading-snug">
              {post.title}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--neutral-400)] line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
