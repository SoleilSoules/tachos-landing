'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { caseTabs, type CaseItem } from '@/lib/content';
import { CaseCard } from './CaseCard';

// Tabs + grid live in one client component so the active tab actually filters the
// grid (they used to be two unconnected components — clicking a tab only toggled
// its own highlight). Cases declare which tabs they belong to via `item.tabs`;
// counts are derived from the data here, not hardcoded.

const INITIAL = 4; // first batch shown
// One click now reveals the whole second batch (Добрый / Anomalia / IMAST / Alma)
// instead of dribbling them out two at a time.
const STEP = 4; // "Показать еще" increment
const ALL = 'Все';

export function CasesExplorer({ cases }: { cases: CaseItem[] }) {
  const [active, setActive] = useState(
    caseTabs.find((t) => t.active)?.label ?? caseTabs[0]?.label ?? ALL,
  );

  // real per-tab counts from the data (ALL = total)
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of caseTabs) {
      m.set(
        t.label,
        t.label === ALL ? cases.length : cases.filter((c) => c.tabs?.includes(t.label)).length,
      );
    }
    return m;
  }, [cases]);

  // The sliding highlight is positioned from the active button's own box, so it
  // stays correct at any font size / label length / horizontal scroll offset.
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ x: 0, w: 0 });

  const measure = useCallback(() => {
    const el = btnRefs.current[active];
    if (!el) return;
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const filtered = active === ALL ? cases : cases.filter((c) => c.tabs?.includes(active));

  return (
    <>
      {/* One grey track carrying all the filters. The highlight is a single pill
          that SLIDES between tabs instead of jumping — same colour family as the
          track, told apart by its lift (shadow), not by going white. */}
      <div className="flex justify-center px-5 sm:px-0">
        <div
          ref={trackRef}
          className="nums relative flex max-w-full flex-nowrap items-center overflow-x-auto rounded-pill bg-surface2 [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-0 z-0 rounded-pill bg-accent shadow-[0_4px_16px_rgba(240,81,56,0.35)] transition-[transform,width] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: pill.w ? 1 : 0 }}
          />
          {caseTabs.map((tab) => {
            const on = active === tab.label;
            const n = counts.get(tab.label) ?? 0;
            return (
              <button
                key={tab.label}
                ref={(el) => {
                  btnRefs.current[tab.label] = el;
                }}
                type="button"
                onClick={() => setActive(tab.label)}
                aria-pressed={on}
                data-hint="tab"
                data-hint-sub={tab.label}
                className={`relative z-10 flex h-[52px] shrink-0 items-center gap-[8px] rounded-pill px-[22px] text-[16px] font-medium tracking-[0.03em] transition-colors ${
                  on ? 'text-white' : 'text-fg/55 hover:text-fg'
                }`}
              >
                {tab.label}
                {tab.label !== ALL && (
                  <span className={on ? 'text-white/65' : 'text-fg/30'}>{n}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* key on `active` remounts the grid per tab → reveal replays + "Показать еще"
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
            data-hint="more-cases"
            className="w-full max-w-[820px] rounded-[24px] bg-[#141416] px-[64px] py-[26px] text-[17px] font-medium text-white transition hover:bg-black"
          >
            Показать еще
          </button>
        </div>
      )}
    </>
  );
}
