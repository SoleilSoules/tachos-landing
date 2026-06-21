'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

// filter.im-style word-by-word reveal: each word rises + fades in with a small
// per-word stagger when the heading scrolls into view. SSR-safe (renders the full
// text), respects reduced-motion, and has an in-view-only failsafe.
export function WordsReveal({
  children,
  as: Tag = 'span',
  className = '',
  stagger = 42,
  start = 0,
}: {
  children: ReactNode;
  // intrinsic tags only (caller-facing usage passes 'span'/'h2'/'p'); ElementType
  // keeps the ref loosely typed so the shared useRef<HTMLElement> stays valid
  as?: ElementType;
  className?: string;
  stagger?: number;
  start?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>('.word-rise'));
    if (words.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      words.forEach((w, i) => {
        w.style.setProperty('--wd', `${reduced ? 0 : start + i * stagger}ms`);
        w.classList.add('is-in');
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) run();
      },
      { threshold: 0.2, rootMargin: '-50px 0px' },
    );
    io.observe(el);
    // failsafe only if already on screen (don't burn the reveal off-screen)
    const t = setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) run();
    }, 1400);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [stagger, start]);

  // Split text nodes into animated words; preserve any non-string children (e.g.
  // a coloured <span> accent) as a single animated unit.
  const out: ReactNode[] = [];
  let key = 0;
  const pushText = (text: string) => {
    text.split(/(\s+)/).forEach((tok) => {
      if (tok.trim() === '') out.push(tok);
      else
        out.push(
          <span key={`w${key++}`} className="word-rise">
            {tok}
          </span>,
        );
    });
  };
  const walk = (node: ReactNode) => {
    if (typeof node === 'string') pushText(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node != null && node !== false)
      out.push(
        <span key={`w${key++}`} className="word-rise">
          {node}
        </span>,
      );
  };
  walk(children);

  return (
    <Tag ref={ref} className={className}>
      {out}
    </Tag>
  );
}
