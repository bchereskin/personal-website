import Image from 'next/image';

export default function PhotoFrame({
  src,
  alt,
  aspect = '3/4',
  sizes = '(max-width: 768px) 100vw, 280px',
  priority = false,
  grayscale = false,
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  grayscale?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]"
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={grayscale ? { filter: 'grayscale(1) contrast(1.05)' } : undefined}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 40px rgba(26, 24, 20, 0.18)' }}
      />
    </div>
  );
}
