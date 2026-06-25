import Image from 'next/image';
import { asset } from '@/lib/asset';
import { clients } from '@/lib/content';

// Seamless leftward marquee right under the hero prompt. It sits over the dark
// lower part of the device mockup, so a *soft* dark wash (much gentler than the old
// hard scrim) keeps the white logos legible without a heavy black band. The row is
// repeated 8× so the -50% loop unit always exceeds any viewport — even 4K — and the
// reset stays invisible. Pauses for prefers-reduced-motion.
export function LogoWall() {
  const row = Array.from({ length: 8 }, () => clients).flat();

  return (
    <div className="relative z-10 mt-[56px] pb-[24px] sm:mt-[100px]">
      {/* gentle dark wash, feathered top & bottom — just enough contrast for the
          white logos, not a hard black band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[116px] -translate-y-1/2"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(4,4,4,0.34) 38%, rgba(4,4,4,0.34) 62%, transparent)',
        }}
      />
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max items-center gap-[44px] pr-[44px] [animation:logo-marquee_76s_linear_infinite] motion-reduce:[animation:none] sm:gap-[72px] sm:pr-[72px]">
          {row.map((client, i) => (
            <div key={i} className="shrink-0">
              <Image
                src={asset(client.logo)}
                alt={client.name}
                width={180}
                height={client.height}
                draggable={false}
                loading="eager"
                style={{ height: client.height, width: 'auto' }}
                className="opacity-80 brightness-0 invert transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
