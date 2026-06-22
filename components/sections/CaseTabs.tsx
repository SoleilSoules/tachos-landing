'use client';

import { useState } from 'react';
import { caseTabs } from '@/lib/content';

export function CaseTabs() {
  // Tabs are clickable now (#12). Categories aren't wired to the case data yet
  // (cases have no tab-category field), so this switches the active state; real
  // filtering lands once Vadim's cases are tagged by category.
  const [active, setActive] = useState(
    caseTabs.find((t) => t.active)?.label ?? caseTabs[0]?.label ?? '',
  );

  return (
    <div className="nums mx-auto flex max-w-[861px] flex-wrap items-center justify-center gap-[8px]">
      {caseTabs.map((tab) => {
        const on = active === tab.label;
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
            {tab.count != null && (
              <span className={on ? 'text-surface/50' : 'text-fg/50'}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
