'use client';

import { useEffect, useRef } from 'react';
import { categorize, nachosLine, type NachosCategory } from '@/lib/nachos-lines';
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
  const pupilL = useRef<SVGCircleElement>(null);
  const pupilR = useRef<SVGCircleElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const bTitle = useRef<HTMLElement>(null);

  useEffect(() => {
    openRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduced) {
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
    const FOOTER_SCALE = 15; // how big he grows in the footer perch (base art box is 33px)

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
    if (!isTouch) addEventListener('mousemove', onMove, { passive: true });

    // ─── HINT: say something OF HIS OWN about the element under the cursor (never
    // echo its label). data-hint = the element TYPE, data-hint-sub = its entity; the
    // line pool lives in lib/nachos-lines. lastLine avoids an immediate repeat. ───
    let lastLine = '';
    const lineFor = (el: Element): string | null => {
      const dh = el.getAttribute('data-hint');
      let category: NachosCategory;
      let name = '';
      if (dh) {
        ({ category, name } = categorize(dh, el.getAttribute('data-hint-sub')));
      } else {
        const tag = el.tagName.toLowerCase();
        // bare controls without a hint: the compose textarea reads as the hero prompt,
        // a stray input as a contact field, anything else clickable stays generic.
        if (tag === 'textarea') category = 'hero';
        else if (tag === 'input') category = 'contact';
        else if (tag === 'button' || tag === 'a') category = 'generic';
        else return null;
      }
      const line = nachosLine(category, name, lastLine);
      lastLine = line;
      return line;
    };
    // Small body reaction when he speaks — bobs once so a new line feels like HE chose
    // to say it, not a tooltip popping. Skipped if a trick is already playing.
    const reactNod = () => {
      const r = root.current;
      if (!r || r.classList.contains('squish') || r.classList.contains('spin')) return;
      r.classList.add('squish');
      setTimeout(() => r.classList.remove('squish'), 600);
    };
    let hintEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      if (openRef.current || mode !== 'companion' || transcribing) return;
      const el =
        (e.target as HTMLElement).closest?.('[data-hint], textarea, input, button, a, article') ??
        null;
      if (el === hintEl) return;
      hintEl = el;
      const line = el ? lineFor(el) : null;
      if (line) {
        say(line, 4800);
        reactNod();
      } else hush();
    };
    if (!isTouch) addEventListener('mouseover', onOver, { passive: true });
    // Touch: no cursor → the mascot lives on the right, travels with the scroll, grows
    // near the footer and pipes up on its own (the loop's touch branch positions it). #31/#32
    const onScrollTouch = () => {
      lastMove = performance.now();
    };
    if (isTouch) addEventListener('scroll', onScrollTouch, { passive: true });

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
      // small cursor companion faces the pointer (faceAng); in the footer perch faceAng
      // eases to π/2 so the BIG mascot points nose-down. Offset = half the 33px box.
      root.current.style.transform = `translate3d(${pos.x - 16.5}px,${pos.y - 16.5}px,0) scale(${scale})`;
      rot.current?.setAttribute('transform', `rotate(${(faceAng * 180) / Math.PI} 13 13)`);
      const k = Math.atan2(my - pos.y, mx - pos.x) - faceAng;
      const ex = Math.cos(k) * 1.3,
        ey = Math.sin(k) * 1.3;
      // the white drifts a little; the black pupil tracks further INSIDE it (additive),
      // so the eyes read as actually looking at the cursor (#8)
      const wx = ex * 0.5,
        wy = ey * 0.5;
      const dx = ex * 0.45,
        dy = ey * 0.45;
      if (eyeL.current) eyeL.current.style.transform = `translate(${wx}px,${wy}px)`;
      if (eyeR.current) eyeR.current.style.transform = `translate(${wx}px,${wy}px)`;
      if (pupilL.current) pupilL.current.style.transform = `translate(${dx}px,${dy}px)`;
      if (pupilR.current) pupilR.current.style.transform = `translate(${dx}px,${dy}px)`;
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

      if (isTouch) {
        // touch: no cursor — hang on the right, TRAVEL with the scroll, grow big near
        // the footer, nose-down, and speak on his own now and then. #31/#32
        mx = innerWidth - 46;
        my = innerHeight * (footerVisible ? 0.78 : 0.58);
        pos.x = lerp(pos.x, mx, 0.05);
        pos.y = lerp(pos.y, my, 0.05);
        curScale = lerp(curScale, footerVisible ? 6 : 1.5, 0.05);
        faceAng = lerp(faceAng, Math.PI / 2, 0.05);
        render(curScale);
        if (!openRef.current && !transcribing && now - lastTrick > 9000 && now - lastMove > 1400) {
          lastTrick = now;
          say(nachosLine('generic', '', ''), 4200);
          reactNod();
        }
        raf = requestAnimationFrame(loop);
        return;
      }

      if (mode === 'appear') {
        const k = Math.min(Math.max((now - appearStart) / 340, 0), 1);
        curScale = Math.max(0, easeOutBack(k));
        pos.x = lerp(pos.x, mx + OFF_X, 0.06);
        pos.y = lerp(pos.y, my + OFF_Y, 0.06);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.1);
        render(curScale);
        if (k >= 1) mode = 'companion';
      } else if (mode === 'footer-perch') {
        // grow into the BIG footer mascot: ease to the perch centre and scale up, but
        // keep watching the cursor with the EYES (render) — he doesn't chase it here.
        // Scrolling back up flips mode to companion and he eases back down to the
        // cursor — the lerps make both directions a smooth grow/shrink transition.
        if (root.current) root.current.style.opacity = '1';
        if (perchEl) {
          const pr = perchEl.getBoundingClientRect();
          pos.x = lerp(pos.x, pr.left + pr.width / 2, 0.08);
          pos.y = lerp(pos.y, pr.top + pr.height / 2, 0.08);
        }
        curScale = lerp(curScale, FOOTER_SCALE, 0.08);
        faceAng = lerp(faceAng, Math.PI / 2, 0.08); // turn nose-down in the perch
        render(curScale);
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
        style={{ transition: 'opacity 0.5s ease' }}
      >
        {/* glow as a separate layer — NOT a drop-shadow filter on the SVG, which would
            rasterise the triangle at 33px and blur it when scaled up in the perch */}
        <span aria-hidden className="comp-glow" />
        <svg width="33" height="33" viewBox="0 0 26 26">
          <g ref={rot}>
            <path
              d="M22.5 13 L6.5 4.5 Q3.5 3 3.9 6.3 L5.8 19.7 Q6.2 23 9.2 21.5 Z"
              fill="#F84800"
            />
            <g ref={eyeL} className="eye">
              <circle cx="10.2" cy="10" r="2.1" fill="#fff" />
              <circle ref={pupilL} cx="10.9" cy="10" r="1" fill="#0E0E10" />
              <rect className="lid" x="7.6" y="7.4" width="5.2" height="5.2" rx="2.6" fill="#F84800" />
            </g>
            <g ref={eyeR} className="eye">
              <circle cx="10.8" cy="15.6" r="2.1" fill="#fff" />
              <circle ref={pupilR} cx="11.5" cy="15.6" r="1" fill="#0E0E10" />
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
