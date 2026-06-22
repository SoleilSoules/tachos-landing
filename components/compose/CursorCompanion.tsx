'use client';

import { useEffect, useRef } from 'react';
import { useCompose } from './ComposeProvider';

// Tachos Nachos — the studio mascot. Behaviour (rebuilt): he calmly follows the
// cursor and SPEAKS ABOUT WHATEVER THE USER IS LOOKING AT — i.e. the element under
// the cursor (card / input / button). Hint text comes from [data-hint] when set,
// otherwise a generic line by element type. No auto fly-outs, no idle tricks, no
// "scroll down" nags. In the footer he perches huge and watches with his eyes.
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
    const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    // resting offset from the cursor — sits just to the lower-right, never on top
    const OFF_X = 34;
    const OFF_Y = 30;

    let mx = innerWidth / 2,
      my = innerHeight * 0.42;
    let pos = { x: mx, y: my - 40 };
    let mode: 'appear' | 'companion' | 'flying' | 'footer-perch' = 'appear';

    const appearStart = performance.now() + 160;
    let scaleCur = 0;
    let orbit = -0.6;
    let lastMove = performance.now();
    let lastTrick = performance.now();

    let fly: {
      p0: { x: number; y: number };
      p1: { x: number; y: number };
      p2: { x: number; y: number };
      t0: number;
      dur: number;
      then?: () => void;
    } | null = null;
    let flip = 1,
      faceAng = Math.PI / 2,
      prevOpen = false,
      bubbleTimer: ReturnType<typeof setTimeout>;
    let alive = true;

    let typeTimer: ReturnType<typeof setTimeout>;
    const stopTyping = () => {
      clearTimeout(typeTimer);
      bTitle.current?.classList.remove('talk-caret');
      bSub.current?.classList.remove('talk-caret');
    };
    // Type a string char by char, then run `done`; a blinking caret rides the line.
    const typeInto = (el: HTMLElement | null, text: string, speed: number, done?: () => void) => {
      if (!el) {
        done?.();
        return;
      }
      el.textContent = '';
      el.classList.add('talk-caret');
      let i = 0;
      const step = () => {
        el.textContent = text.slice(0, i);
        if (i < text.length) {
          i += 1;
          typeTimer = setTimeout(step, speed);
        } else {
          el.classList.remove('talk-caret');
          done?.();
        }
      };
      step();
    };
    const say = (title: string, sub: string, ms?: number) => {
      stopTyping();
      bubble.current?.classList.add('show');
      // calm, readable pace
      typeInto(bTitle.current, title, 42, () => typeInto(bSub.current, sub, 30));
      clearTimeout(bubbleTimer);
      if (ms) bubbleTimer = setTimeout(() => bubble.current?.classList.remove('show'), ms);
    };
    const hush = () => {
      clearTimeout(bubbleTimer);
      stopTyping();
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
    const backToCursor = () => {
      hush();
      flyTo(mx + OFF_X, my + OFF_Y, 600, () => {
        mode = 'companion';
      });
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };
    addEventListener('mousemove', onMove, { passive: true });

    // ─── HINT: speak about the element under the cursor ───
    // Priority: explicit [data-hint]; else a generic line by element type. Returns
    // null for elements not worth narrating (so the bubble just hushes).
    const hintFor = (el: Element): { t: string; s: string } | null => {
      const dh = el.getAttribute('data-hint');
      if (dh) return { t: dh, s: el.getAttribute('data-hint-sub') || '' };
      const tag = el.tagName.toLowerCase();
      if (tag === 'textarea')
        return { t: 'Опишите задачу', s: 'своими словами — оформлю в письмо' };
      if (tag === 'input') return { t: 'Сюда — ваш контакт', s: 'телефон, почта или @telegram' };
      if (tag === 'button' || tag === 'a') {
        const label = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
        if (label) return { t: label, s: 'можно нажать' };
      }
      return null;
    };
    let hintEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      if (openRef.current || mode === 'appear') return;
      const el =
        (e.target as HTMLElement).closest?.('[data-hint], textarea, input, button, a, article') ??
        null;
      if (el === hintEl) return;
      hintEl = el;
      const h = el ? hintFor(el) : null;
      if (h) say(h.t, h.s, 4200);
      else hush();
    };
    addEventListener('mouseover', onOver, { passive: true });

    // ─── Footer perch: huge Nachos sits in the footer slot, eyes tracking ───
    let footerVisible = false;
    let perchedSaid = false;
    const perchEl = document.querySelector('[data-mascot-perch]');
    let perchObserver: IntersectionObserver | null = null;
    if (perchEl && 'IntersectionObserver' in window) {
      perchObserver = new IntersectionObserver(
        ([e]) => {
          if (!e) return;
          if (e.intersectionRatio >= 0.45) footerVisible = true;
          else if (e.intersectionRatio < 0.1) footerVisible = false;
        },
        { threshold: [0.1, 0.45] },
      );
      perchObserver.observe(perchEl);
    }
    const perchPt = () => {
      const r = (perchEl as HTMLElement).getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

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

    const render = (scale: number) => {
      if (!root.current) return;
      root.current.style.transform = `translate3d(${pos.x - 16.5}px,${pos.y - 16.5}px,0) scale(${scale})`;
      rot.current?.setAttribute('transform', `rotate(${(faceAng * 180) / Math.PI} 13 13)`);
      // eyes glance toward the cursor
      const k = Math.atan2(my - pos.y, mx - pos.x) - faceAng;
      const ex = Math.cos(k) * 1.3,
        ey = Math.sin(k) * 1.3;
      if (eyeL.current) eyeL.current.style.transform = `translate(${ex}px,${ey}px)`;
      if (eyeR.current) eyeR.current.style.transform = `translate(${ex}px,${ey}px)`;
    };

    // Idle tricks: when idle near the cursor, the mascot plays — a flip, a squish,
    // a wobble, and (rarely) shatters into 6 shards and regroups.
    const TRICKS = ['spin', 'squish', 'wobble'];
    const maybeTrick = (now: number) => {
      if (mode !== 'companion' || openRef.current) return;
      if (now - lastMove < 3500 || now - lastTrick < 8000) return;
      lastTrick = now;
      if (Math.random() < 0.18) {
        root.current?.classList.add('shatter');
        setTimeout(() => root.current?.classList.remove('shatter'), 1100);
      } else {
        // WHY: index is Math.floor(random * length), always within TRICKS bounds.
        const t = TRICKS[Math.floor(Math.random() * TRICKS.length)]!;
        root.current?.classList.add(t);
        setTimeout(() => root.current?.classList.remove(t), 950);
      }
    };

    let raf = 0;
    const loop = () => {
      // modal open → don't interfere (no speaking), just keep following
      if (openRef.current && !prevOpen) {
        prevOpen = true;
        hush();
      } else if (!openRef.current && prevOpen) {
        prevOpen = false;
      }

      // footer perch enter/leave
      if (perchEl && !openRef.current) {
        if (footerVisible && mode !== 'footer-perch' && mode !== 'flying') {
          const p = perchPt();
          flyTo(p.x, p.y, 700, () => {
            mode = 'footer-perch';
            perchedSaid = false;
          });
        } else if (!footerVisible && mode === 'footer-perch') {
          backToCursor();
        }
      }

      const now = performance.now();

      if (mode === 'appear') {
        const k = Math.min(Math.max((now - appearStart) / 340, 0), 1);
        scaleCur = Math.max(0, easeOutBack(k));
        pos.x = lerp(pos.x, mx + OFF_X, 0.06);
        pos.y = lerp(pos.y, my + OFF_Y, 0.06);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.1);
        render(scaleCur);
        if (k >= 1) mode = 'companion';
      } else if (mode === 'flying' && fly) {
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
      } else if (mode === 'footer-perch') {
        const p = perchPt();
        pos.x = lerp(pos.x, p.x, 0.16);
        pos.y = lerp(pos.y, p.y, 0.16);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.12);
        render(8);
        if (!perchedSaid) {
          perchedSaid = true;
          say('Заполните письмо', 'и нажмите «Отправить» — я рядом');
        }
      } else {
        // companion — lazy orbit around the cursor + a springy "you can't catch me"
        // push-away when the cursor closes in, plus the occasional idle trick.
        orbit += 0.004 + Math.sin(now * 0.0004) * 0.002;
        let tx = mx + Math.cos(orbit) * 112,
          ty = my + Math.sin(orbit) * 80;
        tx = Math.max(32, Math.min(innerWidth - 44, tx));
        ty = Math.max(72, Math.min(innerHeight - 50, ty));
        pos.x = lerp(pos.x, tx, 0.05);
        pos.y = lerp(pos.y, ty, 0.05);
        // repel: as the cursor nears, slide the target away (floored divisor + a
        // distance-faded strength so he doesn't jitter or stick on the boundary)
        const dd = Math.hypot(pos.x - mx, pos.y - my);
        if (dd < 72) {
          const safe = Math.max(dd, 16);
          const k = 0.32 * ((72 - dd) / 72);
          pos.x = lerp(pos.x, mx + ((pos.x - mx) / safe) * 130, k);
          pos.y = lerp(pos.y, my + ((pos.y - my) / safe) * 130, k);
        }
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.12);
        render(1);
        maybeTrick(now);
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
      clearTimeout(bubbleTimer);
      clearTimeout(typeTimer);
      removeEventListener('mousemove', onMove);
      removeEventListener('mouseover', onOver);
      perchObserver?.disconnect();
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
        <svg width="33" height="33" viewBox="0 0 26 26">
          <g ref={rot}>
            <path
              d="M22.5 13 L6.5 4.5 Q3.5 3 3.9 6.3 L5.8 19.7 Q6.2 23 9.2 21.5 Z"
              fill="#F84800"
            />
            <g ref={eyeL} className="eye">
              <circle cx="10.2" cy="10" r="2.1" fill="#fff" />
              <circle cx="10.9" cy="10" r="1" fill="#0E0E10" />
              <rect
                className="lid"
                x="7.6"
                y="7.4"
                width="5.2"
                height="5.2"
                rx="2.6"
                fill="#F84800"
              />
            </g>
            <g ref={eyeR} className="eye">
              <circle cx="10.8" cy="15.6" r="2.1" fill="#fff" />
              <circle cx="11.5" cy="15.6" r="1" fill="#0E0E10" />
              <rect
                className="lid"
                x="8.2"
                y="13"
                width="5.2"
                height="5.2"
                rx="2.6"
                fill="#F84800"
              />
            </g>
          </g>
        </svg>
        {/* 6 shards for the rare "shatter & regroup" trick (hidden until .shatter) */}
        <span className="shards" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} style={{ '--a': `${i * 60}deg` } as React.CSSProperties} />
          ))}
        </span>
      </div>
      <div
        ref={bubble}
        aria-hidden
        className="bubble pointer-events-none fixed left-0 top-0 z-[121] w-[246px] rounded-[16px] bg-ink px-[16px] py-[12px] text-inverted shadow-[0_14px_40px_rgba(0,0,0,0.4)]"
      >
        <b ref={bTitle} className="block text-[14px] font-semibold" />
        <span ref={bSub} className="block text-[12px] text-inverted/55" />
      </div>
    </>
  );
}
