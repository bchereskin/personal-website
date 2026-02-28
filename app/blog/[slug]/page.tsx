import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import CommentsSection from '@/app/components/CommentsSection';
import { posts, getPostBySlug, formatDate } from '../posts';

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `https://www.brettchereskin.com/blog/${post.slug}`,
    },
  };
}

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'model'; text: string }
  | { type: 'bullets'; items: string[] };

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
      i++;
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) });
      i++;
    } else if (line.startsWith('[CALLOUT]')) {
      blocks.push({ type: 'callout', text: line.slice(9).trim() });
      i++;
    } else if (line.startsWith('[MODEL]')) {
      blocks.push({ type: 'model', text: line.slice(7).trim() });
      i++;
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: 'bullets', items });
    } else {
      blocks.push({ type: 'p', text: line });
      i++;
    }
  }

  return blocks;
}

function RenderBold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-[var(--neutral-100)] font-semibold">{part}</strong>
          : part
      )}
    </>
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const blocks = parseContent(post.content);
  const firstParaIndex = blocks.findIndex(b => b.type === 'p');

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">

        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070"
              alt="Writing"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors mb-8 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--neutral-500)] mb-5 animate-fade-in-up">
              <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] leading-[1.15] animate-fade-in-up delay-100">
              {post.title}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24">
          <article className="max-w-2xl mx-auto animate-fade-in-up delay-200">

            {blocks.map((block, index) => {

              if (block.type === 'h2') {
                return (
                  <h2 key={index} className="text-xl font-bold text-[var(--primary)] mt-14 mb-5 pl-4 border-l-2 border-[var(--accent)]">
                    {block.text}
                  </h2>
                );
              }

              if (block.type === 'h3') {
                return (
                  <h3 key={index} className="text-base font-semibold text-[var(--neutral-100)] uppercase tracking-wider mt-8 mb-3">
                    {block.text}
                  </h3>
                );
              }

              if (block.type === 'callout') {
                return (
                  <blockquote key={index} className="border-l-2 border-[var(--primary)] pl-5 my-8 text-[var(--neutral-200)] text-[17px] leading-[1.8] italic">
                    <RenderBold text={block.text} />
                  </blockquote>
                );
              }

              if (block.type === 'model') {
                const [name, ...rest] = block.text.split('|').map(s => s.trim());
                const details = rest.join('|');
                return (
                  <div key={index} className="rounded-xl p-5 mb-4 border border-[var(--neutral-700)] bg-[var(--background)]">
                    <h4 className="font-bold text-[var(--primary)] mb-2 text-sm">{name}</h4>
                    <p className="text-[var(--neutral-400)] text-sm leading-relaxed"><RenderBold text={details} /></p>
                  </div>
                );
              }

              if (block.type === 'bullets') {
                return (
                  <ul key={index} className="mb-7 space-y-2.5">
                    {block.items.map((item, i) => {
                      const boldMatch = item.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
                      return (
                        <li key={i} className="flex items-start gap-3 text-[var(--neutral-300)] leading-[1.75] text-[17px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[0.65em] flex-shrink-0" />
                          <span>
                            {boldMatch
                              ? <><strong className="text-[var(--neutral-100)]">{boldMatch[1]}</strong>{boldMatch[2] ? `: ${boldMatch[2]}` : ''}</>
                              : <RenderBold text={item} />
                            }
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              // Paragraph — first one gets lead treatment
              const isLead = index === firstParaIndex;
              return (
                <p
                  key={index}
                  className={
                    isLead
                      ? 'text-[19px] leading-[1.8] text-[var(--neutral-100)] mb-8 font-[450]'
                      : 'text-[17px] leading-[1.8] text-[var(--neutral-300)] mb-7'
                  }
                >
                  <RenderBold text={block.text} />
                </p>
              );
            })}

            <div className="mt-14 pt-8 border-t border-[var(--neutral-700)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 transition-opacity text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all posts
              </Link>
            </div>

            <CommentsSection slug={slug} />
          </article>
        </section>

      </main>
      <Footer />
    </>
  );
}
