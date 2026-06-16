import { caseTabs } from '@/lib/content';

export function CaseTabs() {
  // Vadim: 5 categories is plenty — show them all explicitly, no edge fade that
  // makes the last tab look cut off. Wrap to a second row only if they don't fit.
  return (
    <div className="nums mx-auto flex max-w-[861px] flex-wrap items-center justify-center gap-[8px]">
      {caseTabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          className={`flex h-[48px] shrink-0 items-center gap-[8px] rounded-pill px-[20px] text-[16px] font-medium tracking-[0.03em] transition ${
            tab.active
              ? 'bg-black text-surface'
              : 'bg-surface text-fg hover:brightness-95'
          }`}
        >
          {tab.label}
          {tab.count != null && <span className="text-fg/50">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
