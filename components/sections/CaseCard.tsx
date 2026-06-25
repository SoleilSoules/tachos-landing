import Link from 'next/link';
import { CaseCover } from '@/components/CaseCover';
import type { CaseItem } from '@/lib/content';

// Local UI copy (kept out of content.ts per task scope). The sparkle marks the
// "method" tag (e.g. ML) the way the reference shows "✦ ML".
const SPARKLE = '✦';

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
  // Tags arrive as [domain, method]; the method pill gets the sparkle prefix.
  const [domainTag, methodTag] = item.tags;

  return (
    <article
      className="group flex flex-col gap-[14px]"
      data-hint={`Кейс: ${item.client}`}
      data-hint-sub={item.tags.join(' · ')}
    >
      <Link
        href={`/cases/${item.id}`}
        aria-label={`Кейс: ${item.client}`}
        className="relative block h-[360px] overflow-hidden rounded-[32px] shadow-none transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:-translate-y-[6px] motion-safe:group-hover:scale-[1.012] group-hover:shadow-[0_28px_64px_-16px_rgba(0,0,0,0.45)] sm:h-[420px] sm:rounded-[44px]"
      >
        {/* generated brand cover (real stills come from Vadim later) */}
        <CaseCover
          id={item.id}
          client={item.client}
          shot={item.shot}
          shotKind={item.shotKind}
          mockupVideo={item.mockupVideo}
          variant="card"
          className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
        />

        {/* inner padded frame for the overlay controls — absolute so it overlays the
            cover (in flow it stacked after the cover and got clipped → tags vanished) */}
        <div className="absolute inset-0 flex flex-col justify-between p-[24px]">
          {/* top row: client logo plate (left) + frosted tag pills (right), per Figma —
              light frosted glass (black/25 + heavy blur), roomy padding, soft 22px
              radius, accent-coloured sparkle. */}
          <div className="flex items-start justify-between gap-[12px]">
            <span className="grid size-[44px] shrink-0 place-items-center rounded-full bg-black/25 text-[16px] font-semibold text-white backdrop-blur-md">
              {item.client.trim().charAt(0)}
            </span>
            <div className="flex max-w-[80%] flex-wrap justify-end gap-[10px]">
              <span className="rounded-[14px] bg-black/25 px-[13px] py-[8px] text-[13px] font-medium tracking-[0.01em] text-white backdrop-blur-md">
                {domainTag}
              </span>
              <span className="inline-flex items-center gap-[7px] rounded-[14px] bg-black/25 px-[13px] py-[8px] text-[13px] font-medium tracking-[0.01em] text-white backdrop-blur-md">
                <span
                  aria-hidden
                  className="bg-gradient-to-br from-[#ff8a3c] via-[#ff4d6d] to-[#8b5cff] bg-clip-text text-transparent"
                >
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
            <span className="grid size-[56px] place-items-center rounded-[20px] bg-black/25 text-white backdrop-blur-xl transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-black/35 motion-safe:group-hover:-translate-y-[3px] motion-safe:group-hover:translate-x-[3px]">
              <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>

      {/* caption/meta — pinned to its own card with a small left inset (#33).
          Client name sits grey above the description (restored). */}
      <div className="pl-[6px] pr-[10px]">
        <p className="mb-[8px] text-[17px] font-medium text-black/40">{item.client}</p>
        <p className="text-[22px] font-medium leading-[1.22] text-black sm:text-[26px]">
          {item.desc.lead && <>{item.desc.lead} </>}
          {/* #31: accent underlay gets real padding + tag radius, cloned across
              line wraps so each line keeps rounded corners. .nums for figures. */}
          <span className="nums rounded-tag bg-accent box-decoration-clone px-[8px] py-[2px] text-white">
            {item.desc.highlight}
          </span>
          {item.desc.tail && <> {item.desc.tail}</>}
        </p>
      </div>
    </article>
  );
}
