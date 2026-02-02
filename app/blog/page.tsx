import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { posts, formatDate } from './posts';

export default function Blog() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-700 mb-12">
            Thoughts on leadership, operations, and building great companies.
          </p>

          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
