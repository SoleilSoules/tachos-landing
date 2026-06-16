import Image from 'next/image';
import type { CSSProperties } from 'react';
import { asset } from '@/lib/asset';

// Generative hero backdrop: ONE big device at a time (phone or tablet, scaled
// like the original iPhone close-up), each carrying a different project screen.
// They cross-fade through the set on a slow loop while the whole stage floats.
// Screens are crafted in markup for now (real product shots get slotted later).
// Ambient glow is tintable via --hero-tint. ASCII overlay parked for now.

type Project = {
  id: string;
  name: string;
  kind: 'phone' | 'tablet';
  logo: string;
  c1: string; // screen gradient — top
  c2: string; // screen gradient — bottom
  accent: string; // screen CTA / highlight
  delay: string; // staggers the 24s cross-fade loop (4 slots of 6s)
};

// Order alternates tablet/phone so the device visibly changes between projects.
const PROJECTS: Project[] = [
  { id: 'doki', name: 'doki', kind: 'tablet', logo: '/figma/prod-icon-doki.svg', c1: '#f0823a', c2: '#3a1606', accent: '#ff7a2c', delay: '0s' },
  { id: 'hais', name: 'Хайс', kind: 'phone', logo: '/logos/hais-mono.svg', c1: '#10a574', c2: '#062a20', accent: '#27c993', delay: '6s' },
  { id: 'skladno', name: 'Складно', kind: 'tablet', logo: '/logos/skladno.svg', c1: '#3f74ab', c2: '#0b1620', accent: '#62a6e6', delay: '12s' },
  { id: 'maginary', name: 'Maginary', kind: 'phone', logo: '/logos/maginary-grunge.svg', c1: '#6c3dd2', c2: '#190f30', accent: '#a36cff', delay: '18s' },
];

function Screen({ p, tablet }: { p: Project; tablet: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(158deg, ${p.c1}, ${p.c2})` }}
    >
      {/* faded brand mark fills the screen as cover art */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={asset(p.logo)}
          alt=""
          width={260}
          height={88}
          className="opacity-[0.13] brightness-0 invert"
          style={{ width: tablet ? '40%' : '60%', height: 'auto' }}
        />
      </div>

      {/* top bar: app chip + name + window dots */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-[10px] px-[6%] py-[5%]">
        <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-white/15 backdrop-blur">
          <Image
            src={asset(p.logo)}
            alt=""
            width={24}
            height={24}
            className="brightness-0 invert"
            style={{ width: '64%', height: 'auto' }}
          />
        </span>
        <span className="text-[15px] font-medium tracking-[0.02em] text-white/90">{p.name}</span>
        <span className="ml-auto flex gap-[5px]">
          <i className="size-[7px] rounded-full bg-white/25" />
          <i className="size-[7px] rounded-full bg-white/25" />
          <i className="size-[7px] rounded-full bg-white/25" />
        </span>
      </div>

      {/* faux content rows so it reads as a real app */}
      <div className="absolute inset-x-[6%] top-[24%] flex flex-col gap-[3.5%]">
        <div className="rounded-[14px] bg-white/12 p-[5%]" style={{ height: tablet ? 92 : 110 }}>
          <div className="mb-[10px] h-[7px] w-[45%] rounded-full bg-white/35" />
          <div className="h-[6px] w-[80%] rounded-full bg-white/15" />
        </div>
        <div className="flex gap-[4%]">
          <div className="h-[44px] flex-1 rounded-[12px] bg-white/8" />
          <div className="h-[44px] flex-1 rounded-[12px] bg-white/8" />
        </div>
        <div className="h-[44px] rounded-[12px] bg-white/8" />
      </div>

      {/* accent CTA pinned near the bottom */}
      <div
        className="absolute inset-x-[6%] bottom-[6%] h-[46px] rounded-[14px]"
        style={{ background: p.accent }}
      />
    </div>
  );
}

function Device({ p }: { p: Project }) {
  const tablet = p.kind === 'tablet';
  const layerStyle = {
    opacity: 0,
    animation: 'device-cycle 24s ease-in-out infinite',
    animationDelay: p.delay,
  } as CSSProperties;

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="will-change-[opacity,transform] motion-reduce:!animate-none" style={layerStyle}>
        <div
          className={`relative overflow-hidden border-[#181818] bg-[#0c0c0e] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)] ${
            tablet ? 'rounded-[26px] border-[11px]' : 'rounded-[46px] border-[12px]'
          }`}
          style={{ width: tablet ? 700 : 380, aspectRatio: tablet ? '4 / 3' : '9 / 19.5' }}
        >
          <Screen p={p} tablet={tablet} />
          {!tablet && (
            <div className="absolute left-1/2 top-[12px] h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[1340px] overflow-hidden"
      style={{ '--hero-tint': '240 81 56' } as CSSProperties}
    >
      <div className="absolute inset-0 bg-ink" />
      {/* tintable glow behind the device */}
      <div
        className="absolute left-1/2 top-[120px] h-[760px] w-[1000px] -translate-x-1/2 rounded-full blur-[150px]"
        style={{ background: 'rgb(var(--hero-tint) / 0.30)' }}
      />

      {/* the showcase stage: centred, large, gently floating; projects cross-fade inside */}
      <div className="absolute left-1/2 top-[60px] h-[900px] w-[760px] -translate-x-1/2 [animation:float-y_8s_ease-in-out_infinite] motion-reduce:[animation:none]">
        {PROJECTS.map((p) => (
          <Device key={p.id} p={p} />
        ))}
      </div>

      {/* centre vignette keeps the H1 + sub-head readable over the device */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(56% 42% at 50% 30%, rgba(4,4,4,0.82), rgba(4,4,4,0.30) 60%, transparent 78%)',
        }}
      />
      {/* fades blend the backdrop into nav (top) and the page (bottom) */}
      <div className="absolute inset-x-0 bottom-0 h-[440px] bg-gradient-to-b from-transparent to-bg" />
      <div className="absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-bg/85 to-transparent" />
    </div>
  );
}
