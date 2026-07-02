'use client';

import Image from 'next/image';

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'model'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'bullets'; items: string[] };

export function parseContent(content: string): Block[] {
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
    } else if (line.startsWith('[IMAGE]')) {
      const parts = line.slice(7).trim().split('|').map(s => s.trim());
      blocks.push({
        type: 'image',
        src: parts[0],
        alt: parts[1] || '',
        caption: parts[2] || undefined,
      });
      i++;
    } else if (line.startsWith('[QUOTE]')) {
      const parts = line.slice(7).trim().split('|').map(s => s.trim());
      blocks.push({
        type: 'quote',
        text: parts[0],
        attribution: parts[1] || undefined,
      });
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

export function RenderInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|\*[^*\s][^*]*\*|\[.+?\]\(.+?\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*(.+?)\*\*$/);
        if (boldMatch) {
          return (
            <strong key={i} className="text-[var(--ink)] font-semibold">
              {boldMatch[1]}
            </strong>
          );
        }
        const italicMatch = part.match(/^\*([^*]+)\*$/);
        if (italicMatch) {
          return <em key={i}>{italicMatch[1]}</em>;
        }
        const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith('http');
          return (
            <a
              key={i}
              href={linkMatch[2]}
              className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/40 hover:decoration-[var(--accent)] transition-colors"
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {linkMatch[1]}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

export const RenderBold = RenderInline;

export function BlogContentRenderer({ content, isPreview }: { content: string; isPreview?: boolean }) {
  const blocks = parseContent(content);
  const firstParaIndex = blocks.findIndex(b => b.type === 'p');

  return (
    <div className="font-serif">
      {blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={index}
              className="font-serif text-[30px] font-normal -tracking-[0.015em] leading-[1.2] text-[var(--ink)] mt-14 mb-5"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={index}
              className="font-serif text-[22px] font-normal -tracking-[0.01em] leading-[1.25] text-[var(--ink)] mt-10 mb-4"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === 'callout') {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-[var(--accent)] pl-5 my-8 font-serif italic text-[18px] leading-[1.7] text-[var(--ink-2)]"
            >
              <RenderBold text={block.text} />
            </blockquote>
          );
        }

        if (block.type === 'model') {
          const [name, ...rest] = block.text.split('|').map(s => s.trim());
          const details = rest.join('|');
          return (
            <div
              key={index}
              className="rounded-none p-5 mb-4 border border-[var(--rule)] bg-[var(--paper-2)] font-sans"
            >
              <h4 className="font-sans font-semibold text-[var(--accent)] mb-2 text-sm uppercase tracking-[0.12em]">
                {name}
              </h4>
              <p className="text-[var(--ink-3)] text-sm leading-relaxed">
                <RenderBold text={details} />
              </p>
            </div>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={index} className="my-10">
              <div className="relative w-full aspect-[16/9] overflow-hidden border border-[var(--rule)]">
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 760px"
                />
              </div>
              {block.caption && (
                <figcaption className="mt-3 text-center text-sm italic text-[var(--ink-4)] font-serif">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={index} className="my-12 pl-6 border-l-2 border-[var(--accent)]">
              <p className="font-serif italic text-[22px] leading-[1.55] text-[var(--ink)]">
                {block.text}
              </p>
              {block.attribution && (
                <cite className="block mt-3 text-sm font-mono not-italic uppercase tracking-[0.14em] text-[var(--ink-4)]">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }

        if (block.type === 'bullets') {
          return (
            <ul key={index} className="mb-7 space-y-2.5 list-none p-0">
              {block.items.map((item, i) => {
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-serif text-[18px] leading-[1.7] text-[var(--ink-2)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[0.7em] flex-shrink-0" />
                    <span>
                      <RenderInline text={item} />
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        const isLead = !isPreview && index === firstParaIndex;
        return (
          <p
            key={index}
            className={
              isLead
                ? 'font-serif italic text-[22px] leading-[1.55] text-[var(--ink)] mb-8'
                : 'font-serif text-[18px] leading-[1.7] text-[var(--ink-2)] mb-6'
            }
          >
            <RenderBold text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
