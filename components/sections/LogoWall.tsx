'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { clients } from '@/lib/content';
import { PixelLogo, type WallLogo } from './PixelLogo';

// The phone (static) variant keeps the original marquee — logos sliding left.
// The animated variants use fixed slots where logos assemble/dissolve in pixels.
const POOL: WallLogo[] = [
  { name: 'Admitad', logo: '/logos/admitad.svg' },
  { name: 'Лукойл', logo: '/logos/lukoil.svg' },
  { name: 'Monte', logo: '/logos/monte.svg' },
  { name: 'Добрый', logo: '/logos/dobry-color.svg' },
  { name: 'Складно', logo: '/logos/skladno.svg' },
  { name: 'Хайс', logo: '/logos/hais-mono.svg' },
  { name: 'ГАЗ', logo: '/logos/gaz.svg' },
  { name: 'Maginary', logo: '/logos/maginary-grunge.svg' },
];

const SLOTS = 7;
const OFFSETS = [0, 2600, 900, 3700, 1500, 3100, 1900];
const rotate = (n: number): WallLogo[] => [...POOL.slice(n % POOL.length), ...POOL.slice(0, n % POOL.length)];
const SLOT_VISIBILITY = [
  '', '', '', '', 'hidden sm:block', 'hidden lg:block', 'hidden lg:block',
];

export function LogoWall() {
  const [marquee, setMarquee] = useState(false);

  useEffect(() => {
    setMarquee(new URLSearchParams(window.location.search).get('bg') === 'phone');
  }, []);

  return (
    <div className="relative z-10 mt-[56px] pb-[24px] sm:mt-[100px]">
      {marquee ? <Marquee /> : <PixelSlots />}
    </div>
  );
}

// original: seamless leftward marquee, white logos
function Marquee() {
  const row = Array.from({ length: 8 }, () => clients).flat();
  return (
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
              className="opacity-80 brightness-0 invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// fixed slots, each cycling logos with a pixel assemble/dissolve
function PixelSlots() {
  return (
    <div className="relative mx-auto flex max-w-page items-center justify-between px-5 sm:px-8 lg:px-[80px]">
      {Array.from({ length: SLOTS }).map((_, i) => (
        <div key={i} className={SLOT_VISIBILITY[i]}>
          <PixelLogo logos={rotate(i * 3)} startDelay={OFFSETS[i] ?? 0} />
        </div>
      ))}
    </div>
  );
}
