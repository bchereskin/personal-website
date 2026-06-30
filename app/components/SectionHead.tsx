export default function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-7">
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-2.5">
        — {label}
      </div>
      <h2 className="font-serif text-[42px] font-normal m-0 -tracking-[0.015em] leading-[1.1] text-[var(--ink)]">
        {title}
      </h2>
    </div>
  );
}
