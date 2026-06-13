'use client';

import { useReveal } from '@/hooks/useReveal';
import type { CaseItem } from '@/lib/content';
import { CaseCard } from './CaseCard';

export function CaseGridClient({ cases }: { cases: CaseItem[] }) {
  const ref = useReveal<HTMLDivElement>({ stagger: 110, threshold: 0.05 });

  return (
    <div
      ref={ref}
      className="mt-[40px] grid grid-cols-2 gap-x-[24px] gap-y-[50px]"
    >
      {cases.map((item) => (
        <div key={item.id} className="reveal-hidden">
          <CaseCard item={item} />
        </div>
      ))}
    </div>
  );
}
