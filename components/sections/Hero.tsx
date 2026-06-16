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

      <p className="reveal-hidden mt-[28px] max-w-[560px] text-[19px] leading-[1.4] text-inverted [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]">
        <span className="font-medium text-accent-warm">{hero.subhead.lead}</span>{' '}
        {hero.subhead.rest}
      </p>

      <div className="reveal-hidden">
        <HeroPrompt />
      </div>

      {/* scroll affordance — Vadim: on the first screen it should be clear you
          can scroll down to the cases below */}
      <a
        href="#cases"
        aria-label="Листайте вниз — наши кейсы"
        className="reveal-hidden mt-[56px] flex flex-col items-center gap-[6px] text-[12px] uppercase tracking-[0.14em] text-inverted/45 transition hover:text-inverted/80"
      >
        Листайте вниз
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="animate-bounce motion-reduce:animate-none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
