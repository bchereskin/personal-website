'use client';

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'model'; text: string }
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

export function RenderBold({ text }: { text: string }) {
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

export function BlogContentRenderer({ content, isPreview }: { content: string; isPreview?: boolean }) {
  const blocks = parseContent(content);
  const firstParaIndex = blocks.findIndex(b => b.type === 'p');

  return (
    <div>
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

        const isLead = !isPreview && index === firstParaIndex;
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
    </div>
  );
}
