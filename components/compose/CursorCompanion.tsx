'use client';

import { useEffect, useRef } from 'react';
import { useCompose } from './ComposeProvider';

// Tachos Nachos — the studio mascot (orange play-triangle with eyes). He calmly
// follows the cursor and SPEAKS ABOUT WHATEVER IS UNDER THE POINTER (one hint line
// from [data-hint], else a generic line). Alive but not fidgety: gentle breathing,
// a soft repel, occasional unhurried tricks. When the footer scrolls into view he
// smoothly GROWS into the big footer mascot and STAYS PUT there (stops following);
// scrolling away shrinks him back to the cursor. While an audio review plays he
// shows its transcript (tachos:transcript event). Position + scale are eased every
// frame by the current mode, so every transition (incl. the grow) is smooth.
export function CursorCompanion() {
  const { isOpen } = useCompose();
  const openRef = useRef(isOpen);
  const root = useRef<HTMLDivElement>(null);
  const rot = useRef<SVGGElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const bTitle = useRef<HTMLElement>(null);

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
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const OFF_X = 34,
      OFF_Y = 30; // resting offset from the cursor (lower-right)

    let mx = innerWidth / 2,
      my = innerHeight * 0.42;
    let pos = { x: mx, y: my - 40 };
    let mode: 'appear' | 'companion' | 'footer-perch' = 'appear';

    const appearStart = performance.now() + 160;
    let curScale = 0; // eased every frame toward the mode's target scale
    let orbit = -0.6;
    let lastMove = performance.now();
    let lastTrick = performance.now();
    let faceAng = Math.PI / 2,
      prevOpen = false,
      bubbleTimer: ReturnType<typeof setTimeout>;
    let alive = true;
    let transcribing = false;

    let typeTimer: ReturnType<typeof setTimeout>;
    const stopTyping = () => {
      clearTimeout(typeTimer);
      bTitle.current?.classList.remove('talk-caret');
    };
    const typeInto = (el: HTMLElement | null, text: string, speed: number) => {
      if (!el) return;
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
        }
      };
      step();
    };
    // One hint line only (#B3). ms omitted → stays until something else speaks.
    const say = (title: string, ms?: number) => {
      stopTyping();
      bubble.current?.classList.add('show');
      typeInto(bTitle.current, title, 38);
      clearTimeout(bubbleTimer);
      if (ms) bubbleTimer = setTimeout(() => bubble.current?.classList.remove('show'), ms);
    };
    const hush = () => {
      clearTimeout(bubbleTimer);
      stopTyping();
      bubble.current?.classList.remove('show');
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };
    addEventListener('mousemove', onMove, { passive: true });

    // ─── HINT: speak about the element under the cursor ───
    const hintFor = (el: Element): string | null => {
      const dh = el.getAttribute('data-hint');
      if (dh) return dh;
      const tag = el.tagName.toLowerCase();
      if (tag === 'textarea') return 'Опишите задачу своими словами';
      if (tag === 'input') return 'Сюда — ваш контакт';
      if (tag === 'button' || tag === 'a') {
        const label = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32);
        if (label) return label;
      }
      return null;
    };
    let hintEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      if (openRef.current || mode !== 'companion' || transcribing) return;
      const el =
        (e.target as HTMLElement).closest?.('[data-hint], textarea, input, button, a, article') ??
        null;
      if (el === hintEl) return;
      hintEl = el;
      const h = el ? hintFor(el) : null;
      if (h) say(h, 4200);
      else hush();
    };
    addEventListener('mouseover', onOver, { passive: true });

    // ─── Transcript: while an audio review plays, narrate it (#B6) ───
    const onTranscript = (e: Event) => {
      const d = (e as CustomEvent<{ text: string; playing: boolean }>).detail;
      if (!d) return;
      if (d.playing && d.text) {
        transcribing = true;
        hintEl = null;
        say(d.text);
      } else {
        transcribing = false;
        hush();
      }
    };
    addEventListener('tachos:transcript', onTranscript as EventListener);

    // ─── Footer perch visibility ───
    let footerVisible = false;
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
      const k = Math.atan2(my - pos.y, mx - pos.x) - faceAng;
      const ex = Math.cos(k) * 1.3,
        ey = Math.sin(k) * 1.3;
      if (eyeL.current) eyeL.current.style.transform = `translate(${ex}px,${ey}px)`;
      if (eyeR.current) eyeR.current.style.transform = `translate(${ex}px,${ey}px)`;
    };

    // Idle tricks: unhurried (#B5) — flip / squish / wobble, only after a real pause
    // and rarely. No shatter (too jumpy).
    const TRICKS = ['spin', 'squish', 'wobble'];
    const maybeTrick = (now: number) => {
      if (mode !== 'companion' || openRef.current || transcribing) return;
      if (now - lastMove < 5000 || now - lastTrick < 14000) return;
      lastTrick = now;
      // WHY: index is Math.floor(random * length), always within TRICKS bounds.
      const t = TRICKS[Math.floor(Math.random() * TRICKS.length)]!;
      root.current?.classList.add(t);
      setTimeout(() => root.current?.classList.remove(t), 950);
    };

    let raf = 0;
    const loop = () => {
      if (openRef.current && !prevOpen) {
        prevOpen = true;
        if (!transcribing) hush();
      } else if (!openRef.current && prevOpen) {
        prevOpen = false;
      }

      // mode switch on footer visibility (don't perch while the modal is open)
      if (mode !== 'appear' && !openRef.current) {
        if (footerVisible && mode !== 'footer-perch') {
          mode = 'footer-perch';
        } else if (!footerVisible && mode === 'footer-perch') {
          mode = 'companion';
          if (root.current) root.current.style.opacity = '1';
        }
      }

      const now = performance.now();

      if (mode === 'appear') {
        const k = Math.min(Math.max((now - appearStart) / 340, 0), 1);
        curScale = Math.max(0, easeOutBack(k));
        pos.x = lerp(pos.x, mx + OFF_X, 0.06);
        pos.y = lerp(pos.y, my + OFF_Y, 0.06);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.1);
        render(curScale);
        if (k >= 1) mode = 'companion';
      } else if (mode === 'footer-perch') {
        // hand off to the big generated Начос image in the footer — the cursor
        // mascot fades out here and doesn't follow into the footer
        if (root.current) root.current.style.opacity = '0';
      } else {
        // companion — lazy orbit + soft repel + gentle breathing scale
        orbit += 0.0035 + Math.sin(now * 0.0004) * 0.0015;
        let tx = mx + Math.cos(orbit) * 112,
          ty = my + Math.sin(orbit) * 80;
        tx = Math.max(32, Math.min(innerWidth - 44, tx));
        ty = Math.max(72, Math.min(innerHeight - 50, ty));
        pos.x = lerp(pos.x, tx, 0.05);
        pos.y = lerp(pos.y, ty, 0.05);
        const dd = Math.hypot(pos.x - mx, pos.y - my);
        if (dd < 58) {
          const safe = Math.max(dd, 16);
          const k = 0.22 * ((58 - dd) / 58);
          pos.x = lerp(pos.x, mx + ((pos.x - mx) / safe) * 110, k);
          pos.y = lerp(pos.y, my + ((pos.y - my) / safe) * 110, k);
        }
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.12);
        const breathe = 1 + Math.sin(now * 0.0018) * 0.04;
        curScale = lerp(curScale, breathe, 0.12);
        render(curScale);
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
      removeEventListener('tachos:transcript', onTranscript as EventListener);
      perchObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={root}
        aria-hidden
        className="companion pointer-events-none fixed left-0 top-0 z-[120]"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(248,72,0,.4))', transition: 'opacity 0.5s ease' }}
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
        className="bubble pointer-events-none fixed left-0 top-0 z-[121] w-[262px] rounded-[16px] bg-ink px-[16px] py-[12px] text-inverted shadow-[0_14px_40px_rgba(0,0,0,0.4)]"
      >
        <b ref={bTitle} className="block text-[14px] font-semibold leading-[1.4]" />
      </div>
    </>
  );
}
