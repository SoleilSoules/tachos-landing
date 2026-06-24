'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Brand cover for a case. One unified light-grey Apple-style field for ALL cases.
// The real product screenshot sits in a premium device mockup that bleeds off the
// bottom edge for depth; glow / shadow / device react to the cursor with a small
// parallax + tilt while the CARD ITSELF stays put. The cursor is tracked on the
// WHOLE window (not just hover) so every card leans toward the pointer even when
// it's elsewhere on the page. Parallax CSS lives in globals (.cv-*). Touch /
// reduced-motion: the listener never attaches, so everything stays centred.

// Single shared light field (apple.com product-grey).
const FIELD = 'from-[#f6f6f8] via-[#ededf0] to-[#e4e4e8]';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Clean Apple-style browser window — light chrome, soft deep shadow, straight.
function BrowserMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] bg-white shadow-[0_44px_90px_-26px_rgba(0,0,0,0.5)] ring-1 ring-black/10 ${
        big ? 'w-[82%]' : 'w-[90%]'
      }`}
    >
      <div className="flex h-[28px] items-center gap-[6px] bg-[#ececee] px-[12px]">
        <span className="size-[8px] rounded-full bg-[#ff5f57]" />
        <span className="size-[8px] rounded-full bg-[#febc2e]" />
        <span className="size-[8px] rounded-full bg-[#28c840]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={asset(shot)}
          alt={client}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

// Photoreal iPhone — a generated titanium device frame (PNG, transparent bg) with
// the real product screenshot laid into the screen window. The frame carries all
// the realism (metal, bezels, Dynamic Island); the screen inset is tuned to the
// frame art. CSS-drawn phone was scrapped — it never read as a real device.
const PHONE_SCREEN = 'inset-x-[3.5%] top-[5.5%] bottom-[2.5%]'; // screen window in the (cropped) frame (below the notch)
function PhoneMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div className={`relative aspect-[614/1290] ${big ? 'h-[114%]' : 'h-[106%]'}`}>
      {/* photoreal titanium device frame (background); its screen is solid black */}
      <Image
        src={asset('/figma/iphone-frame.png')}
        alt=""
        fill
        sizes="380px"
        className="object-contain"
      />
      {/* real screenshot laid OVER the black screen window (inset to the bezel) */}
      <div className={`absolute ${PHONE_SCREEN} overflow-hidden rounded-[9%]`}>
        <Image src={asset(shot)} alt={client} fill sizes="320px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export function CaseCover({
  id,
  client,
  shot,
  shotKind = 'desktop',
  variant = 'card',
  className = '',
}: {
  id: string;
  client: string;
  shot?: string;
  shotKind?: 'phone' | 'desktop';
  variant?: 'card' | 'hero';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initial = client.trim().charAt(0).toUpperCase();
  const initialSize = variant === 'hero' ? 'clamp(180px,34vw,360px)' : '230px';
  const big = variant === 'hero';

  // Track the cursor on the whole window: each card writes its own --px/--py from
  // the cursor's offset relative to the card centre (scaled by half-viewport), so
  // the device leans toward the pointer wherever it is. rAF-throttled; the .cv-*
  // rules in globals turn the vars into layered transforms.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduced || touch) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
        const py = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`cv-root relative flex h-full w-full items-end justify-center overflow-hidden bg-gradient-to-br ${FIELD} ${className}`}
    >
      {shot ? (
        <>
          {/* soft ambient light pooled behind the device — lifts it off flat grey */}
          <div
            aria-hidden
            className="cv-glow pointer-events-none absolute left-1/2 top-[14%] h-[64%] w-[76%] -translate-x-1/2 rounded-full bg-white/70 blur-[60px]"
          />
          {/* contact shadow grounding the device against the field */}
          <div
            aria-hidden
            className="cv-shadow pointer-events-none absolute bottom-[7%] left-1/2 h-[56px] w-[68%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-[34px]"
          />
          {/* OUTER: full-height so the device's h-% resolves; items-end seats it on
              the bottom and the small translate bleeds it past the edge (clipped by
              the card's overflow). INNER (.cv-device) carries the parallax/tilt. */}
          <div className="flex h-full w-full translate-y-[8%] items-end justify-center">
            <div className="cv-device flex h-full w-full items-end justify-center">
              {shotKind === 'phone' ? (
                <PhoneMock shot={shot} client={client} big={big} />
              ) : (
                <BrowserMock shot={shot} client={client} big={big} />
              )}
            </div>
          </div>
        </>
      ) : (
        <span
          aria-hidden
          className="absolute -bottom-[0.2em] right-[0.04em] select-none font-semibold leading-none text-black/[0.06]"
          style={{ fontSize: initialSize }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
