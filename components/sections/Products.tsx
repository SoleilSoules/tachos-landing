'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
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
    <div className="mt-[28px] flex flex-wrap justify-center gap-[8px]">
      {products.map((p, i) => {
        const isActive = i === index;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(i)}
            aria-current={isActive}
            className="relative flex h-[64px] w-[282px] items-center gap-[12px] overflow-hidden rounded-[16px] border border-white/8 bg-[#363636] px-[8px] text-left"
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
              <Image src={ICONS[p.id]} alt="" width={26} height={26} />
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
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const active = products[index] ?? products[0];
  const ref = useReveal<HTMLDivElement>({ threshold: 0.15, rootMargin: '-40px 0px' });

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
        setIndex((i) => (i + 1) % products.length);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);

  return (
    <section id="products" className="overflow-hidden bg-bg pt-[130px] pb-[150px] text-inverted">
      <h2 className="mx-auto max-w-[1000px] px-6 text-center text-[52px] font-semibold leading-[1.0] tracking-[-0.01em]">
        {productsIntro.titleLead}
        <br />
        <span className="text-white/30">{productsIntro.titleMuted}</span>
      </h2>

      <div ref={ref} className="mx-auto mt-[56px] max-w-page px-[80px]">
        {/* device card with a soft stack peeking behind it */}
        <div className="relative">
          <div className="absolute -top-[32px] left-1/2 h-[64px] w-[77%] -translate-x-1/2 rounded-[28px] bg-[#242323]" />
          <div className="absolute -top-[16px] left-1/2 h-[64px] w-[90%] -translate-x-1/2 rounded-[36px] bg-[#363636]" />

          <div className="reveal-hidden relative h-[494px] overflow-hidden rounded-[48px] border border-white/8 bg-gradient-to-br from-[#1b1613] via-[#100c0b] to-black shadow-[inset_0_2px_120px_rgba(170,170,170,0.12)]">
            {/* warm glow behind the device */}
            <div className="pointer-events-none absolute -right-[40px] top-1/2 h-[560px] w-[600px] -translate-y-1/2 rounded-full bg-accent/25 blur-[150px]" />

            <div className="relative flex h-full max-w-[440px] flex-col justify-between p-[40px]">
              <div>
                <h3 className="text-[42px] font-medium leading-[1.0] tracking-[-0.01em]">
                  {active.heading}
                </h3>
                <p className="mt-[16px] max-w-[366px] text-[16px] leading-[1.3] text-white/70">
                  {active.body}
                </p>
              </div>
              <button
                type="button"
                data-compose
                className="w-fit text-[14px] font-medium tracking-[0.04em] text-white underline-offset-4 transition hover:text-accent-bright hover:underline"
              >
                {active.cta}
              </button>
            </div>
          </div>

          {/* tablet mockup (real doki screen) — sized + positioned like Figma:
              fills the right side, screen readable, bleeds past the top edge.
              object-cover crops the transparent margins so the device reads large. */}
          <div className="pointer-events-none absolute -top-[68px] right-[-20px] h-[562px] w-[803px]">
            <Image
              src="/figma/doki-mockup.png"
              alt="Интерфейс doki на планшете"
              fill
              sizes="803px"
              className="object-cover object-[center_26%]"
            />
          </div>
        </div>

        <ProductSwitcher index={index} progress={progress} onPick={setIndex} />
      </div>
    </section>
  );
}
