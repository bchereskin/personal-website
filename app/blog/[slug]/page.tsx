import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import { posts, getPostBySlug, formatDate } from '../posts';

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-700 transition-colors mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {post.title}
          </h1>

          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-li:text-gray-600">
              {post.content.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('- **')) {
                  const match = trimmed.match(/- \*\*(.+?)\*\*:?\s*(.*)/)
                  if (match) {
                    return (
                      <p key={index} className="ml-4 mb-2">
                        <strong>{match[1]}:</strong> {match[2]}
                      </p>
                    );
                  }
                }
                if (trimmed.startsWith('- ')) {
                  return (
                    <p key={index} className="ml-4 mb-2">
                      • {trimmed.replace('- ', '')}
                    </p>
                  );
                }
                return (
                  <p key={index} className="mb-4">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
