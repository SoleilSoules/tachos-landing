'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { useReveal } from '@/hooks/useReveal';
import { products, productsIntro } from '@/lib/content';

// How long each product stays active before the carousel advances.
const SLIDE_MS = 5000;

// Per-product device mockup. Only doki has a real screen so far; hub/bali show
// the glassy panel + glow without a tablet until Vadim provides their shots.
const MOCKUPS: Record<string, { src: string; alt: string } | undefined> = {
  doki: { src: '/figma/doki-mockup.png', alt: 'Интерфейс doki на планшете' },
};

// Resting look of a card by its depth in the deck (0 = top/active). Each card
// behind the top sits a little lower, smaller, rotated and dimmed — a fanned
// stack you can "deal" from. WHY a lookup not a formula: only ~3 products, so
// hand-tuned offsets read better than linear math at this scale.
const REST: { y: number; scale: number; opacity: number; rot: number }[] = [
  { y: 0, scale: 1, opacity: 1, rot: 0 }, // top, flat — the active product
  { y: -34, scale: 0.95, opacity: 0.55, rot: 1.6 }, // peeks above, tilted right
  { y: -62, scale: 0.9, opacity: 0.4, rot: -1.6 }, // deepest, tilted left
];

// Switcher card (Figma style): icon + name + tagline, with the active card
// filling left-to-right in accent as a progress timer that auto-advances.
function ProductSwitcher({
  index,
  progress,
  onPick,
}: {
  index: number;
  progress: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-[24px] flex flex-row items-stretch justify-center gap-[8px] lg:mt-[20px] lg:gap-[14px]">
      {products.map((p, i) => {
        // separate pills (no overlap, Figma): the active one goes accent and fills
        // left-to-right as the auto-advance timer runs.
        const isActive = i === index;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(i)}
            aria-current={isActive}
            className={`relative flex h-[64px] min-w-0 flex-1 items-center gap-[10px] overflow-hidden rounded-[16px] border px-[10px] text-left transition-colors duration-500 lg:max-w-[300px] lg:gap-[12px] ${
              isActive ? 'border-accent/40 bg-accent text-white' : 'border-white/10 bg-white/[0.06] text-white'
            }`}
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-white/15"
                style={{ width: `${progress}%` }}
              />
            )}
            {/* lettermark placeholder (no blue 3rd-party glyph) — real product
                logos from Vadim later (#23). */}
            <span
              className={`relative grid size-[44px] shrink-0 place-items-center rounded-[12px] text-[18px] font-semibold text-white ${
                isActive ? 'bg-black/25' : 'bg-white/10'
              }`}
            >
              {p.name.charAt(0)}
            </span>
            <span className="relative min-w-0">
              <span className="block text-[16px] font-medium leading-[1.15] text-white">
                {p.name}
              </span>
              <span className="block truncate text-[14px] leading-[1.2] text-white/65">
                {p.tagline}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Products() {
  const count = products.length;
  // `index` = active product; `prev` = the one we just dealt away. They live in
  // ONE state object so both update in the same commit — otherwise the leaving
  // card would snap to the back for a frame before the fly-out keyframe kicks
  // in (a two-render glitch). prev === index means "no transition in flight".
  const [view, setView] = useState({ index: 0, prev: 0 });
  const { index } = view;
  const [progress, setProgress] = useState(0);
  const ref = useReveal<HTMLDivElement>({ threshold: 0.15, rootMargin: '-40px 0px' });

  // Switch products from the small switcher; ignore re-picking the active one.
  const pick = (next: number) =>
    setView((v) => (v.index === next ? v : { index: next, prev: v.index }));

  // Only run the autoplay timer while the section is on screen — otherwise the
  // rAF loop drives setState ~60×/sec for the whole page lifetime, off-screen.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '0px 0px -10% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  // Drive the active card's fill; advance to the next product on completion.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100);
      return;
    }
    setProgress(0);
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(((now - start) / SLIDE_MS) * 100, 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setView((v) => ({ index: (v.index + 1) % count, prev: v.index }));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, count, inView]);

  return (
    <section id="products" className="overflow-hidden bg-bg pt-[64px] pb-[80px] text-inverted lg:pt-[130px] lg:pb-[150px]">
      <h2 className="mx-auto max-w-[1000px] px-6 text-center text-[clamp(30px,8vw,52px)] font-semibold leading-[1.05] tracking-[-0.01em] lg:leading-[1.0]">
        {productsIntro.titleLead}
        <br />
        <span className="text-white/30">{productsIntro.titleMuted}</span>
      </h2>

      <div ref={ref} className="mx-auto mt-[56px] max-w-[1080px] px-5 sm:px-6 lg:mt-[120px]">
        {/* Deck stage: every product is a full panel stacked here; the active one
            sits flat on top, the rest fan out behind it. Height is fixed so the
            absolutely-positioned cards reserve layout. */}
        <div className="reveal-hidden relative h-[420px] lg:h-[540px]">
          {products.map((p, i) => {
            // Cyclic depth: 0 = active/top, then the upcoming products peek behind.
            // As `index` advances the whole deck rotates, so a switch reads as
            // dealing the top card to the back of the stack.
            const depth = (i - index + count) % count;
            const rest = REST[Math.min(depth, REST.length - 1)];
            const isActive = depth === 0;
            const mockup = MOCKUPS[p.id];

            // Cards simply CSS-transition between their resting slots as the deck
            // rotates — a clean "deal to the back of the stack" without a fragile
            // keyframe flight. Stable key so the card animates rather than remounts.
            const restStyle = {
              transform: `translate3d(0, ${rest.y}px, 0) scale(${rest.scale}) rotate(${rest.rot}deg)`,
              opacity: rest.opacity,
              zIndex: count - depth,
            } as const;

            return (
              <div
                key={p.id}
                aria-hidden={!isActive}
                style={restStyle}
                className="absolute inset-0 origin-top transform-gpu transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:!transition-none"
              >
                {/* Clipped panel: rounded body with text/CTA. overflow-hidden keeps
                    the glow + rounding tidy; the tablet lives OUTSIDE it (sibling)
                    so it can bleed past the top edge like Figma. */}
                <div data-hint="Наш продукт" data-hint-sub={p.name} className="relative h-full overflow-hidden rounded-[40px] border border-[#8d8d8d]/35 bg-white/[0.06] backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.45)] [clip-path:inset(0_round_40px)]">
                  {/* warm glow behind the device */}
                  <div className="pointer-events-none absolute -right-[40px] top-1/2 h-[560px] w-[600px] -translate-y-1/2 rounded-full bg-accent/25 blur-[150px]" />

                  {/* Content lives ONLY on the active (top) card — otherwise the
                      text of the cards behind it shows through/around the top one
                      (the bug Vadim flagged: "balibali" bleeding through "doki").
                      Cards in the deck are just dark panels until they reach the top. */}
                  {isActive && (
                    <div className="relative flex h-full max-w-full flex-col justify-between p-[28px] lg:max-w-[440px] lg:p-[40px]">
                      <div>
                        <h3 className="text-[28px] font-medium leading-[1.05] tracking-[-0.01em] lg:text-[42px] lg:leading-[1.0]">
                          {p.heading}
                        </h3>
                        <p className="mt-[16px] max-w-[366px] text-[16px] leading-[1.3] text-white/70">
                          {p.body}
                        </p>
                      </div>
                      <button
                        type="button"
                        data-compose
                        className="w-fit text-[14px] font-medium tracking-[0.04em] text-white underline-offset-4 transition hover:text-accent-bright hover:underline"
                      >
                        {p.cta}
                      </button>
                    </div>
                  )}
                </div>

                {/* Per-product tablet mockup — sibling of the panel so it bleeds past
                    the top-right edge like Figma. Only on the active card so the
                    deck behind stays clean (no doki tablet showing on every layer). */}
                {isActive && mockup && (
                  <div className="pointer-events-none absolute -top-[40px] right-[-20px] hidden h-[640px] w-[910px] rotate-[-7deg] lg:block">
                    <Image
                      src={asset(mockup.src)}
                      alt={mockup.alt}
                      fill
                      sizes="803px"
                      priority={i === 0}
                      className="object-cover object-[center_26%]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <ProductSwitcher index={index} progress={progress} onPick={pick} />
      </div>
    </section>
  );
}
