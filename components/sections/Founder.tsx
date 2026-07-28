'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { founder } from '@/lib/content';
import { useTouchDevice } from '@/lib/useMediaQuery';

const widget = {
  badge: 'Экстренная связь с основателем',
  online: 'На связи',
  collapse: 'Свернуть',
} as const;

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MagneticButton({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      data-compose
      className={`${className} transition-transform duration-300 ease-out`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </button>
  );
}

// Founder is now a small FIXED widget on the right edge (it took a whole tall
// section before). Collapsed = an avatar dot with a hover label; clicking opens
// the full card as a centred overlay. Being fixed, it adds no flow height — so
// the cases section also sits closer under the hero (#17).
export function Founder() {
  const [expanded, setExpanded] = useState(false);
  // The dot magnets to one of the four corners, and the panel opens INTO that
  // corner — it takes the dot's own place (the dot hides while open), so it
  // reads as the dot unfolding rather than a window appearing elsewhere.
  const [corner, setCorner] = useState<{ h: 'left' | 'right'; v: 'top' | 'bottom' }>({
    h: 'right',
    v: 'bottom',
  });
  const panelId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Physics state for the draggable corner-magnet widget (kept in a ref so the
  // rAF spring loop never triggers React re-renders — we write transform to DOM).
  const stRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    grabx: 0,
    graby: 0,
    dragging: false,
    moved: 0,
    raf: 0,
    suppressClick: false,
  });
  const [mounted, setMounted] = useState(false);
  // Hide the draggable widget on touch devices — drag fights page scroll and the
  // dot has nowhere good to sit on a phone (mirrors the mascot's touch guard).
  const touchDevice = useTouchDevice();

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  useEffect(() => {
    if (expanded) cardRef.current?.focus();
  }, [expanded]);

  // Draggable founder dot: snaps to the nearest screen corner, springs back with
  // overshoot when thrown ("туда-сюда пам-пам" per Vadim). Default = bottom-right,
  // lower than before. All motion via DOM transform; reduced-motion = instant snap.
  useEffect(() => {
    const btn = toggleRef.current;
    if (!btn) return;
    const s = stRef.current;
    const W = 52; // dot diameter
    const M = 20; // edge margin
    const TOP = 88; // keep top corners below the fixed nav
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => {
      btn.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    };
    const corners = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return [
        { x: M, y: TOP, side: 'left' },
        { x: vw - M - W, y: TOP, side: 'right' },
        { x: M, y: vh - M - W, side: 'left' },
        { x: vw - M - W, y: vh - M - W, side: 'right' },
      ];
    };
    const nearest = () => {
      let best = corners()[3]!; // WHY: corners() returns a fixed 4-element array; [3] always exists
      let bd = Infinity;
      for (const c of corners()) {
        const d = (c.x - s.x) ** 2 + (c.y - s.y) ** 2;
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      return best;
    };
    const tick = () => {
      // under-damped spring → a couple of visible wobbles; thrown velocity is
      // carried in, so the harder you fling it the bigger the bounce.
      s.vx = (s.vx + (s.tx - s.x) * 0.16) * 0.74;
      s.vy = (s.vy + (s.ty - s.y) * 0.16) * 0.74;
      s.x += s.vx;
      s.y += s.vy;
      apply();
      if (
        Math.abs(s.vx) < 0.12 &&
        Math.abs(s.vy) < 0.12 &&
        Math.abs(s.tx - s.x) < 0.4 &&
        Math.abs(s.ty - s.y) < 0.4
      ) {
        s.x = s.tx;
        s.y = s.ty;
        s.vx = 0;
        s.vy = 0;
        apply();
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (s.raf) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      }
    };

    const init = corners()[3]!; // bottom-right — WHY: corners() returns a fixed 4-element array; [3] always exists
    s.x = s.tx = init.x;
    s.y = s.ty = init.y;
    s.vx = s.vy = 0;
    btn.dataset.side = 'right';
    apply();
    setMounted(true);

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nx = clamp(e.clientX - s.grabx, 4, vw - W - 4);
      const ny = clamp(e.clientY - s.graby, 4, vh - W - 4);
      s.moved += Math.hypot(nx - s.x, ny - s.y);
      s.vx = clamp(nx - s.x, -46, 46);
      s.vy = clamp(ny - s.y, -46, 46);
      s.x = nx;
      s.y = ny;
      apply();
    };
    const onUp = () => {
      if (!s.dragging) return;
      s.dragging = false;
      btn.dataset.dragging = '0';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const n = nearest();
      s.tx = n.x;
      s.ty = n.y;
      btn.dataset.side = n.side;
      s.suppressClick = s.moved >= 6; // a real drag must not also open the card
      if (reduce()) {
        s.x = s.tx;
        s.y = s.ty;
        s.vx = s.vy = 0;
        apply();
      } else {
        startLoop();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      stopLoop();
      s.dragging = true;
      s.moved = 0;
      s.suppressClick = false;
      s.grabx = e.clientX - s.x;
      s.graby = e.clientY - s.y;
      s.vx = s.vy = 0;
      btn.dataset.dragging = '1';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };
    const onResize = () => {
      if (s.dragging) return;
      const n = nearest();
      s.tx = n.x;
      s.ty = n.y;
      btn.dataset.side = n.side;
      if (reduce()) {
        s.x = s.tx;
        s.y = s.ty;
        apply();
      } else {
        startLoop();
      }
    };

    btn.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      btn.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      stopLoop();
    };
  }, []);

  // No draggable founder widget on touch — keep the phone clean.
  if (touchDevice) return null;

  return (
    <>
      <style>{`
        @keyframes fnd-slide-r { from { opacity: 0; transform: translateX(26px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes fnd-slide-l { from { opacity: 0; transform: translateX(-26px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes fnd-ping { 0% { transform: scale(1); opacity: 0.55; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
        .fnd-dot[data-dragging="1"] { cursor: grabbing; }
        .fnd-dot img { -webkit-user-drag: none; user-select: none; }
      `}</style>

      {/* ─── Collapsed: compact avatar widget pinned to the right edge ─── */}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        data-side="right"
        data-hint={widget.badge}
        data-hint-sub={`${founder.person.name} · ${widget.online}`}
        onDragStart={(e) => e.preventDefault()}
        onClick={() => {
          // a real drag set this flag in pointerup — swallow the synthetic click
          if (stRef.current.suppressClick) {
            stRef.current.suppressClick = false;
            return;
          }
          setCorner({
            h: toggleRef.current?.dataset.side === 'left' ? 'left' : 'right',
            v: stRef.current.y + 26 < window.innerHeight / 2 ? 'top' : 'bottom',
          });
          setExpanded(true);
        }}
        className={`fnd-dot group fixed left-0 top-0 z-[90] flex cursor-grab touch-none select-none items-center rounded-full outline-none transition-opacity duration-500 will-change-transform focus-visible:ring-2 focus-visible:ring-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:cursor-grabbing ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ visibility: expanded ? 'hidden' : 'visible' }}
      >
        <span className="relative grid size-[52px] shrink-0 place-items-center">
          <span className="absolute inset-0 rounded-full bg-accent-bright/40 [animation:fnd-ping_2.6s_ease-out_infinite] motion-reduce:hidden" />
          <span className="relative size-[52px] overflow-hidden rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.4)] ring-2 ring-accent-bright/70">
            <Image
              src={asset('/figma/founder-container.jpg')}
              alt={founder.person.name}
              fill
              sizes="52px"
              draggable={false}
              className="object-cover"
            />
          </span>
          <span className="absolute -bottom-[1px] -right-[1px] size-[14px] rounded-full border-2 border-ink bg-[#3ad29f]" />
        </span>
      </button>

      {/* ─── Expanded: a slim panel that slides out of the dot's own edge ───
          Not a full-screen modal: the page stays visible and un-dimmed behind
          it, so the founder reads as a side widget you peek at, not a dialog
          that seizes the screen. An invisible catcher closes it on outside click. */}
      {expanded && (
        <>
          <div
            className="fixed inset-0 z-[110]"
            aria-hidden
            onClick={() => {
              setExpanded(false);
              toggleRef.current?.focus();
            }}
          />
          <div
            ref={cardRef}
            id={panelId}
            role="region"
            aria-label={`${founder.person.name} — ${founder.person.role}`}
            tabIndex={-1}
            className={`fixed z-[115] max-h-[calc(100vh-40px)] w-[390px] max-w-[calc(100vw-40px)] overflow-y-auto overscroll-contain rounded-[28px] border border-white/10 bg-ink shadow-[0_30px_90px_rgba(0,0,0,0.6)] outline-none motion-reduce:[animation:none] ${
              corner.v === 'top' ? 'top-[20px]' : 'bottom-[20px]'
            } ${
              corner.h === 'left'
                ? 'left-[20px] [animation:fnd-slide-l_0.42s_cubic-bezier(0.16,1,0.3,1)_both]'
                : 'right-[20px] [animation:fnd-slide-r_0.42s_cubic-bezier(0.16,1,0.3,1)_both]'
            }`}
          >
            <button
              type="button"
              aria-label={widget.collapse}
              onClick={() => {
                setExpanded(false);
                toggleRef.current?.focus();
              }}
              className="absolute right-[14px] top-[14px] z-20 grid size-[34px] place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright"
            >
              <CloseIcon />
            </button>

            {/* Contact-card header: the photo owns the top of the panel and the
                name sits on it, the way a phone shows a contact. */}
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={asset('/figma/founder-container.jpg')}
                alt="Вадим — основатель студии"
                fill
                sizes="390px"
                priority
                className="object-cover object-[center_28%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-[22px]">
                <div className="text-[23px] font-semibold leading-tight tracking-[-0.01em] text-inverted">
                  {founder.person.name}
                </div>
                <div className="mt-[2px] text-[14px] text-inverted/60">{founder.person.role}</div>
                <div className="mt-[7px] flex items-center gap-[6px] text-[13px] text-[#3ad29f]">
                  <span className="size-[6px] rounded-full bg-[#3ad29f]" />
                  {widget.online}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-[20px] p-[24px]">
              <h2 className="text-[19px] font-semibold leading-[1.25] tracking-[-0.01em] text-inverted">
                {founder.heading.join(' ')}
              </h2>

              <ul className="flex flex-col gap-[11px] text-[14.5px] leading-[1.3] text-inverted/60">
                {founder.facts.map((fact) => (
                  <li key={fact} className="flex gap-[8px]">
                    <span className="text-accent-bright">–</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-[18px]">
                <MagneticButton className="h-[50px] w-full rounded-[50px] bg-white text-[15px] font-medium text-black hover:brightness-95">
                  {founder.contactCta}
                </MagneticButton>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
