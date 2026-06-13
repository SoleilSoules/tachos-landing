import Image from 'next/image';
import { asset } from '@/lib/asset';
import type { CaseItem } from '@/lib/content';

// Per-project cover theming. Real case stills come from Vadim later; until then
// each card gets its own brand-tinted gradient + the project's logo (instead of
// the shared S7 placeholder), so cards read as distinct projects.
const THEME: Record<string, { grad: string; logo: string }> = {
  skladno: { grad: 'from-[#27405a] via-[#16273a] to-[#0b1620]', logo: '/logos/skladno.svg' },
  hais: { grad: 'from-[#0e5240] via-[#073227] to-[#031a14]', logo: '/logos/hais-mono.svg' },
  maginary: { grad: 'from-[#3d2060] via-[#241241] to-[#130a26]', logo: '/logos/maginary-grunge.svg' },
  dobry: { grad: 'from-[#7c3314] via-[#4a1d0b] to-[#250e05]', logo: '/logos/dobry-color.svg' },
};

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
  const theme = THEME[item.id] ?? THEME.skladno;

  return (
    <article className="group flex flex-col gap-[20px]">
      <div
        className={`relative h-[420px] overflow-hidden rounded-card bg-gradient-to-br p-[32px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] ${theme.grad}`}
      >
        {/* oversized faded logo as cover art */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Image
            src={asset(theme.logo)}
            alt=""
            width={460}
            height={140}
            className="w-[62%] opacity-[0.08] brightness-0 invert"
          />
        </div>

        {/* top row: project logo avatar + tags */}
        <div className="relative flex items-start justify-between">
          <span className="grid size-[60px] shrink-0 place-items-center rounded-full bg-white/10 p-[14px] backdrop-blur-md">
            <Image
              src={asset(theme.logo)}
              alt={item.client}
              width={64}
              height={24}
              style={{ height: 'auto', width: '100%' }}
              className="object-contain brightness-0 invert"
            />
          </span>
          <div className="flex max-w-[286px] flex-wrap justify-end gap-[8px]">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-tag bg-black/20 px-[12px] py-[9px] text-[14px] font-medium tracking-[0.03em] text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* arrow affordance, bottom-right */}
        <div className="absolute bottom-[32px] right-[32px] flex size-[60px] items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-white/30">
          <ArrowIcon />
        </div>
      </div>

      <div className="pl-[8px]">
        <p className="text-[18px] font-medium tracking-[0.04em] text-black/50">{item.client}</p>
        <p className="mt-[8px] text-[26px] font-medium leading-[1.2] text-black">
          {item.desc.lead && <>{item.desc.lead} </>}
          <span className="box-decoration-clone bg-accent px-[2px] text-white">
            {item.desc.highlight}
          </span>
          {item.desc.tail && <> {item.desc.tail}</>}
        </p>
      </div>
    </article>
  );
}
