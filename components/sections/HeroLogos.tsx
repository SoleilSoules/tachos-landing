import Image from 'next/image';
import { asset } from '@/lib/asset';
import { clients } from '@/lib/content';

// Client proof in the hero's bottom-right corner: ONE marquee row drifting
// LEFT → RIGHT, edges feathered so logos fade in and out instead of being cut.
// The strip is duplicated and animated over exactly half its width, which makes
// the loop seamless.
export function HeroLogos() {
  const strip = [...clients, ...clients];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_88%,transparent)]">
      <div className="flex w-max items-center gap-[54px] pr-[54px] [animation:logo-marquee_38s_linear_infinite_reverse] motion-reduce:[animation:none]">
        {strip.map((client, i) => (
          <Image
            key={`${client.name}-${i}`}
            src={asset(client.logo)}
            alt={client.name}
            width={180}
            height={client.height}
            draggable={false}
            loading="eager"
            style={{ height: client.height * 1.18, width: 'auto' }}
            className="max-w-none shrink-0 object-contain brightness-0 invert"
          />
        ))}
      </div>
    </div>
  );
}
