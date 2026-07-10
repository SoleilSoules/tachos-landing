'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

export type WallLogo = { name: string; logo: string };

// One fixed logo slot that cycles through a pool: each logo assembles out of
// pixels, holds ~3s, then dissolves back into pixels before the next one appears
// in the same spot. Staggered across slots (startDelay), it reads as "lots of
// clients" without a marquee. Canvas because the effect is per-pixel-cell.
const REVEAL = 320; // ms — pixels assemble (snappy)
const DISSOLVE = 320; // ms — pixels scatter
// each hold is randomised (min + up to var) so slots drift and never sync up —
// otherwise, with one fixed cycle, they look like they "wait for each other"
const HOLD_MIN = 1400;
const HOLD_VAR = 2400;
const CELL = 5; // pixel-cell size (css px) — the "pixelation" grain
const LOGO_H = 24; // rendered logo height (css px)

const randomHold = () => HOLD_MIN + Math.random() * HOLD_VAR;

export function PixelLogo({
  logos,
  startDelay = 0,
  w = 128,
  h = 50,
}: {
  logos: WallLogo[];
  startDelay?: number;
  w?: number;
  h?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // mobile: shrink the slot (and logo) so more of them fit the first screen
    const mobile = window.innerWidth < 640;
    const W = mobile ? Math.round(w * 0.62) : w;
    const H = mobile ? Math.round(h * 0.8) : h;
    const logoH = mobile ? 16 : LOGO_H;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    // recolor each logo to a flat white silhouette (matches the old invert look)
    const whites: (HTMLCanvasElement | null)[] = logos.map(() => null);
    logos.forEach((l, i) => {
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight || 3;
        const dh = logoH;
        const dw = logoH * aspect;
        const off = document.createElement('canvas');
        off.width = Math.max(1, Math.ceil(dw));
        off.height = Math.max(1, Math.ceil(dh));
        const octx = off.getContext('2d');
        if (!octx) return;
        octx.drawImage(img, 0, 0, dw, dh);
        octx.globalCompositeOperation = 'source-in';
        octx.fillStyle = '#fff';
        octx.fillRect(0, 0, dw, dh);
        whites[i] = off;
      };
      img.src = asset(l.logo);
    });

    const cols = Math.ceil(W / CELL);
    const rows = Math.ceil(H / CELL);
    const noise = new Float32Array(cols * rows);
    const reroll = () => {
      for (let k = 0; k < noise.length; k++) noise[k] = Math.random();
    };
    reroll();

    // p: 0 = all pixels gone, 1 = full logo. Erase cells whose noise > p, so as p
    // rises the logo assembles pixel-by-pixel in a random order (and vice-versa).
    const drawFrame = (p: number, idx: number) => {
      ctx.clearRect(0, 0, W, H);
      const white = whites[idx];
      if (!white) return;
      const dw = white.width;
      const dh = white.height;
      ctx.globalAlpha = 0.82;
      ctx.drawImage(white, (W - dw) / 2, (H - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
      if (p >= 1) return;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          if ((noise[cy * cols + cx] ?? 1) > p) ctx.clearRect(cx * CELL, cy * CELL, CELL, CELL);
        }
      }
    };

    let cancelled = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // no animation: show the first logo once it's decoded
      const iv = window.setInterval(() => {
        if (whites[0]) {
          drawFrame(1, 0);
          window.clearInterval(iv);
        }
      }, 60);
      return () => {
        cancelled = true;
        window.clearInterval(iv);
      };
    }

    // accumulate cycles with a fresh random hold each time, so slots drift apart
    let cycleStart = performance.now() + startDelay;
    let holdMs = randomHold();
    let idx = 0;
    reroll();
    let raf = 0;
    const loop = () => {
      if (cancelled) return;
      const now = performance.now();
      if (now >= cycleStart) {
        const total = REVEAL + holdMs + DISSOLVE;
        if (now - cycleStart >= total) {
          cycleStart += total;
          idx = (idx + 1) % logos.length;
          holdMs = randomHold();
          reroll();
        }
        const phase = now - cycleStart;
        let p: number;
        if (phase < REVEAL) p = phase / REVEAL;
        else if (phase < REVEAL + holdMs) p = 1;
        else p = 1 - (phase - REVEAL - holdMs) / DISSOLVE;
        drawFrame(Math.max(0, Math.min(1, p)), idx);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [logos, startDelay, w, h]);

  return <canvas ref={canvasRef} style={{ width: w, height: h }} aria-hidden />;
}
