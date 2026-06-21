'use client';

import { useEffect, useState } from 'react';

// Generated hero background: one device on screen at a time, each showing a Tachos
// project (brand-tinted screen + UI hint — no real screenshots yet). Devices fly in
// from below, hold, then fly out the top as the next one rises. Code-only, no media.
// Sits BEHIND the hero copy and is dimmed by the page wash so the H1 stays readable.

type Proj = {
  name: string;
  tagline: string;
  grad: string;
  orb: string;
  device: 'phone' | 'tablet';
};

const PROJECTS: Proj[] = [
  { name: 'doki', tagline: 'управление документами', grad: 'from-[#0b3b2e] via-[#072018] to-[#04130d]', orb: 'rgba(40,200,150,0.40)', device: 'phone' },
  { name: 'balibali', tagline: 'конструктор ресторанов', grad: 'from-[#0e5a3f] via-[#083325] to-[#031a12]', orb: 'rgba(52,212,150,0.40)', device: 'tablet' },
  { name: 'hub', tagline: 'складской учёт', grad: 'from-[#1d3a6e] via-[#102243] to-[#070f20]', orb: 'rgba(80,140,230,0.42)', device: 'phone' },
  { name: 'Хайс', tagline: 'банк для ИП', grad: 'from-[#0e5240] via-[#073227] to-[#031a14]', orb: 'rgba(40,196,142,0.40)', device: 'phone' },
  { name: 'Складно', tagline: 'сеть хранения', grad: 'from-[#27405a] via-[#16273a] to-[#0b1620]', orb: 'rgba(86,148,210,0.42)', device: 'tablet' },
];

type Pos = 'center' | 'up' | 'down';
const TF: Record<Pos, string> = {
  center: 'translate(-50%, -50%) scale(1)',
  up: 'translate(-50%, calc(-50% - 90px)) scale(0.9)',
  down: 'translate(-50%, calc(-50% + 90px)) scale(0.9)',
};

function Device({ p, pos, show }: { p: Proj; pos: Pos; show: boolean }) {
  const tablet = p.device === 'tablet';
  return (
    <div
      className="absolute left-1/2 top-1/2 transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
      style={{ transform: TF[pos], opacity: show ? 1 : 0 }}
    >
      <div
        className={`relative overflow-hidden border border-white/20 bg-black ${
          tablet ? 'h-[430px] w-[600px] rounded-[34px]' : 'h-[560px] w-[276px] rounded-[46px]'
        }`}
        style={{ boxShadow: `0 50px 140px rgba(0,0,0,0.6), 0 0 120px ${p.orb}` }}
      >
        {/* Light app UI so the screen stays bright over the dark wash — brand
            header on top, neutral cards below, like a real product screen. */}
        <div className={`absolute inset-[9px] flex flex-col overflow-hidden bg-[#f3f4f6] ${tablet ? 'rounded-[26px]' : 'rounded-[38px]'}`}>
          <div className={`relative bg-gradient-to-br ${p.grad} px-6 ${tablet ? 'pb-9 pt-7' : 'pb-8 pt-7'}`}>
            <div aria-hidden className="absolute -right-6 -top-10 h-32 w-32 rounded-full blur-[40px]" style={{ background: p.orb }} />
            <div className="relative flex items-center justify-between font-mono text-[11px] text-white/60">
              <span>9:41</span>
              <span className="size-[8px] rounded-full bg-white/40" />
            </div>
            <div className="relative mt-7 text-[30px] font-semibold leading-none text-white">{p.name}</div>
            <div className="relative mt-2 font-mono text-[12px] text-white/65">{p.tagline}</div>
          </div>
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
        {/* dim the whole device so it reads as a muted background, not foreground */}
        <div aria-hidden className="absolute inset-0 bg-bg/35" />
      </div>
    </div>
  );
}

export function HeroDeviceCycle() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setAnimated(false);
      return;
    }
    const id = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % PROJECTS.length;
      });
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="absolute left-1/2 top-[185px] h-[680px] w-full -translate-x-1/2">
      {PROJECTS.map((p, idx) => {
        // reduced-motion: only the first device, static in the centre.
        if (!animated) {
          if (idx !== 0) return null;
          return <Device key={idx} p={p} pos="center" show />;
        }
        const pos: Pos = idx === active ? 'center' : idx === prev ? 'up' : 'down';
        return <Device key={idx} p={p} pos={pos} show={idx === active} />;
      })}
    </div>
  );
}
