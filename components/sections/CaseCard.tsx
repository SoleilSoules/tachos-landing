import Image from 'next/image';
import { asset } from '@/lib/asset';
import type { CaseItem } from '@/lib/content';

// Local UI copy (kept out of content.ts per task scope). The sparkle marks the
// "method" tag (e.g. ML) the way the reference shows "✦ ML".
const SPARKLE = '✦';

// Per-project cover theming. Real case stills come from Vadim later; until then
// each card keeps its own brand-tinted gradient that sits UNDER the cover photo
// — so even if a still is missing the card reads as a distinct project rather
// than an empty box. The photo (item.cover) is layered on top with object-cover.
const TINT: Record<string, string> = {
  skladno: 'from-[#27405a] via-[#16273a] to-[#0b1620]',
  hais: 'from-[#0e5240] via-[#073227] to-[#031a14]',
  maginary: 'from-[#3d2060] via-[#241241] to-[#130a26]',
  dobry: 'from-[#7c3314] via-[#4a1d0b] to-[#250e05]',
};

function ArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseCard({ item }: { item: CaseItem }) {
  const tint = TINT[item.id] ?? TINT.skladno;
  // Tags arrive as [domain, method]; the method pill gets the sparkle prefix.
  const [domainTag, methodTag] = item.tags;

  return (
    <article
      className="group flex flex-col gap-[14px]"
      data-hint={`Кейс: ${item.client}`}
      data-hint-sub={item.tags.join(' · ')}
    >
      <a
        href="#cases"
        aria-label={`Кейс: ${item.client}`}
        className="relative block h-[360px] overflow-hidden rounded-[32px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:-translate-y-[6px] motion-safe:group-hover:scale-[1.012] motion-safe:group-hover:shadow-[0_28px_64px_-16px_rgba(0,0,0,0.45)] sm:h-[420px] sm:rounded-[44px]"
      >
        {/* brand tint fallback layer — sits under the photo */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tint}`} aria-hidden />

        {/* full-bleed cover photo (real still from Vadim; placeholder for now) */}
        <Image
          src={asset(item.cover)}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 668px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
        />

        {/* top + bottom scrims so the glass chips and arrow stay legible on any photo */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25"
          aria-hidden
        />

        {/* inner padded frame for the overlay controls */}
        <div className="relative flex h-full flex-col justify-between p-[24px]">
          {/* top row: frosted avatar circle (left) + frosted dark tag pills (right) */}
          <div className="flex items-start justify-between gap-[12px]">
            <span
              className="size-[56px] shrink-0 rounded-full bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-md"
              aria-hidden
            />
            <div className="flex max-w-[78%] flex-wrap justify-end gap-[8px]">
              <span className="rounded-pill bg-black/30 px-[14px] py-[8px] text-[14px] font-medium tracking-[0.01em] text-white backdrop-blur-md">
                {domainTag}
              </span>
              <span className="inline-flex items-center gap-[6px] rounded-pill bg-black/30 px-[14px] py-[8px] text-[14px] font-medium tracking-[0.01em] text-white backdrop-blur-md">
                <span aria-hidden className="text-white/80">
                  {SPARKLE}
                </span>
                {methodTag}
              </span>
            </div>
          </div>

          {/* bottom row: arrow affordance in a ROUNDED SQUARE (not a circle),
              frosted light fill. Pinned right; nudges up-right on hover.
              motion-safe gates the translate so reduced-motion users see no shift. */}
          <div className="flex justify-end">
            <span className="grid size-[56px] place-items-center rounded-[18px] bg-white/20 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/30 motion-safe:group-hover:translate-x-[3px] motion-safe:group-hover:-translate-y-[3px]">
              <ArrowIcon />
            </span>
          </div>
        </div>
      </a>

      {/* caption/meta — pinned to its own card with a small left inset (#33) */}
      <div className="pl-[6px] pr-[10px]">
        <p className="text-[18px] font-medium tracking-[0.02em] text-black/50">{item.client}</p>
        <p className="mt-[6px] text-[22px] font-medium leading-[1.22] text-black sm:text-[26px]">
          {item.desc.lead && <>{item.desc.lead} </>}
          {/* #31: accent underlay gets real padding + tag radius, cloned across
              line wraps so each line keeps rounded corners. .nums for figures. */}
          <span className="nums box-decoration-clone rounded-tag bg-accent px-[8px] py-[2px] text-white">
            {item.desc.highlight}
          </span>
          {item.desc.tail && <> {item.desc.tail}</>}
        </p>
      </div>
    </article>
  );
}
