'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { casesIntro } from '@/lib/content';

export function CasesHeadingClient() {
  const { ref, value } = useCountUp<HTMLSpanElement>(casesIntro.titleAccent.count, 1400);

  return (
    <div className="mx-auto max-w-[861px] px-6 text-center">
      <h2 className="text-[52px] font-semibold leading-[0.9] tracking-[-0.01em]">
        <span className="text-[#010101]">{casesIntro.titleBlack}</span>
        <br />
        <span className="text-accent">
          {casesIntro.titleAccent.prefix}
          <span ref={ref} className="nums tabular-nums">
            {value}
          </span>
          {casesIntro.titleAccent.suffix}
        </span>
      </h2>
      <p className="mx-auto mt-[28px] max-w-[753px] text-[19px] leading-[1.4] text-fg">
        {casesIntro.body[0]}
        <br />
        {casesIntro.body[1]} {casesIntro.body[2]}
      </p>
    </div>
  );
}
