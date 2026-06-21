'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { casesIntro } from '@/lib/content';

export function CasesHeadingClient() {
  const { ref, value } = useCountUp<HTMLSpanElement>(casesIntro.titleAccent.count, 1400);
  // the black line reveals word-by-word; the accent line (with the live counter)
  // rides a block fade-up so the count animation stays intact
  const revealRef = useReveal<HTMLDivElement>({ threshold: 0.12, stagger: 120 });

  return (
    <div ref={revealRef} className="mx-auto max-w-[861px] px-6 text-center">
      <h2 className="text-[52px] font-semibold leading-[0.9] tracking-[-0.01em]">
        <WordsReveal as="span" stagger={52} className="block text-[#010101]">
          {casesIntro.titleBlack}
        </WordsReveal>
        <span className="reveal-hidden block text-accent">
          {casesIntro.titleAccent.prefix}
          <span ref={ref} className="nums tabular-nums">
            {value}
          </span>
          {casesIntro.titleAccent.suffix}
        </span>
      </h2>
      <WordsReveal
        as="p"
        stagger={18}
        start={220}
        className="mx-auto mt-[28px] block max-w-[753px] text-[19px] leading-[1.4] text-fg"
      >
        {casesIntro.body[0]} {casesIntro.body[1]} {casesIntro.body[2]}
      </WordsReveal>
    </div>
  );
}
