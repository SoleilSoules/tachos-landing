'use client';

import { useReveal } from '@/hooks/useReveal';
import { hero } from '@/lib/content';
import { HeroPrompt } from './HeroPrompt';

export function Hero() {
  const ref = useReveal<HTMLDivElement>({ stagger: 90, rootMargin: '0px' });

  return (
    <div
      ref={ref}
      className="relative z-10 flex flex-col items-center px-6 pt-[249px] text-center"
    >
      <h1 className="reveal-hidden max-w-[966px] text-[82px] font-medium leading-[0.9] tracking-[-0.02em] text-inverted">
        {hero.title[0]}
        <br />
        {hero.title[1]}
      </h1>

      <p className="reveal-hidden mt-[28px] max-w-[548px] text-[18px] leading-[1.2] text-inverted/90">
        <span className="text-accent-warm">{hero.subhead.lead}</span>{' '}
        {hero.subhead.rest}
      </p>

      <div className="reveal-hidden">
        <HeroPrompt />
      </div>
    </div>
  );
}
