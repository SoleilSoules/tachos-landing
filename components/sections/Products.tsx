'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { useReveal } from '@/hooks/useReveal';
import { products, productsIntro } from '@/lib/content';

// How long each product stays active before the carousel advances.
const SLIDE_MS = 5000;

// Per-product switcher icon (doki has its own glyph; hub/bali share one).
const ICONS: Record<string, string> = {
  doki: '/figma/prod-icon-doki.svg',
  hub: '/figma/prod-icon-hub.svg',
  balibali: '/figma/prod-icon-hub.svg',
};

// Per-product device mockup. Only doki has a real screen so far; hub/bali show
// the glassy panel + glow without a tablet until Vadim provides their shots.
const MOCKUPS: Record<string, { src: string; alt: string } | undefined> = {
  doki: { src: '/figma/doki-mockup.png', alt: 'Интерфейс doki на планшете' },
};

// Resting look of a card by its depth in the deck (0 = top/active). Each card
// behind the top sits a little lower, smaller, rotated and dimmed — a fanned
// stack you can "deal" from. WHY a lookup not a formula: only ~3 products, so
// hand-tuned offsets read better than linear math at this scale.
const REST: { y: number; scale: number; rot: number; opacity: number }[] = [
  { y: 0, scale: 1, rot: 0, opacity: 1 }, // top, flat
  { y: 26, scale: 0.95, rot: -2.4, opacity: 0.6 }, // peeking next card
  { y: 48, scale: 0.9, rot: 2.2, opacity: 0.32 }, // deepest
];

// CTA anchor copy lives next to the deck so the section stays content-driven.
const SWITCHER_HINT = 'Листайте — это наши продукты';

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
    <div className="mt-[28px] flex items-end justify-center">
      {products.map((p, i) => {
        // deck-of-cards: cards overlap; the active one lifts and pops forward, so
        // auto-advance reads as pulling a card out of the stack and tucking it back (Vadim)
        const isActive = i === index;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(i)}
            aria-current={isActive}
            style={{ marginLeft: i === 0 ? 0 : -14, zIndex: isActive ? 20 : 9 - i }}
            className={`relative flex h-[64px] w-[282px] items-center gap-[12px] overflow-hidden rounded-[16px] border px-[8px] text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive
                ? '-translate-y-[10px] scale-[1.03] border-accent/40 bg-[#3d3d3d] shadow-[0_20px_44px_rgba(0,0,0,0.5)]'
                : 'scale-[0.96] border-white/8 bg-[#2e2e2e] opacity-70'
            }`}
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-[12px] bg-accent/80"
                style={{ width: `${progress}%` }}
              />
            )}
            <span
              className={`relative grid size-[48px] shrink-0 place-items-center rounded-[12px] ${
                isActive ? 'bg-[#040404]' : 'bg-white/30'
              }`}
            >
              <Image src={asset(ICONS[p.id])} alt="" width={26} height={26} />
            </span>
            <span className="relative min-w-0">
              <span className="block text-[16px] font-medium leading-[1.15] text-white">
                {p.name}
              </span>
              <span className="block truncate text-[14px] leading-[1.2] text-white/60">
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
  const { index, prev } = view;
  const [progress, setProgress] = useState(0);
  const ref = useReveal<HTMLDivElement>({ threshold: 0.15, rootMargin: '-40px 0px' });

  // Switch products from the small switcher; ignore re-picking the active one.
  const pick = (next: number) =>
    setView((v) => (v.index === next ? v : { index: next, prev: v.index }));

  // Drive the active card's fill; advance to the next product on completion.
  useEffect(() => {
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
  }, [index, count]);

  return (
    <section id="products" className="overflow-hidden bg-bg pt-[130px] pb-[150px] text-inverted">
      {/* Scoped deck keyframes — kept local (not globals.css) and prefixed deck-*.
          Fly-out: top card lifts, tilts and drops past the bottom of the stack.
          Fly-in: next card eases up from the peeking slot into the flat top.
          motion-reduce handles the no-animation path via utility classes below. */}
      <style>{`
        /* deck-deal: top card lifts + tilts, then swings down and TUCKS into the
           deepest rest slot (y/scale/rot/opacity here MUST match REST[last]) so a
           'forwards' fill lands it cleanly at the back of the stack — no end pop. */
        @keyframes deck-deal {
          0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1); opacity: 1; }
          35%  { transform: translate3d(-30px,-36px,0) rotate(-7deg) scale(1.02); opacity: 1; }
          70%  { transform: translate3d(14px,70px,0) rotate(8deg) scale(0.92); opacity: 0.5; }
          100% { transform: translate3d(0,48px,0) rotate(2.2deg) scale(0.9); opacity: 0.32; }
        }
        /* deck-rise: the next card eases up from the peeking slot to the flat top. */
        @keyframes deck-rise {
          0%   { transform: translate3d(0,26px,0) rotate(-2.4deg) scale(0.95); opacity: 0.6; }
          100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); opacity: 1; }
        }
        @media (max-width: 640px) {
          /* Mobile: shorter, flatter travel so the deck never overflows the stage. */
          @keyframes deck-deal {
            0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translate3d(0,48px,0) rotate(2.2deg) scale(0.9); opacity: 0.32; }
          }
          @keyframes deck-rise {
            0%   { transform: translate3d(0,18px,0) rotate(0deg) scale(0.96); opacity: 0.6; }
            100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); opacity: 1; }
          }
        }
      `}</style>

      <h2 className="mx-auto max-w-[1000px] px-6 text-center text-[52px] font-semibold leading-[1.0] tracking-[-0.01em]">
        {productsIntro.titleLead}
        <br />
        <span className="text-white/30">{productsIntro.titleMuted}</span>
      </h2>

      <div ref={ref} className="mx-auto mt-[56px] max-w-page px-[80px]">
        {/* Deck stage: every product is a full panel stacked here; the active one
            sits flat on top, the rest fan out behind it. Height is fixed so the
            absolutely-positioned cards reserve layout. */}
        <div className="reveal-hidden relative h-[494px]">
          {products.map((p, i) => {
            // Cyclic depth: 0 = active/top, then the upcoming products peek behind.
            // As `index` advances the whole deck rotates, so a switch reads as
            // dealing the top card to the back of the stack.
            const depth = (i - index + count) % count;
            const rest = REST[Math.min(depth, REST.length - 1)];
            const isActive = depth === 0;
            // A transition is "in flight" when prev differs from index.
            const moved = prev !== index;
            // Only the natural forward step (and the timer's wrap) plays the full
            // deal/rise flight. Manual jumps to a far card just CSS-slide between
            // slots — keeps the dealt card landing exactly in the back slot and
            // avoids two cards fighting for the deepest position.
            const forwardStep = moved && index === (prev + 1) % count;
            const isLeaving = forwardStep && i === prev; // top card dealt to the back
            const isRising = forwardStep && isActive; // next card pulled to the top
            const mockup = MOCKUPS[p.id];

            // Resting slot for this card (where it ends up after any transition).
            // Cards not running a keyframe CSS-transition toward these values.
            const restStyle = {
              transform: `translate3d(0, ${rest.y}px, 0) rotate(${rest.rot}deg) scale(${rest.scale})`,
              opacity: rest.opacity,
              // Leaving card stays above the deck while it arcs out, then its
              // depth (deepest) naturally puts it at the back.
              zIndex: count - depth + (isLeaving ? count : 0),
            } as const;

            // deck-deal lands exactly on REST[last] (the back slot), so `forwards`
            // pins it there with no pop; deck-rise eases the new card to the top.
            const anim = isLeaving
              ? 'deck-deal 0.5s cubic-bezier(0.22,0.61,0.36,1) forwards'
              : isRising
                ? 'deck-rise 0.5s cubic-bezier(0.16,1,0.3,1) forwards'
                : undefined;

            return (
              <div
                // Remount on each step so the keyframe restarts from its 0% frame.
                key={`${p.id}-${isLeaving ? `out-${index}` : isRising ? `top-${index}` : 'rest'}`}
                aria-hidden={!isActive}
                style={{
                  ...restStyle,
                  // While a keyframe plays it owns transform/opacity; restStyle is
                  // the resting/fallback value the card settles to.
                  animation: anim,
                }}
                className="absolute inset-0 origin-bottom transform-gpu transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:!animate-none motion-reduce:!transition-none"
              >
                {/* Clipped panel: rounded body with text/CTA. overflow-hidden keeps
                    the glow + rounding tidy; the tablet lives OUTSIDE it (sibling)
                    so it can bleed past the top edge like Figma. */}
                <div className="relative h-full overflow-hidden rounded-[48px] border border-white/8 bg-gradient-to-br from-[#1b1613] via-[#100c0b] to-black shadow-[0_30px_80px_rgba(0,0,0,0.5),inset_0_2px_120px_rgba(170,170,170,0.12)]">
                  {/* warm glow behind the device */}
                  <div className="pointer-events-none absolute -right-[40px] top-1/2 h-[560px] w-[600px] -translate-y-1/2 rounded-full bg-accent/25 blur-[150px]" />

                  {/* Content lives ONLY on the active (top) card — otherwise the
                      text of the cards behind it shows through/around the top one
                      (the bug Vadim flagged: "balibali" bleeding through "doki").
                      Cards in the deck are just dark panels until they reach the top. */}
                  {isActive && (
                    <div className="relative flex h-full max-w-[440px] flex-col justify-between p-[40px]">
                      <div>
                        <h3 className="text-[42px] font-medium leading-[1.0] tracking-[-0.01em]">
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
                  <div className="pointer-events-none absolute -top-[68px] right-[-20px] h-[562px] w-[803px]">
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

        <p className="mt-[24px] text-center text-[13px] tracking-[0.04em] text-white/35">
          {SWITCHER_HINT}
        </p>

        <ProductSwitcher index={index} progress={progress} onPick={pick} />
      </div>
    </section>
  );
}
