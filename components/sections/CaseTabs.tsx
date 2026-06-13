import { caseTabs } from '@/lib/content';

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m12 2 2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.8 5.9 20.3 7.3 13.6l-5-4.6 6.8-.8L12 2Z" />
    </svg>
  );
}

export function CaseTabs() {
  return (
    <div className="nums relative mx-auto flex max-w-[861px] items-center gap-[8px] overflow-hidden">
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
          {tab.icon === 'star' && <StarIcon />}
          {tab.label}
          {tab.count != null && <span className="text-fg/50">{tab.count}</span>}
        </button>
      ))}
      {/* fade-out at the right edge, matching the Figma overflow gradient */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[110px] bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
