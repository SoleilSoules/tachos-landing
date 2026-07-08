'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Takes the original hero iPhone mockup (public/figma/hero-bg.png) and renders it
// as an ASCII / glyph-dither image on a canvas: each grid cell samples the photo's
// luminance → a glyph, tinted with a warm brand duotone (shadow → accent → warm
// white). The near-white studio background is dropped so the device floats on the
// dark hero. Static by design (no animation) — cheap and calm.
export function HeroAsciiImage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const RAMP = ' .:-=+*oxX#%@';
    const CELL = 8; // glyph cell in px — chunky enough to read as ascii

    // warm brand duotone: shadow #2a1008 → accent #f0511f → warm white #ffe6d5
    const duo = (t: number): string => {
      let r: number, g: number, b: number;
      if (t < 0.5) {
        const k = t * 2;
        r = 42 + (240 - 42) * k;
        g = 16 + (81 - 16) * k;
        b = 8 + (31 - 8) * k;
      } else {
        const k = (t - 0.5) * 2;
        r = 240 + (255 - 240) * k;
        g = 81 + (230 - 81) * k;
        b = 31 + (213 - 31) * k;
      }
      return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    };

    const img = new Image();

    const render = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H || !img.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // fit the mockup (contain), pushed to the right so the H1 keeps the left
      const scale = Math.min(W / img.width, H / img.height) * 0.86;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (W - dw) / 2 + W * 0.13;
      const dy = (H - dh) / 2;

      const cols = Math.max(1, Math.floor(dw / CELL));
      const rows = Math.max(1, Math.floor(dh / CELL));

      // downsample into a cols×rows offscreen buffer, then read it back
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.drawImage(img, 0, 0, cols, rows);
      const d = octx.getImageData(0, 0, cols, rows).data;

      ctx.font = `${CELL}px ui-monospace, Menlo, monospace`;
      ctx.textBaseline = 'top';

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = (gy * cols + gx) * 4;
          const r = d[i] ?? 0;
          const g = d[i + 1] ?? 0;
          const b = d[i + 2] ?? 0;
          const a = d[i + 3] ?? 0;
          if (a < 20) continue;
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const mx = Math.max(r, g, b);
          const sat = mx === 0 ? 0 : (mx - Math.min(r, g, b)) / mx;
          // drop the near-white studio background → device floats on dark hero
          if (lum > 0.9 && sat < 0.12) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * (RAMP.length - 1)))] ?? '.';
          ctx.fillStyle = duo(Math.min(1, lum * 1.05));
          ctx.fillText(ch, dx + gx * CELL, dy + gy * CELL);
        }
      }
    };

    img.onload = () => {
      render();
      window.addEventListener('resize', render);
    };
    img.src = asset('/figma/hero-bg.png');

    return () => {
      window.removeEventListener('resize', render);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
