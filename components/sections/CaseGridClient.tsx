'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import type { CaseItem } from '@/lib/content';
import { CaseCard } from './CaseCard';

// Show a first batch of 4, then load the rest in steps of 2 via "Показать ещё".
const INITIAL = 4;
const STEP = 2;

export function CaseGridClient({ cases }: { cases: CaseItem[] }) {
  const [visible, setVisible] = useState(INITIAL);
  const ref = useReveal<HTMLDivElement>({ stagger: 110, threshold: 0.05 });

  const shown = cases.slice(0, visible);
  const hasMore = visible < cases.length;

  return (
    <>
      <div
        ref={ref}
        className="mt-[40px] grid grid-cols-1 gap-x-[24px] gap-y-[40px] sm:grid-cols-2 sm:gap-y-[64px]"
      >
        {shown.map((item, i) => (
          // First batch reveals on scroll (useReveal watches .reveal-hidden); cards
          // loaded later mount after the observer ran, so they just fade up on add.
          <div
            key={item.id}
            className={
              i < INITIAL
                ? 'reveal-hidden'
                : '[animation:fade-up_0.5s_ease-out_both] motion-reduce:[animation:none]'
            }
          >
            <CaseCard item={item} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-[48px] flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="rounded-pill border border-black/15 px-[30px] py-[15px] text-[16px] font-medium text-fg transition hover:bg-black hover:text-white"
          >
            Показать ещё
          </button>
        </div>
      )}
    </>
  );
}
