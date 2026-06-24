'use client';

import { useMemo, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { caseTabs, type CaseItem } from '@/lib/content';
import { CaseCard } from './CaseCard';

// Tabs + grid live in one client component so the active tab actually filters the
// grid (they used to be two unconnected components — clicking a tab only toggled
// its own highlight). Cases declare which tabs they belong to via `item.tabs`;
// counts are derived from the data here, not hardcoded.

const INITIAL = 4; // first batch shown
const STEP = 2; // "Показать ещё" increment
const ALL = 'Все';

export function CasesExplorer({ cases }: { cases: CaseItem[] }) {
  const [active, setActive] = useState(
    caseTabs.find((t) => t.active)?.label ?? caseTabs[0]?.label ?? ALL,
  );

  // real per-tab counts from the data (ALL = total)
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of caseTabs) {
      m.set(t.label, t.label === ALL ? cases.length : cases.filter((c) => c.tabs?.includes(t.label)).length);
    }
    return m;
  }, [cases]);

  const filtered = active === ALL ? cases : cases.filter((c) => c.tabs?.includes(active));

  return (
    <>
      <div className="nums mx-auto flex max-w-[861px] flex-nowrap items-center justify-start gap-[8px] overflow-x-auto px-5 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {caseTabs.map((tab) => {
          const on = active === tab.label;
          const n = counts.get(tab.label) ?? 0;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(tab.label)}
              aria-pressed={on}
              className={`flex h-[48px] shrink-0 items-center gap-[8px] rounded-pill px-[20px] text-[16px] font-medium tracking-[0.03em] transition ${
                on ? 'bg-black text-surface' : 'bg-surface text-fg hover:brightness-95'
              }`}
            >
              {tab.label}
              {tab.label !== ALL && (
                <span className={on ? 'text-surface/50' : 'text-fg/50'}>{n}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* key on `active` remounts the grid per tab → reveal replays + "Показать ещё"
          resets to the first batch for the new filter. */}
      <CaseGrid key={active} cases={filtered} />
    </>
  );
}

function CaseGrid({ cases }: { cases: CaseItem[] }) {
  const [visible, setVisible] = useState(INITIAL);
  const ref = useReveal<HTMLDivElement>({ stagger: 110, threshold: 0.05 });

  if (cases.length === 0) {
    return (
      <p className="mt-[56px] text-center text-[18px] text-black/45">
        Кейсы этой категории скоро появятся.
      </p>
    );
  }

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
