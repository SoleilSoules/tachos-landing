'use client';

import { useEffect, useRef, useState } from 'react';

// Counts 0 → target once the element scrolls into view (ease-out cubic).
// Respects prefers-reduced-motion (jumps straight to target) and has a failsafe
// so the number never stays stuck if the observer doesn't fire.
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  duration = 1300,
) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValue(target);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) run();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    const fallback = setTimeout(run, 1500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [target, duration]);

  return { ref, value };
}
