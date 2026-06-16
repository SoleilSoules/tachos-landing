import Image from 'next/image';
import { asset } from '@/lib/asset';
import { clients } from '@/lib/content';

// Seamless leftward marquee. The row is repeated 8× so that one half (the loop
// unit the -50% animation travels, ≈4 sets ≈ 4800px) always exceeds the viewport
// — even on a 4K/ultrawide screen — so no empty gap ever opens at the loop point
// and the reset is invisible. Duration scales with width to keep the same visual
// speed. Pauses for prefers-reduced-motion.
export function LogoWall() {
  const row = Array.from({ length: 8 }, () => clients).flat();

  return (
    <div className="relative z-10 mt-[120px]">
      {/* dark scrim: keeps the white logos legible where the row crosses the
          bright hero mockup, so the line never visually breaks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[150px] -translate-y-1/2"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(4,4,4,0.55) 28%, rgba(4,4,4,0.55) 72%, transparent)',
        }}
      />
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max items-center gap-[72px] pr-[72px] [animation:logo-marquee_76s_linear_infinite] motion-reduce:[animation:none]">
          {row.map((client, i) => (
            <div key={i} className="shrink-0">
              <Image
                src={asset(client.logo)}
                alt={client.name}
                width={180}
                height={client.height}
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
