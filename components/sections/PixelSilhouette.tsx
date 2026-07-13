'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// "Родина-мать зовёт" silhouette that assembles out of pixels — the same effect as
// the hero logo wall — when it scrolls into view, then holds. Public-domain
// silhouette (Rones, publicdomainvectors.org). Sits by «ГОРОД-ГЕРОЙ ВОЛГОГРАД».
const CELL = 3; // pixel-cell size (css px)
const REVEAL_MS = 1400; // slow enough that the assemble is legible at this tiny size

export function PixelSilhouette({
  w = 22,
  h = 39,
  className,
}: {
  w?: number;
  h?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // recolor the silhouette to a soft white so it reads as a quiet emblem
    let white: HTMLCanvasElement | null = null;
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    const noise = new Float32Array(cols * rows);
    for (let k = 0; k < noise.length; k++) noise[k] = Math.random();

    const draw = (p: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!white) return;
      ctx.globalAlpha = 0.72;
      ctx.drawImage(white, 0, 0, w, h);
      ctx.globalAlpha = 1;
      if (p >= 1) return;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          if ((noise[cy * cols + cx] ?? 1) > p) ctx.clearRect(cx * CELL, cy * CELL, CELL, CELL);
        }
      }
    };

    let raf = 0;
    let start = 0;
    let running = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // canvas currently in the viewport? (the image usually loads while the footer
    // is still far below — without this the reveal would play once, unseen)
    const inView = () => {
      const r = canvas.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const anim = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / REVEAL_MS);
      draw(p);
      if (p < 1) raf = requestAnimationFrame(anim);
    };
    const kick = () => {
      if (!white || running) return;
      if (reduce) {
        draw(1);
        return;
      }
      running = true;
      start = 0;
      raf = requestAnimationFrame(anim);
    };

    const img = new Image();
    img.onload = () => {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const o = off.getContext('2d');
      if (!o) return;
      o.drawImage(img, 0, 0, w, h);
      o.globalCompositeOperation = 'source-in';
      o.fillStyle = '#fff';
      o.fillRect(0, 0, w, h);
      white = off;
      if (inView()) kick(); // only if already on screen; else the observer fires it
    };
    img.src = asset('/figma/rodina.png');

    const io = new IntersectionObserver(([e]) => e?.isIntersecting && kick(), { threshold: 0.3 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [w, h]);

  return <canvas ref={ref} style={{ width: w, height: h }} className={className} aria-hidden />;
}
