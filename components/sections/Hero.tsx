'use client';

import { useReveal } from '@/hooks/useReveal';
import { hero } from '@/lib/content';
import { HeroPrompt } from './HeroPrompt';

export function Hero() {
  const ref = useReveal<HTMLDivElement>({ stagger: 90, rootMargin: '0px' });

  return (
    <div
      ref={ref}
      className="relative z-10 flex flex-col items-center px-6 pt-[208px] text-center"
    >
      <h1 className="reveal-hidden max-w-[966px] select-none text-[82px] font-medium leading-[0.9] tracking-[-0.02em] text-inverted">
        {hero.title[0]}
        <br />
        {hero.title[1]}
      </h1>

      <p className="reveal-hidden mt-[28px] max-w-[760px] select-none text-[19px] leading-[1.4] text-inverted [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]">
        <span className="font-medium text-accent-warm">{hero.subhead.lead}</span>{' '}
        {hero.subhead.rest}
      </p>

      <div className="reveal-hidden">
        <HeroPrompt />
      </div>

      {/* No text scroll-hint here — after 6s idle on the hero the mascot
          (CursorCompanion) stands in at the bottom-centre and says «листайте вниз». */}
    </div>
  );
}
