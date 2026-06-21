'use client';

import { useEffect, useRef, useCallback } from 'react';

// Ported from the portfolio. Wraps a section — every <p>/<li>/<h*> word inside
// gently pushes away from the cursor. One rAF + one mousemove listener, gated by
// an IntersectionObserver so it only runs while visible. Disabled on touch /
// reduced-motion (no hover there, and it'd burn a RAF loop for nothing).
export function ScatterZone({
  children,
  className = '',
  style,
  radius = 80,
  strength = 14,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  strength?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const rectsRef = useRef<DOMRect[]>([]);
  const rectFrame = useRef(0);
  const wrappedRef = useRef(false);

  // Wrap text nodes in <p>/<li>/<h*> into per-word spans (once).
  useEffect(() => {
    if (!containerRef.current || wrappedRef.current) return;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) return; // leave text untouched, no effect
    wrappedRef.current = true;

    const elements = containerRef.current.querySelectorAll('p, li, h1, h2, h3');
    const allSpans: HTMLSpanElement[] = [];

    elements.forEach((el) => {
      if (el.querySelector('[data-scatter-word]')) return; // already wrapped
      if (el.children.length > 0) return; // skip elements with child nodes

      const text = el.textContent || '';
      if (!text.trim()) return;

      const words = text.split(/(\s+)/);
      el.textContent = '';

      words.forEach((word) => {
        if (/^\s+$/.test(word)) {
          el.appendChild(document.createTextNode(word));
          return;
        }
        const span = document.createElement('span');
        span.textContent = word;
        span.dataset.scatterWord = '1';
        span.style.display = 'inline-block';
        span.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
        span.style.willChange = 'transform';
        el.appendChild(span);
        allSpans.push(span);
      });
    });

    spansRef.current = allSpans;
  }, []);

  const animate = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const spans = spansRef.current;

    // Re-cache rects every 8 frames.
    rectFrame.current++;
    if (rectFrame.current % 8 === 0 || rectsRef.current.length !== spans.length) {
      rectsRef.current = spans.map((s) => s.getBoundingClientRect());
    }

    const rects = rectsRef.current;
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const rect = rects[i];
      if (!span || !rect) continue;

      const cy = rect.top + rect.height / 2;
      if (Math.abs(cy - my) > radius + 30) {
        if (span.style.transform) {
          span.style.transform = '';
          span.style.opacity = '';
        }
        continue;
      }

      const cx = rect.left + rect.width / 2;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && dist > 0) {
        const force = (1 - dist / radius) * strength;
        span.style.transform = `translate(${(dx / dist) * force}px, ${(dy / dist) * force}px)`;
        span.style.opacity = `${0.7 + 0.3 * (dist / radius)}`;
      } else if (span.style.transform) {
        span.style.transform = '';
        span.style.opacity = '';
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [radius, strength]);

  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    let active = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          active = true;
          rafRef.current = requestAnimationFrame(animate);
        } else if (!entry.isIntersecting && active) {
          active = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.05 },
    );
    if (containerRef.current) io.observe(containerRef.current);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  }, [animate]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
