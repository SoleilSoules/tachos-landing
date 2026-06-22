'use client';

import { useEffect, useRef } from 'react';

type UseRevealOptions = {
  stagger?: number; // ms between siblings
  threshold?: number;
  duration?: number; // ms
  variant?: string; // extra class, e.g. 'reveal-fade'
  rootMargin?: string;
};

// Attach the returned ref to a container; every descendant with `.reveal-hidden`
// animates in (staggered) when the container first enters the viewport. Respects
// prefers-reduced-motion (no delay; CSS shortens the animation).
export function useReveal<T extends HTMLElement = HTMLElement>({
  stagger = 95,
  threshold = 0.12,
  duration = 700,
  variant,
  rootMargin = '-80px 0px',
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.reveal-hidden'));
    if (items.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      items.forEach((el, i) => {
        el.style.setProperty('--reveal-delay', `${reduced ? 0 : i * stagger}ms`);
        el.style.setProperty('--reveal-dur', `${duration}ms`);
        el.classList.add('reveal-visible');
        if (variant) el.classList.add(variant);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) reveal();
      },
      { threshold, rootMargin },
    );
    observer.observe(container);

    // Failsafe: only reveal-by-timer if the container is ACTUALLY in view. A blind
    // timer used to fire for every section ~1.2s after mount — so below-the-fold
    // sections played their reveal before you ever scrolled there, and by the time
    // you arrived they were already shown ("no animations"). Now the timer only
    // rescues sections already on screen; the rest wait for the observer on scroll.
    const fallback = setTimeout(() => {
      const r = container.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) reveal();
    }, 1400);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [stagger, threshold, duration, variant, rootMargin]);

  return ref;
}
