'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { useReveal } from '@/hooks/useReveal';
import { useReducedMotion } from '@/lib/useMediaQuery';
import { useUrlParam } from '@/lib/useUrlParam';
import { WordsReveal } from '@/components/WordsReveal';
import { products, productsIntro } from '@/lib/content';

// The deck ships dark. `?products=light` renders the same section inverted so
// the two can be compared on the live page — Гоша picks, then the loser goes.
type Skin = {
  section: string;
  panel: string;
  glow: string;
  body: string;
  cta: string;
  pill: string;
  mark: string;
  tagline: string;
};

const DARK: Skin = {
  section: 'bg-bg text-inverted',
  panel: 'border-[#8d8d8d]/35 bg-white/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.45)]',
  glow: 'bg-accent/25',
  body: 'text-white/70',
  cta: 'text-white',
  pill: 'border-white/10 bg-white/[0.06] text-white',
  mark: 'bg-white/10 text-white',
  tagline: 'text-white/65',
};

const LIGHT: Skin = {
  section: 'bg-white text-fg',
  panel: 'border-black/[0.08] bg-black/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.13)]',
  glow: 'bg-accent/20',
  body: 'text-black/55',
  cta: 'text-black',
  pill: 'border-black/[0.09] bg-black/[0.04] text-black',
  mark: 'bg-black/[0.07] text-black',
  tagline: 'text-black/50',
};

// How long each product stays active before the carousel advances.
const SLIDE_MS = 5000;

// Per-product device mockup. Only doki has a real screen so far; hub/bali show
// the glassy panel + glow without a tablet until Vadim provides their shots.
const MOCKUPS: Record<string, { src: string; alt: string } | undefined> = {
  doki: { src: '/figma/doki-mockup.webp', alt: 'Интерфейс doki на планшете' },
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
  skin,
}: {
  index: number;
  progress: number;
  onPick: (i: number) => void;
  skin: Skin;
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
            data-hint="switcher"
            data-hint-sub={p.name}
            className={`relative flex h-[56px] min-w-0 flex-1 items-center gap-[8px] overflow-hidden rounded-[14px] border px-[8px] text-left transition-colors duration-500 sm:h-[64px] sm:gap-[10px] sm:rounded-[16px] sm:px-[10px] lg:max-w-[300px] lg:gap-[12px] ${
              isActive ? 'border-accent/40 bg-accent text-white' : skin.pill
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
              className={`relative grid size-[34px] shrink-0 place-items-center rounded-[10px] text-[16px] font-semibold sm:size-[44px] sm:rounded-[12px] sm:text-[18px] ${
                isActive ? 'bg-black/25 text-white' : skin.mark
              }`}
            >
              {p.name.charAt(0)}
            </span>
            <span className="relative min-w-0">
              <span
                className={`block truncate text-[14px] font-medium leading-[1.15] sm:text-[16px] ${
                  isActive ? 'text-white' : ''
                }`}
              >
                {p.name}
              </span>
              {/* Tagline truncates to almost nothing in a 1/3-width pill at 390px —
                  hide it on mobile so the name reads cleanly; back at sm+. */}
              <span
                className={`hidden truncate text-[14px] leading-[1.2] sm:block ${
                  isActive ? 'text-white/65' : skin.tagline
                }`}
              >
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
  const reduced = useReducedMotion();
  const skin = useUrlParam('products') === 'light' ? LIGHT : DARK;

  // Reset the timer bar the moment the active card changes. Done during render
  // (React's "adjusting state when a prop changes") rather than in the rAF
  // effect below — a setState there would leave the old fill on screen for a
  // frame and cost an extra render pass.
  const [timedIndex, setTimedIndex] = useState(index);
  if (timedIndex !== index) {
    setTimedIndex(index);
    setProgress(0);
  }

  // Reduced motion gets no sweep at all: the bar reads as already full.
  const shownProgress = reduced ? 100 : progress;

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
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false), {
      rootMargin: '0px 0px -10% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  // Drive the active card's fill; advance to the next product on completion.
  useEffect(() => {
    if (!inView || reduced) return;
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
  }, [index, count, inView, reduced]);

  return (
    <section
      id="products"
      className={`overflow-hidden pb-[80px] pt-[64px] lg:pb-[150px] lg:pt-[130px] ${skin.section}`}
    >
      <h2 className="mx-auto max-w-[1000px] px-6 text-center text-[clamp(30px,8vw,52px)] font-semibold leading-[1.05] tracking-[-0.01em] lg:leading-[1.0]">
        <WordsReveal as="span" stagger={48} className="block">
          {productsIntro.titleLead}
        </WordsReveal>
        <WordsReveal as="span" stagger={48} start={260} className="block text-white/30">
          {productsIntro.titleMuted}
        </WordsReveal>
      </h2>

      <div ref={ref} className="mx-auto mt-[68px] max-w-[1080px] px-5 sm:mt-[80px] sm:px-6 lg:mt-[120px]">
        {/* Deck stage: every product is a full panel stacked here; the active one
            sits flat on top, the rest fan out behind it. Height is fixed so the
            absolutely-positioned cards reserve layout. */}
        <div className="reveal-hidden relative h-[360px] sm:h-[420px] lg:h-[540px]">
          {products.map((p, i) => {
            // Cyclic depth: 0 = active/top, then the upcoming products peek behind.
            // As `index` advances the whole deck rotates, so a switch reads as
            // dealing the top card to the back of the stack.
            const depth = (i - index + count) % count;
            // WHY: depth is non-negative (modulo count) and clamped to REST.length-1, so the index is always in bounds.
            const rest = REST[Math.min(depth, REST.length - 1)]!;
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
                className="absolute inset-0 origin-top transform-gpu transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:!transition-none"
              >
                {/* Clipped panel: rounded body with text/CTA. overflow-hidden keeps
                    the glow + rounding tidy; the tablet lives OUTSIDE it (sibling)
                    so it can bleed past the top edge like Figma. */}
                <div
                  data-hint="product"
                  data-hint-sub={p.id}
                  className={`relative h-full overflow-hidden rounded-[28px] border backdrop-blur-md [clip-path:inset(0_round_28px)] lg:rounded-[40px] lg:[clip-path:inset(0_round_40px)] ${skin.panel}`}
                >
                  {/* warm glow behind the device */}
                  <div
                    className={`pointer-events-none absolute -right-[40px] top-1/2 h-[560px] w-[600px] -translate-y-1/2 rounded-full blur-[150px] ${skin.glow}`}
                  />

                  {/* Tablet mockup INSIDE the panel (Гоша) so the rounded card edge
                      clips it cleanly; pushed further right — the device bleeds past
                      the right/top edge and is cut by the card, the hand stays off. */}
                  {isActive && mockup && (
                    <div className="pointer-events-none absolute -top-[20px] right-[-240px] hidden h-[620px] w-[1080px] rotate-[-6deg] overflow-hidden lg:block">
                      <Image
                        src={asset(mockup.src)}
                        alt={mockup.alt}
                        fill
                        sizes="1080px"
                        priority={i === 0}
                        className="object-cover object-top"
                      />
                    </div>
                  )}

                  {/* Content lives ONLY on the active (top) card — otherwise the
                      text of the cards behind it shows through/around the top one
                      (the bug Vadim flagged: "balibali" bleeding through "doki"). */}
                  {isActive && (
                    <div className="relative flex h-full max-w-full flex-col justify-between p-[28px] lg:max-w-[440px] lg:p-[40px]">
                      <div>
                        <h3 className="text-[28px] font-medium leading-[1.05] tracking-[-0.01em] lg:text-[42px] lg:leading-[1.0]">
                          {p.heading}
                        </h3>
                        <p className={`mt-[16px] max-w-[366px] text-[16px] leading-[1.3] ${skin.body}`}>
                          {p.body}
                        </p>
                      </div>
                      {/* desktop: text CTA; mobile: product image at the bottom instead */}
                      <button
                        type="button"
                        data-compose
                        className={`hidden w-fit text-[14px] font-medium tracking-[0.04em] underline-offset-4 transition hover:text-accent-bright hover:underline lg:block ${skin.cta}`}
                      >
                        {p.cta}
                      </button>
                      {mockup && (
                        <div className="relative mt-[20px] h-[168px] w-full overflow-hidden rounded-[16px] lg:hidden">
                          <Image
                            src={asset(mockup.src)}
                            alt={mockup.alt}
                            fill
                            sizes="100vw"
                            className="object-cover object-top"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <ProductSwitcher index={index} progress={shownProgress} onPick={pick} skin={skin} />
      </div>
    </section>
  );
}
