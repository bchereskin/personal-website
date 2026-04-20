import Image from 'next/image';
import type { Podcast } from '@/app/data/podcasts';

export default function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <a
      href={podcast.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group border border-[var(--rule)] bg-[var(--paper-2)] hover:bg-[var(--paper-3)] transition-colors"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--paper-3)]">
        <Image
          src={podcast.image}
          alt={podcast.title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
          style={podcast.imageFocus ? { objectPosition: podcast.imageFocus } : undefined}
        />
      </div>
      <div className="p-5">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] mb-2">
          {podcast.show}
        </div>
        <h3 className="font-serif text-[22px] font-normal -tracking-[0.01em] leading-[1.2] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors m-0 mb-2">
          {podcast.title}
        </h3>
        <p className="font-serif italic text-[15px] leading-[1.55] text-[var(--ink-3)] m-0">
          {podcast.description}
        </p>
      </div>
    </a>
  );
}
