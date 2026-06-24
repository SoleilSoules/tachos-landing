'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { founder } from '@/lib/content';

const widget = {
  badge: 'Экстренная связь с основателем',
  online: 'На связи',
  collapse: 'Свернуть',
} as const;

function PlayIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden>
      <path d="M1 1.5 12 7.5 1 13.5V1.5Z" fill="currentColor" />
    </svg>
  );
}
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
  const [touchDevice, setTouchDevice] = useState(false);
  useEffect(() => {
    setTouchDevice(window.matchMedia('(hover: none), (pointer: coarse)').matches);
  }, []);

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
        @keyframes fnd-rise { from { opacity: 0; transform: translate(-50%,-50%) scale(0.97); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
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

      {/* ─── Expanded: full founder card as a centred overlay ─── */}
      {expanded && (
        <div
          className="fixed inset-0 z-[115] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => {
            setExpanded(false);
            toggleRef.current?.focus();
          }}
        >
          <div
            ref={cardRef}
            id={panelId}
            role="region"
            aria-label={`${founder.person.name} — ${founder.person.role}`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="relative h-[414px] w-[1030px] max-w-full overflow-hidden rounded-founder bg-ink outline-none [animation:fnd-rise_0.42s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:[animation:none]"
            style={{ position: 'fixed', left: '50%', top: '50%' }}
          >
            <Image
              src={asset('/figma/founder-card-bg.png')}
              alt=""
              fill
              sizes="1030px"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_72%_72%,rgba(240,81,56,0.28),transparent_70%)]" />

            <button
              type="button"
              aria-label={widget.collapse}
              onClick={() => {
                setExpanded(false);
                toggleRef.current?.focus();
              }}
              className="absolute right-[20px] top-[20px] z-10 grid size-[40px] place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright"
            >
              <CloseIcon />
            </button>

            <div className="absolute inset-y-0 right-0 w-[472px] overflow-hidden rounded-l-[28px]">
              <Image
                src={asset('/figma/founder-container.jpg')}
                alt="Вадим — основатель студии"
                fill
                sizes="480px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-[24px] left-[28px]">
                <div className="text-[24px] font-semibold leading-tight text-white">
                  {founder.person.name}
                </div>
                <div className="text-[15px] text-white/60">{founder.person.role}</div>
              </div>
            </div>

            <div className="absolute inset-y-[32px] left-[32px] flex w-[440px] flex-col justify-between">
              <div>
                <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-inverted">
                  {founder.heading[0]}
                  <br />
                  {founder.heading[1]}
                  <br />
                  {founder.heading[2]}
                </h2>
                <ul className="mt-[28px] flex flex-col gap-[16px] text-[19px] leading-[1.2] text-inverted/60">
                  {founder.facts.map((fact) => (
                    <li key={fact}>
                      <span className="text-accent-bright">–</span> {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-[12px]">
                <MagneticButton className="h-[56px] shrink-0 whitespace-nowrap rounded-[54px] bg-white px-[28px] text-[16px] font-medium text-black hover:brightness-95">
                  {founder.contactCta}
                </MagneticButton>
                <button
                  type="button"
                  className="flex h-[56px] items-center gap-[10px] whitespace-nowrap px-[8px] text-[16px] text-inverted transition hover:opacity-80"
                >
                  <span className="grid size-[36px] shrink-0 place-items-center rounded-full bg-white/15">
                    <PlayIcon />
                  </span>
                  {founder.presentation.label}
                  <span className="text-inverted/50">{founder.presentation.duration}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
