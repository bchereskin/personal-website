import { getPublishedPosts } from './posts';
import BlogList from './BlogList';

export const dynamic = 'force-dynamic';

export default async function Blog() {
  const posts = await getPublishedPosts();

  return (
    <BlogList
      posts={posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        readTime: p.readTime,
        category: p.category,
      }))}
    />
  );
}
