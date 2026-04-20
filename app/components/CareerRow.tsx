import type { CareerItem } from '@/app/data/career';

export default function CareerRow({ item }: { item: CareerItem }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-7 py-5 border-t border-[var(--rule)] items-baseline">
      <div
        className="font-mono text-[11px] tracking-[0.14em]"
        style={{ color: item.current ? 'var(--accent)' : 'var(--ink-4)' }}
      >
        {item.range}
      </div>
      <div>
        <div className="font-serif text-[20px] -tracking-[0.01em] text-[var(--ink)]">
          {item.role}{' '}
          <span className="italic text-[var(--ink-3)]">at {item.org}</span>
        </div>
        <p className="font-serif text-base leading-[1.6] text-[var(--ink-3)] mt-1.5 m-0">
          {item.body}
        </p>
      </div>
    </div>
  );
}
