'use client';

import { useEffect, useRef } from 'react';
import { useCompose } from './ComposeProvider';

// Second cursor (Clicky model): a non-interactive plectrum that strolls near the
// real cursor, perches on the open form, and lives in the bottom-right corner.
export function CursorCompanion() {
  const { isOpen } = useCompose();
  const openRef = useRef(isOpen);
  const root = useRef<HTMLDivElement>(null);
  const rot = useRef<SVGGElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const bTitle = useRef<HTMLElement>(null);
  const bSub = useRef<HTMLElement>(null);

  useEffect(() => {
    openRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduced || touch) {
      if (root.current) root.current.style.display = 'none';
      return;
    }

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    const easeIO = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const dockPt = () => ({ x: innerWidth - 46, y: innerHeight - 46 });
    const formPt = () => ({ x: innerWidth / 2, y: innerHeight * 0.13 });

    let mx = innerWidth / 2,
      my = innerHeight * 0.4,
      moved = 0,
      lastMove = performance.now();
    let pos = dockPt();
    let mode: 'dock' | 'stroll' | 'flying' | 'form' = 'dock';
    let fly: {
      p0: { x: number; y: number };
      p1: { x: number; y: number };
      p2: { x: number; y: number };
      t0: number;
      dur: number;
      then?: () => void;
    } | null = null;
    let flip = 1,
      orbit = -0.6,
      faceAng = -Math.PI / 2,
      prevOpen = false,
      bubbleTimer: ReturnType<typeof setTimeout>;
    let alive = true;

    const say = (title: string, sub: string, ms?: number) => {
      if (bTitle.current) bTitle.current.textContent = title;
      if (bSub.current) bSub.current.textContent = sub;
      bubble.current?.classList.add('show');
      clearTimeout(bubbleTimer);
      if (ms) bubbleTimer = setTimeout(() => bubble.current?.classList.remove('show'), ms);
    };
    const hush = () => {
      clearTimeout(bubbleTimer);
      bubble.current?.classList.remove('show');
    };

    const flyTo = (x: number, y: number, dur: number, then?: () => void) => {
      flip = -flip;
      const midx = (pos.x + x) / 2,
        midy = (pos.y + y) / 2;
      const dx = x - pos.x,
        dy = y - pos.y,
        len = Math.hypot(dx, dy) || 1;
      fly = {
        p0: { ...pos },
        p1: { x: midx - (dy / len) * len * 0.3 * flip, y: midy + (dx / len) * len * 0.3 * flip },
        p2: { x, y },
        t0: performance.now(),
        dur,
        then,
      };
      mode = 'flying';
    };
    const goHome = () => {
      hush();
      const p = dockPt();
      flyTo(p.x, p.y, 700, () => {
        mode = 'dock';
      });
    };
    const toForm = () => {
      const p = formPt();
      flyTo(p.x, p.y, 700, () => {
        mode = 'form';
        say('Письмо пишется само', 'выберите пару пунктов — я рядом', 4200);
      });
    };

    const onMove = (e: MouseEvent) => {
      moved += Math.hypot(e.clientX - mx, e.clientY - my);
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      if (mode === 'dock' && moved > 320 && !openRef.current) {
        moved = 0;
        flyTo(mx + 90, my - 60, 650, () => {
          mode = 'stroll';
        });
      }
    };
    addEventListener('mousemove', onMove, { passive: true });

    // Contextual hints: hovering anything tagged with data-hint makes the
    // companion pipe up (Vadim wanted it to point things out — the input, each
    // case, etc.). Tracking the element dedupes the bubbling mouseover.
    let hintEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      if (openRef.current) return;
      const el = (e.target as HTMLElement).closest?.('[data-hint]') ?? null;
      if (el === hintEl) return;
      hintEl = el;
      if (el)
        say(el.getAttribute('data-hint') || '', el.getAttribute('data-hint-sub') || '', 2800);
    };
    addEventListener('mouseover', onOver, { passive: true });

    const blink = () => {
      root.current?.classList.add('blink');
      setTimeout(() => root.current?.classList.remove('blink'), 200);
    };
    const blinkLoop = () => {
      if (!alive) return;
      blink();
      setTimeout(blinkLoop, 2800 + Math.random() * 2600);
    };
    blinkLoop();

    const introTimer = setTimeout(() => {
      if ((mode === 'dock' || mode === 'stroll') && !openRef.current) {
        flyTo(Math.min(mx + 80, innerWidth - 300), Math.max(my - 60, 90), 650, () => {
          mode = 'stroll';
          say('Я соберу письмо за вас 👋', 'кнопка снизу — когда понадоблюсь', 3200);
          setTimeout(() => {
            if (!openRef.current) goHome();
          }, 3600);
        });
      }
    }, 4000);

    const render = (scale: number) => {
      root.current!.style.transform = `translate3d(${pos.x - 13}px,${pos.y - 13}px,0) scale(${scale})`;
      rot.current?.setAttribute('transform', `rotate(${(faceAng * 180) / Math.PI} 13 13)`);
      const k = Math.atan2(my - pos.y, mx - pos.x) - faceAng;
      const ex = Math.cos(k) * 1.3,
        ey = Math.sin(k) * 1.3;
      if (eyeL.current) eyeL.current.style.transform = `translate(${ex}px,${ey}px)`;
      if (eyeR.current) eyeR.current.style.transform = `translate(${ex}px,${ey}px)`;
    };

    let raf = 0;
    const loop = () => {
      // react to form open/close
      if (openRef.current && !prevOpen) {
        prevOpen = true;
        hush();
        toForm();
      } else if (!openRef.current && prevOpen) {
        prevOpen = false;
        goHome();
      }

      const now = performance.now();
      if (mode === 'flying' && fly) {
        const k = Math.min((now - fly.t0) / fly.dur, 1),
          e = easeIO(k);
        const a = lerp(fly.p0.x, fly.p1.x, e),
          b = lerp(fly.p1.x, fly.p2.x, e);
        const c = lerp(fly.p0.y, fly.p1.y, e),
          d = lerp(fly.p1.y, fly.p2.y, e);
        const nx = lerp(a, b, e),
          ny = lerp(c, d, e);
        faceAng = Math.atan2(ny - pos.y, nx - pos.x);
        pos.x = nx;
        pos.y = ny;
        render(1 + Math.sin(k * Math.PI) * 0.22);
        if (k >= 1) {
          const cb = fly.then;
          fly = null;
          cb?.();
        }
      } else if (mode === 'form') {
        const p = formPt();
        pos.x = lerp(pos.x, p.x, 0.18);
        pos.y = lerp(pos.y, p.y, 0.18);
        faceAng = lerp(faceAng, Math.PI / 2, 0.12);
        render(1);
      } else if (mode === 'stroll') {
        orbit += 0.004 + Math.sin(now * 0.0004) * 0.002;
        let tx = mx + Math.cos(orbit) * 120,
          ty = my + Math.sin(orbit) * 84;
        tx = Math.max(28, Math.min(innerWidth - 40, tx));
        ty = Math.max(70, Math.min(innerHeight - 46, ty));
        pos.x = lerp(pos.x, tx, 0.045);
        pos.y = lerp(pos.y, ty, 0.045);
        const dd = Math.hypot(pos.x - mx, pos.y - my);
        if (dd < 64) {
          pos.x = lerp(pos.x, mx + ((pos.x - mx) / dd) * 120, 0.3);
          pos.y = lerp(pos.y, my + ((pos.y - my) / dd) * 120, 0.3);
        }
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.12);
        render(1);
        if (now - lastMove > 8000) goHome();
      } else {
        const p = dockPt();
        pos.x = lerp(pos.x, p.x, 0.2);
        pos.y = lerp(pos.y, p.y, 0.2);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.08);
        render(1);
      }

      if (bubble.current?.classList.contains('show')) {
        const right = pos.x > innerWidth - 300;
        bubble.current.style.left = (right ? pos.x - 274 : pos.x + 28) + 'px';
        bubble.current.style.top = Math.max(64, pos.y - 70) + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      clearTimeout(bubbleTimer);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={root}
        aria-hidden
        className="companion pointer-events-none fixed left-0 top-0 z-[120]"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(248,72,0,.4))' }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26">
          <g ref={rot}>
            <path
              d="M22.5 13 L6.5 4.5 Q3.5 3 3.9 6.3 L5.8 19.7 Q6.2 23 9.2 21.5 Z"
              fill="#F84800"
            />
            <g ref={eyeL} className="eye">
              <circle cx="10.2" cy="10" r="2.1" fill="#fff" />
              <circle cx="10.9" cy="10" r="1" fill="#0E0E10" />
              <rect className="lid" x="7.6" y="7.4" width="5.2" height="5.2" rx="2.6" fill="#F84800" />
            </g>
            <g ref={eyeR} className="eye">
              <circle cx="10.8" cy="15.6" r="2.1" fill="#fff" />
              <circle cx="11.5" cy="15.6" r="1" fill="#0E0E10" />
              <rect className="lid" x="8.2" y="13" width="5.2" height="5.2" rx="2.6" fill="#F84800" />
            </g>
          </g>
        </svg>
      </div>
      <div
        ref={bubble}
        aria-hidden
        className="bubble pointer-events-none fixed left-0 top-0 z-[121] w-[246px] rounded-[16px] bg-ink px-[16px] py-[12px] text-inverted shadow-[0_14px_40px_rgba(0,0,0,0.4)]"
      >
        <b ref={bTitle} className="block text-[14px] font-semibold">
          Заполнить письмо за вас?
        </b>
        <span ref={bSub} className="block text-[12px] text-inverted/55">
          выберите пару пунктов — 20 секунд
        </span>
      </div>
    </>
  );
}
