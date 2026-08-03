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
      <h2 className="text-[clamp(29px,6.4vw,52px)] font-semibold leading-[0.95] tracking-[-0.01em] lg:leading-[0.9]">
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
      {/* sub-head under the heading removed per Гоша — the tabs follow directly */}
    </div>
  );
}
