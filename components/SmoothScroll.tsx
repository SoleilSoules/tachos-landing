'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Smooth-scroll wrapper (Lenis), ported from the portfolio. Skipped on touch and
// reduced-motion — native scroll is faster there and avoids a continuous RAF loop.
// The instance is published on window.__lenis so the letter modal can stop()/start()
// the page scroll natively (no body.overflow hack). `anchors` makes the existing
// <a href="#section"> links scroll smoothly with an offset that clears the fixed nav.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) return;

    const lenis = new Lenis({
      // fast + smooth: a bigger wheel multiplier covers more distance per notch
      // (snappy), a low lerp glides it to a stop (smooth, premium easing)
      lerp: 0.1,
      wheelMultiplier: 1.6,
      touchMultiplier: 2,
      anchors: { offset: -100 }, // clear the fixed nav when jumping to #anchors
    });
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
