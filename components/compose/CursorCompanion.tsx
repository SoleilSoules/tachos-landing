'use client';

import { useEffect, useRef } from 'react';
import { useCompose } from './ComposeProvider';

// Tachos Nachos — the studio mascot. On load he simply pops into existence near the
// cursor (scale-in, no logo origin, no falling). His home is not a corner: by
// default he just chills next to the real cursor; if the visitor sits idle on the
// first screen he flies to centre-stage to nudge them to scroll. He also announces
// the CTA / more-cases, perches on the open letter, and carries the hero text down
// into the footer brief. (Vadim's brief.)
export function CursorCompanion() {
  const { isOpen, open } = useCompose();
  const openRef = useRef(isOpen);
  const root = useRef<HTMLDivElement>(null);
  const rot = useRef<SVGGElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const bTitle = useRef<HTMLElement>(null);
  const bSub = useRef<HTMLElement>(null);
  // Action fired when the (occasionally clickable) bubble is tapped — set while
  // the mascot is mid-announce with a call-to-action (e.g. open the letter).
  const actionRef = useRef<(() => void) | null>(null);

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
    const formPt = () => ({ x: innerWidth / 2, y: innerHeight * 0.13 });

    let mx = innerWidth / 2,
      my = innerHeight * 0.42,
      lastMove = performance.now();
    let pos = { x: mx, y: my - 40 };
    let mode: 'appear' | 'companion' | 'flying' | 'form' | 'announce' | 'footer-perch' = 'appear';

    // simple appear: a short delay, then scale up in place near the cursor — no
    // logo origin, no falling. Then behave normally.
    const appearStart = performance.now() + 160;
    let scaleCur = 0;

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
      faceAng = Math.PI / 2,
      prevOpen = false,
      bubbleTimer: ReturnType<typeof setTimeout>;
    let alive = true;
    let scrolled = false;
    let scrollHintShown = false;
    // announce mode: hold at a point and speak for a while, then return to cursor.
    let announcePt: { x: number; y: number } | null = null;
    let announceUntil = 0;
    let ctaShown = false;
    let casesShown = false;
    let lastTrick = performance.now();

    let typeTimer: ReturnType<typeof setTimeout>;
    const stopTyping = () => {
      clearTimeout(typeTimer);
      bTitle.current?.classList.remove('talk-caret');
      bSub.current?.classList.remove('talk-caret');
    };
    // Type a string into `el` one character at a time, then run `done`. A blinking
    // caret rides the line being typed so the mascot reads as actually speaking.
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
      // type the title, then the sub-line — the caret hands off between them.
      // Calmer pace (was 26/16) so the mascot's speech is comfortable to read.
      typeInto(bTitle.current, title, 42, () => typeInto(bSub.current, sub, 30));
      clearTimeout(bubbleTimer);
      if (ms) bubbleTimer = setTimeout(() => bubble.current?.classList.remove('show'), ms);
    };
    const hush = () => {
      clearTimeout(bubbleTimer);
      stopTyping();
      bubble.current?.classList.remove('show');
      bubble.current?.classList.remove('actionable');
      actionRef.current = null;
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
    // Default "home" is wherever the cursor is — glide back to it, then chill.
    const backToCursor = () => {
      hush();
      flyTo(mx + 60, my - 40, 600, () => {
        mode = 'companion';
      });
    };
    const toForm = () => {
      const p = formPt();
      flyTo(p.x, p.y, 700, () => {
        mode = 'form';
        say('Письмо пишется само', 'выберите пару пунктов — я рядом', 4200);
      });
    };

    // Generic "fly out and announce": land at (x,y), speak, hold for `ms`, then
    // return to the cursor. If `action` is given the bubble becomes clickable.
    const announce = (
      x: number,
      y: number,
      title: string,
      sub: string,
      ms: number,
      action?: () => void,
    ) => {
      if (openRef.current) return;
      actionRef.current = action ?? null;
      bubble.current?.classList.toggle('actionable', !!action);
      flyTo(x, y, 720, () => {
        mode = 'announce';
        announcePt = { x, y };
        announceUntil = performance.now() + ms;
        say(title, sub);
      });
    };

    // Idle on the first screen → the mascot flies to screen *centre* and calls the
    // visitor to scroll down. Fires once, only while still at the top of the page.
    const scrollHint = () => {
      if (scrollHintShown || scrolled || openRef.current || mode === 'form' || mode === 'appear')
        return;
      scrollHintShown = true;
      announce(innerWidth / 2, innerHeight * 0.46, 'Листайте вниз 👇', 'там кейсы и живая форма', 4500);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };
    addEventListener('mousemove', onMove, { passive: true });

    let hintEl: Element | null = null;
    const onOver = (e: MouseEvent) => {
      if (openRef.current || mode === 'announce' || mode === 'appear') return;
      const el = (e.target as HTMLElement).closest?.('[data-hint]') ?? null;
      if (el === hintEl) return;
      hintEl = el;
      if (el) say(el.getAttribute('data-hint') || '', el.getAttribute('data-hint-sub') || '', 4200);
    };
    addEventListener('mouseover', onOver, { passive: true });

    const onScroll = () => {
      if (!scrolled) scrolled = true;
      // At the CTA zone / end of cases the mascot flies to screen centre and speaks
      // the message the floating plates used to show. Each fires once.
      if (openRef.current || mode === 'flying' || mode === 'form' || mode === 'announce' || mode === 'appear')
        return;
      const focus = innerHeight * 0.6;
      if (!ctaShown) {
        const el = document.getElementById('cta-zone');
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= focus && r.bottom >= focus) {
            ctaShown = true;
            announce(
              innerWidth / 2,
              innerHeight / 2,
              'Обсудить проект?',
              'посчитаем и предложим состав работ — нажмите',
              6000,
              () => open(),
            );
            return;
          }
        }
      }
      if (!casesShown) {
        const el = document.getElementById('cases-end');
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top > innerHeight * 0.2 && r.top < innerHeight * 0.9) {
            casesShown = true;
            announce(innerWidth / 2, innerHeight / 2, 'Ещё кейсы?', '40+ цифровых продуктов в портфолио', 5000);
          }
        }
      }
    };
    addEventListener('scroll', onScroll, { passive: true });

    // Footer perch: the footer reserves a slot [data-mascot-perch]. When it scrolls
    // into view the mascot flies there, grows big and SITS — stops chasing the
    // cursor (just watches with its eyes + speaks). Leaves when the footer scrolls
    // away or the modal opens.
    let footerVisible = false;
    let perchedSaid = false;
    const perchEl = document.querySelector('[data-mascot-perch]');
    let perchObserver: IntersectionObserver | null = null;
    if (perchEl && 'IntersectionObserver' in window) {
      // hysteresis: enter the perch at ≥45% visible, leave only below 10% — stops
      // the perch/companion flip-flopping when the cursor hovers the threshold.
      perchObserver = new IntersectionObserver(
        ([e]) => {
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
      const k = Math.atan2(my - pos.y, mx - pos.x) - faceAng;
      const ex = Math.cos(k) * 1.3,
        ey = Math.sin(k) * 1.3;
      if (eyeL.current) eyeL.current.style.transform = `translate(${ex}px,${ey}px)`;
      if (eyeR.current) eyeR.current.style.transform = `translate(${ex}px,${ey}px)`;
    };

    // Idle "tricks": when chilling by the cursor and untouched for a while, the
    // mascot does a playful flip / squish / scatter-regroup so it reads as alive.
    const TRICKS = ['spin', 'squish', 'shatter'];
    const maybeTrick = (now: number) => {
      if (mode !== 'companion' || openRef.current) return;
      if (now - lastMove < 4000 || now - lastTrick < 10000) return;
      lastTrick = now;
      const t = TRICKS[Math.floor(Math.random() * TRICKS.length)];
      root.current?.classList.add(t);
      setTimeout(() => root.current?.classList.remove(t), 950);
    };

    let raf = 0;
    const loop = () => {
      if (openRef.current && !prevOpen) {
        prevOpen = true;
        hush();
        toForm();
      } else if (!openRef.current && prevOpen) {
        prevOpen = false;
        backToCursor();
      }

      // footer perch: fly in when the footer slot is visible, leave when it's gone.
      // Skip while an announce (cta/cases) is mid-flight so we don't cut it off.
      if (perchEl && !openRef.current) {
        if (footerVisible && mode !== 'footer-perch' && mode !== 'flying' && mode !== 'announce') {
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
        // just pop into existence near the cursor — no logo, no falling
        const k = Math.min(Math.max((now - appearStart) / 340, 0), 1);
        scaleCur = Math.max(0, easeOutBack(k));
        pos.x = lerp(pos.x, mx, 0.05);
        pos.y = lerp(pos.y, my - 40, 0.05);
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.1);
        render(scaleCur);
        if (k >= 1) {
          mode = 'companion';
          say('Это Начос 🔥', 'я рядом — помогу с письмом', 4800);
        }
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
      } else if (mode === 'announce') {
        if (announcePt) {
          pos.x = lerp(pos.x, announcePt.x, 0.16);
          pos.y = lerp(pos.y, announcePt.y, 0.16);
        }
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.1);
        render(1 + Math.sin(now * 0.004) * 0.04);
        if (now > announceUntil) {
          announcePt = null;
          backToCursor();
        }
      } else if (mode === 'form') {
        const p = formPt();
        pos.x = lerp(pos.x, p.x, 0.18);
        pos.y = lerp(pos.y, p.y, 0.18);
        faceAng = lerp(faceAng, Math.PI / 2, 0.12);
        render(1);
      } else if (mode === 'footer-perch') {
        // sit on the footer slot (recompute each frame — scroll moves it), grow
        // big and watch the cursor with the eyes; no chasing.
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
        // companion — lazy orbit around the cursor, with a springy "you can't catch
        // me" repulsion: as the cursor closes in, the *target* slides away (fading
        // smoothly with distance, safe at d→0) and a single lerp eases him there.
        // Folding repulsion into the target — instead of a second position
        // correction fighting the orbit — kills the old jitter/stick.
        // original feel (pre-fixes): lazy orbit + a push-away when the cursor gets
        // within 64px, eased at 0.045. Restored verbatim per Gosha.
        orbit += 0.004 + Math.sin(now * 0.0004) * 0.002;
        let tx = mx + Math.cos(orbit) * 120,
          ty = my + Math.sin(orbit) * 84;
        tx = Math.max(32, Math.min(innerWidth - 44, tx));
        ty = Math.max(72, Math.min(innerHeight - 50, ty));
        pos.x = lerp(pos.x, tx, 0.045);
        pos.y = lerp(pos.y, ty, 0.045);
        // push-away with two anti-"stuck" guards that keep the original feel:
        //  • floor the divisor so the direction can't flip wildly when the cursor
        //    sits right on him (the d→0 jitter that made him vibrate in place);
        //  • fade the strength to 0 at the 64px edge instead of a hard on/off, so
        //    he doesn't buzz across that boundary and stick in the repel state.
        const dd = Math.hypot(pos.x - mx, pos.y - my);
        if (dd < 64) {
          const safe = Math.max(dd, 16);
          const k = 0.3 * ((64 - dd) / 64);
          pos.x = lerp(pos.x, mx + ((pos.x - mx) / safe) * 120, k);
          pos.y = lerp(pos.y, my + ((pos.y - my) / safe) * 120, k);
        }
        faceAng = lerp(faceAng, Math.atan2(my - pos.y, mx - pos.x), 0.12);
        render(1);
        maybeTrick(now);
        // idle at the top of the page → nudge them to scroll
        if (!scrolled && !scrollHintShown && now - lastMove > 5200) scrollHint();
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
      removeEventListener('scroll', onScroll);
      perchObserver?.disconnect();
    };
  }, [open]);

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
        onClick={() => actionRef.current?.()}
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
