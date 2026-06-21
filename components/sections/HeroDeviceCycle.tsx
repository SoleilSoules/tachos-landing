'use client';

import { useEffect, useRef, useState } from 'react';

// Hero background — "Redline Depth Rail" showreel. Five code-drawn Tachos product
// devices ride ONE shared 3D rail: a single device holds focus, fully lit and sharp,
// while siblings recede into depth (smaller, dimmer, blurred) and two deep ghosts
// park in the side gutters. On a calm 4.2s cadence the rail relays forward — the
// incoming device decelerates into focus (house ease-out) while the outgoing one
// arcs up+back and fades (accelerate-away), reading as continuous cinematic travel
// rather than a slideshow swap. A tachometer needle ticks to redline and a one-shot
// light-sweep glint fire once per cycle on the focused screen (the brand cue).
//
// All ambient light is locked to the orange #f05138 "redline" family so the hero
// always feels like Tachos; only the small in-screen header tints vary per project.
// Sits BEHIND the hero copy (aria-hidden, inside the page's pointer-events-none /
// below-z-10 wrapper) and is dimmed by an elliptical readability scrim + the page
// wash so the H1 and the white prompt pill stay legible. Code-only: no media, no
// new deps — 100% static-export safe. GPU-friendly: only transform/opacity/filter
// animate; box-shadow + background are held static.

type Proj = {
  name: string;
  tagline: string;
  grad: string; // small in-screen header tint (varies per project)
  orb: string; // in-screen header orb (redline-biased so green/blue never dominates)
  device: 'phone' | 'tablet';
};

// In-screen header grads: skladno (blue-grey) + hais (green) lifted from CaseCover,
// plus three orange-leaning grads authored for doki / balibali / hub so the in-screen
// tint never reintroduces a dominant green/blue. Every `orb` is the redline-orange
// ambient — the per-device light is always Tachos; only the small header varies.
const PROJECTS: Proj[] = [
  {
    name: 'doki',
    tagline: 'управление документами',
    grad: 'from-[#5a230f] via-[#321307] to-[#190a05]',
    orb: 'rgba(240,110,70,0.42)',
    device: 'phone',
  },
  {
    name: 'balibali',
    tagline: 'конструктор ресторанов',
    grad: 'from-[#5e2a12] via-[#37180a] to-[#1b0c05]',
    orb: 'rgba(240,118,72,0.42)',
    device: 'tablet',
  },
  {
    name: 'hub',
    tagline: 'складской учёт',
    grad: 'from-[#5a2814] via-[#34160a] to-[#1a0a04]',
    orb: 'rgba(240,110,66,0.42)',
    device: 'phone',
  },
  {
    name: 'Хайс',
    tagline: 'банк для ИП',
    grad: 'from-[#0e5240] via-[#073227] to-[#031a14]', // CaseCover hais (green) for variety
    orb: 'rgba(240,110,70,0.40)',
    device: 'phone',
  },
  {
    name: 'Складно',
    tagline: 'сеть хранения',
    grad: 'from-[#27405a] via-[#16273a] to-[#0b1620]', // CaseCover skladno (blue-grey)
    orb: 'rgba(240,110,70,0.40)',
    device: 'tablet',
  },
];

const N = PROJECTS.length;

// CaseCover's technical-grid recipe, reused so the drawn screens read as real products.
const GRID =
  'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)';

// Signed shortest wrapped delta in roughly [-2..2]. With N=5 every index maps to a
// unique slot {-2,-1,0,+1,+2}; for larger N anything past ±2 is pushed out of view.
function signedDelta(idx: number, active: number): number {
  let d = ((idx - active + N) % N + N) % N; // 0..N-1
  if (d > N / 2) d -= N; // wrap to nearest, signed
  return d;
}

type Pose = { transform: string; opacity: number; filter: string; z: number };

// Pose per delta. Translate uses calc with -50% so the wrapper stays centred on the
// stage (left-1/2 top-1/2). translate3d/rotateY/scale only → compositor-cheap.
const POSES: Record<number, Pose> = {
  0: {
    transform: 'translate3d(-50%, -50%, 80px) rotateY(0deg) scale(1)',
    opacity: 1,
    filter: 'blur(0px)',
    z: 40,
  },
  1: {
    transform: 'translate3d(calc(-50% + 70px), calc(-50% + 34px), -150px) rotateY(-13deg) scale(0.8)',
    opacity: 0.2,
    filter: 'blur(5px)',
    z: 30,
  },
  '-1': {
    transform: 'translate3d(-50%, calc(-50% - 170px), -260px) rotateY(0deg) scale(0.86)',
    opacity: 0,
    filter: 'blur(7px)',
    z: 25,
  },
  2: {
    transform: 'translate3d(calc(-50% + 90px), calc(-50% + 14px), -320px) rotateY(-10deg) scale(0.66)',
    opacity: 0.1,
    filter: 'blur(8px) grayscale(0.3)',
    z: 20,
  },
  '-2': {
    transform: 'translate3d(calc(-50% - 84px), calc(-50% - 26px), -320px) rotateY(10deg) scale(0.66)',
    opacity: 0.1,
    filter: 'blur(8px) grayscale(0.3)',
    z: 20,
  },
};

// Asymmetric easing — the cinematic graft. Incoming (focus / promoting) decelerates
// into place (house ease-out) with a small "power up" stagger; outgoing accelerates
// away; deep ghosts drift on the house curve. transitionProperty is strict so box-
// shadow + background are NEVER animated (the old transition-all perf trap).
function transitionFor(delta: number): string {
  if (delta === 0 || delta === 1) {
    return 'transform 900ms cubic-bezier(0.16,1,0.3,1) 90ms, opacity 900ms cubic-bezier(0.16,1,0.3,1) 90ms, filter 900ms cubic-bezier(0.16,1,0.3,1) 90ms';
  }
  if (delta === -1) {
    return 'transform 720ms cubic-bezier(0.7,0,0.84,0) 0ms, opacity 720ms cubic-bezier(0.7,0,0.84,0) 0ms, filter 720ms cubic-bezier(0.7,0,0.84,0) 0ms';
  }
  return 'transform 900ms cubic-bezier(0.16,1,0.3,1) 150ms, opacity 900ms cubic-bezier(0.16,1,0.3,1) 150ms, filter 900ms cubic-bezier(0.16,1,0.3,1) 150ms';
}

// Held-static focus glow (orange redline halo + ground shadow + rim light). NEVER
// transitioned — it rides in/out on the device's opacity. The deep-ghost devices get
// no shadow (cheaper paint).
const FOCUS_SHADOW =
  '0 60px 160px rgba(0,0,0,0.65), 0 0 120px rgba(240,81,56,0.28), inset 0 1px 0 rgba(255,255,255,0.06)';

/* ── Drawn light-UI screen (reuses CaseCover's artwork language) ─────────────── */
function Screen({ p, tablet }: { p: Proj; tablet: boolean }) {
  const initial = p.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={`absolute inset-[9px] flex flex-col overflow-hidden bg-[#f3f4f6] ${
        tablet ? 'rounded-[26px]' : 'rounded-[38px]'
      }`}
    >
      {/* brand header — the brightest in-screen detail, biased to the TOP THIRD so
          it sits ABOVE the H1 / white-pill zone */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${p.grad} px-6 ${tablet ? 'pb-9 pt-7' : 'pb-8 pt-7'}`}>
        <div aria-hidden className="absolute -right-6 -top-10 h-32 w-32 rounded-full blur-[40px]" style={{ background: p.orb }} />
        {/* faint technical grid, like CaseCover */}
        <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRID, backgroundSize: '34px 34px' }} />
        {/* huge translucent initial */}
        <span
          aria-hidden
          className="absolute -right-1 -top-4 select-none font-semibold leading-none text-white/[0.08]"
          style={{ fontSize: tablet ? '150px' : '128px' }}
        >
          {initial}
        </span>
        <div className="relative flex items-center justify-between font-mono text-[11px] text-white/60">
          <span>9:41</span>
          <span className="size-[8px] rounded-full bg-white/40" />
        </div>
        <div className="relative mt-7 text-[30px] font-semibold leading-none text-white">{p.name}</div>
        <div className="relative mt-2 font-mono text-[12px] text-white/65">{p.tagline}</div>
      </div>
      {/* neutral cards */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="rounded-[14px] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="h-[8px] w-1/2 rounded-full bg-black/15" />
          <div className="mt-3 h-[8px] w-3/4 rounded-full bg-black/[0.08]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[58px] rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]" />
          <div className="h-[58px] rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]" />
        </div>
        <div className="rounded-[14px] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="h-[8px] w-2/3 rounded-full bg-black/[0.12]" />
        </div>
      </div>
    </div>
  );
}

/* ── Tachometer needle + one-shot light-sweep, mounted ONCE at delta-0 ──────────
   Rendered with key={active} by the parent, so it REMOUNTS every cycle → both run
   exactly once, on the focused device, and can never fire on the wrong one. */
function FocusOverlay({ tablet }: { tablet: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[9px] overflow-hidden" style={{ borderRadius: tablet ? 26 : 38 }}>
      {/* skewed specular glint sweeping across once on focus-in */}
      <div
        className="hero-sweep absolute -inset-y-8 left-0 w-[55%] -rotate-[20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
        style={{ animation: 'sweep-x 900ms ease-out 120ms both' }}
      />
      {/* tachometer arc + needle, top-right above the pill zone */}
      <svg className="absolute right-4 top-4 h-[58px] w-[58px]" viewBox="0 0 100 100" fill="none">
        <path d="M18 78 A 42 42 0 1 1 82 78" stroke="rgba(255,255,255,0.22)" strokeWidth="6" strokeLinecap="round" />
        <path d="M58 30 A 42 42 0 0 1 82 78" stroke="#f05138" strokeWidth="6" strokeLinecap="round" />
        <g className="hero-needle" style={{ transformOrigin: '50px 60px', transform: 'rotate(0deg)', animation: 'needle-tick 900ms cubic-bezier(0.16,1,0.3,1) 120ms both' }}>
          <line x1="50" y1="60" x2="50" y2="22" stroke="#fe4a00" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="60" r="6" fill="#fe4a00" />
      </svg>
    </div>
  );
}

/* ── One device on the rail ─────────────────────────────────────────────────── */
function Device({
  p,
  delta,
  isFocus,
  animate,
  showOverlay,
  cycleKey,
}: {
  p: Proj;
  delta: number;
  isFocus: boolean;
  animate: boolean; // false for the static fallback frame
  showOverlay: boolean;
  cycleKey: number;
}) {
  const tablet = p.device === 'tablet';
  const pose = POSES[delta];
  const [moving, setMoving] = useState(false);

  // will-change only while a transition is in flight (~1s), then cleared so the
  // compositor doesn't keep five promoted layers around permanently.
  useEffect(() => {
    if (!animate) return;
    setMoving(true);
    const id = window.setTimeout(() => setMoving(false), 1000);
    return () => window.clearTimeout(id);
  }, [delta, animate]);

  if (!pose) return null;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: pose.transform,
        opacity: pose.opacity,
        filter: pose.filter,
        zIndex: pose.z,
        transition: animate ? transitionFor(delta) : undefined,
        willChange: moving ? 'transform, opacity, filter' : undefined,
        backfaceVisibility: 'hidden',
      }}
    >
      {/* screen MASK — overflow-hidden lives ONLY here, never on the preserve-3d
          stage or the transformed wrapper, so rotateY renders as a turned card */}
      <div
        className={`relative overflow-hidden border border-white/10 bg-[#0a0a0a] ${
          tablet ? 'h-[430px] w-[600px] rounded-[34px]' : 'h-[560px] w-[276px] rounded-[46px]'
        }`}
        style={{ boxShadow: isFocus ? FOCUS_SHADOW : '0 30px 90px rgba(0,0,0,0.5)' }}
      >
        {/* idle micro-life: translateY-only float on an INNER child (NOT the 3D
            parent, NOT globals float-y which bakes translateX(-50%)) */}
        <div
          className="absolute inset-0"
          style={isFocus && animate ? { animation: 'float-y-rail 7s ease-in-out infinite' } : undefined}
        >
          <Screen p={p} tablet={tablet} />
          {isFocus && animate && showOverlay && <FocusOverlay key={cycleKey} tablet={tablet} />}
        </div>
      </div>
    </div>
  );
}

export function HeroDeviceCycle() {
  const [active, setActive] = useState(0);
  // null = not yet resolved (SSR / first paint) → render the calm static frame so
  // hydration is stable; true/false set on the client once media queries are read.
  const [animate, setAnimate] = useState(false);
  const activeRef = useRef(0);

  useEffect(() => {
    const reduceMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchMql = window.matchMedia('(hover: none), (pointer: coarse)');
    let intervalId: number | undefined;

    const stop = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const apply = () => {
      const motionless = reduceMql.matches || touchMql.matches;
      if (motionless) {
        stop();
        setAnimate(false);
        return;
      }
      setAnimate(true);
      if (intervalId === undefined) {
        intervalId = window.setInterval(() => {
          activeRef.current = (activeRef.current + 1) % N;
          setActive(activeRef.current);
        }, 4200); // long calm hold (~3.4s) + quick relay (~0.9s) = showreel, not carousel
      }
    };

    apply();
    // live: toggling the OS setting tears down / restarts the loop (fixes read-once).
    reduceMql.addEventListener('change', apply);
    touchMql.addEventListener('change', apply);
    return () => {
      stop();
      reduceMql.removeEventListener('change', apply);
      touchMql.removeEventListener('change', apply);
    };
  }, []);

  return (
    <>
      {/* (1) branded redline GLOW bed — the only heavy (150px) blur, static; its
          colour eases per active project but is always orange-dominant */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[110px] h-[760px] w-[1040px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(240,81,56,0.42) 0%, rgba(240,97,31,0.20) 45%, rgba(240,81,56,0) 72%)',
          filter: 'blur(150px)',
        }}
      />

      {/* (2)+(3) the 3D rail stage — perspective + preserve-3d live HERE (parent),
          never on the moving wrapper or the overflow-hidden screen mask */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[185px] h-[680px] w-full -translate-x-1/2"
        style={{ perspective: '1500px', perspectiveOrigin: '50% 40%', transformStyle: 'preserve-3d' }}
      >
        {PROJECTS.map((p, idx) => {
          if (!animate) {
            // static composed frame: focus dead-centre + the two deep ghosts resting
            // in their gutters. No interval, no float, no needle, no sweep.
            const d = idx; // active is 0 here
            if (d !== 0 && d !== 2 && d !== N - 2) return null;
            const staticDelta = d === 0 ? 0 : d === 2 ? 2 : -2;
            return (
              <Device
                key={idx}
                p={p}
                delta={staticDelta}
                isFocus={staticDelta === 0}
                animate={false}
                showOverlay={false}
                cycleKey={0}
              />
            );
          }

          const delta = signedDelta(idx, active);
          if (Math.abs(delta) > 2) {
            // mounted but visually free — costs zero GPU
            return <div key={idx} style={{ visibility: 'hidden' }} />;
          }
          return (
            <Device
              key={idx}
              p={p}
              delta={delta}
              isFocus={delta === 0}
              animate
              showOverlay
              cycleKey={active}
            />
          );
        })}
      </div>

      {/* (4a) elliptical readability scrim — darkest exactly under the H1, fades at
          the gutters so the ghosts breathe. Plain gradient, NO backdrop-filter. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[1000px] w-full max-w-[1440px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(120% 78% at 50% 38%, rgba(4,4,4,0.86) 0%, rgba(4,4,4,0.55) 38%, rgba(4,4,4,0) 70%)',
        }}
      />
    </>
  );
}