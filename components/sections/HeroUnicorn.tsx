'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Self-hosted Unicorn Studio scene (the glyph-dither "ascii" effect ported from
// the portfolio). SDK + scene.json + glyph sprites are served from /public, so
// their runtime never runs and no watermark is injected — self-host is free.
// The scene is tuned for a light background, so we invert it in CSS to read on
// the dark hero. Reduced-motion / low-power devices skip it entirely.
export function HeroUnicorn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let scene: { destroy?: () => void; pause?: () => void; resume?: () => void } | null = null;
    let destroyed = false;

    const script = document.createElement('script');
    script.src = asset('/unicornStudio.umd.js');
    script.onload = () => {
      const US = (window as unknown as { UnicornStudio?: { addScene: (o: unknown) => Promise<unknown> } })
        .UnicornStudio;
      if (!US || destroyed) return;

      // Adaptive quality: lower DPI/FPS on small or low-core devices.
      const isSmall = window.innerWidth < 768;
      const cores = navigator.hardwareConcurrency || 4;
      const lowEnd = cores <= 4 || isSmall;

      US.addScene({
        elementId: 'unicorn-hero-bg',
        filePath: asset('/unicorn-hero.json'),
        dpi: lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2),
        fps: lowEnd ? 30 : 60,
        interactivity: { mouse: { disableMobile: true } },
      })
        .then((s) => {
          if (destroyed) {
            (s as { destroy?: () => void })?.destroy?.();
            return;
          }
          scene = s as typeof scene;
          // Pause when scrolled out of view or the tab is hidden — big perf win.
          const io = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!scene) continue;
                if (e.isIntersecting) scene.resume?.();
                else scene.pause?.();
              }
            },
            { threshold: 0.05 },
          );
          io.observe(el);
          const onVis = () => {
            if (!scene) return;
            if (document.hidden) scene.pause?.();
            else scene.resume?.();
          };
          document.addEventListener('visibilitychange', onVis);
          (el as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
          };
        })
        .catch(() => {});
    };
    document.head.appendChild(script);

    return () => {
      destroyed = true;
      (el as HTMLDivElement & { __cleanup?: () => void }).__cleanup?.();
      scene?.destroy?.();
      script.remove();
    };
  }, []);

  return (
    <div
      id="unicorn-hero-bg"
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 motion-reduce:hidden"
      // invert the light-tuned scene so it reads on the dark hero, and push
      // contrast/brightness hard so the glyphs actually pop instead of muddying out
      style={{ filter: 'invert(1) contrast(1.9) brightness(1.55) saturate(1.2)' }}
    />
  );
}
