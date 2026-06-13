import Image from 'next/image';
import { asset } from '@/lib/asset';
import { clients } from '@/lib/content';

// Seamless leftward marquee: the row is rendered twice so a -50% translate
// loops without a seam. Pauses for prefers-reduced-motion.
export function LogoWall() {
  const row = [...clients, ...clients];

  return (
    <div className="relative z-10 mt-[120px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex w-max items-center gap-[72px] pr-[72px] [animation:logo-marquee_38s_linear_infinite] motion-reduce:[animation:none]">
        {row.map((client, i) => (
          <div key={i} className="shrink-0">
            <Image
              src={asset(client.logo)}
              alt={client.name}
              width={180}
              height={client.height}
              style={{ height: client.height, width: 'auto' }}
              className="opacity-50 brightness-0 invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
