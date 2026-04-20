import Link from 'next/link';
import { BlogPost, formatDate } from '@/app/blog/posts';

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[var(--rule)]">
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-5">
        — Read next
      </div>
      <div>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block py-5 border-t border-[var(--rule)] group"
          >
            <div className="flex justify-between items-baseline mb-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
              <span>{post.category}</span>
              <span>
                {formatDate(post.date)} · {post.readTime}
              </span>
            </div>
            <h3 className="font-serif text-[24px] font-normal m-0 mb-1 -tracking-[0.015em] leading-[1.2] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
            <p className="font-serif italic text-[16px] leading-[1.6] text-[var(--ink-3)] m-0 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
