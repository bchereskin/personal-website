import Link from 'next/link';

export type PostRowData = {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
};

export default function PostRow({ post }: { post: PostRowData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block py-6 border-t border-[var(--rule)] group"
    >
      <div className="flex justify-between items-baseline mb-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
        <span>{post.category}</span>
        <span>
          {post.date} · {post.readTime}
        </span>
      </div>
      <h3 className="font-serif text-[28px] font-normal m-0 mb-1.5 -tracking-[0.015em] leading-[1.2] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
        {post.title}
      </h3>
      <p className="font-serif italic text-[17px] leading-[1.6] text-[var(--ink-3)] m-0">
        {post.excerpt}
      </p>
    </Link>
  );
}
