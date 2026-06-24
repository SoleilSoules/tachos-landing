'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';
import { CaseVideoMockup } from '@/components/CaseVideoMockup';

// Apple-grade case cover: the product sits on a clean, softly-lit studio field as a
// realistic device — a titanium iPhone (tall shots) or a dark display (wide shots) —
// at a gentle ¾ angle with one big, soft, layered shadow. No brand colour blocks, no
// shouting type: calm, expensive, product-first. No-shot cases get a quiet wordmark.

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const TITANIUM =
  'linear-gradient(135deg,#5c5e63 0%,#242528 27%,#161719 52%,#303236 73%,#4d4f54 100%)';

// Titanium iPhone, ¾ turned, screenshot inside — the same handset as the video mockup
// but static. Bleeds off the bottom so it reads big and grounded.
function PhoneMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div className={`relative aspect-[780/1688] ${big ? 'h-[124%]' : 'h-[116%]'}`}>
      <div
        className="relative h-full w-full rounded-[34px] p-[2.4%] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)]"
        style={{ background: TITANIUM }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[27px] bg-black">
          <Image
            src={asset(shot)}
            alt={client}
            fill
            sizes="320px"
            className="object-cover object-top"
            style={{ objectPosition: '50% 0' }}
          />
        </div>
        {/* dynamic island */}
        <span className="absolute left-1/2 top-[2.6%] h-[3.4%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
        {/* glass glare */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[34px]"
          style={{
            background:
              'linear-gradient(108deg,transparent 36%,rgba(255,255,255,0.14) 46%,transparent 56%)',
          }}
        />
      </div>
    </div>
  );
}

// Wide product on a dark display, ¾ turned — the desktop counterpart of the phone so
// both read as one studio shoot.
function DisplayMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div className={`relative aspect-[16/10] ${big ? 'w-[84%]' : 'w-[90%]'}`}>
      <div
        className="relative w-full rounded-[18px] p-[1%] shadow-[0_18px_44px_-24px_rgba(0,0,0,0.4)]"
        style={{ background: TITANIUM }}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[13px] bg-black">
          <Image
            src={asset(shot)}
            alt={client}
            fill
            sizes="(max-width:1024px) 100vw, 520px"
            className="object-cover object-top"
            style={{ objectPosition: '50% 0' }}
          />
        </div>
        <span
          className="pointer-events-none absolute inset-0 rounded-[18px]"
          style={{
            background:
              'linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.12) 48%,transparent 58%)',
          }}
        />
      </div>
    </div>
  );
}

export function CaseCover({
  id: _id,
  client,
  shot,
  shotKind,
  mockupVideo,
  variant = 'card',
  className = '',
}: {
  id: string;
  client: string;
  shot?: string;
  shotKind?: 'phone' | 'desktop';
  mockupVideo?: string;
  variant?: 'card' | 'hero';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const big = variant === 'hero';
  const kind: 'phone' | 'desktop' = shotKind ?? 'desktop';

  // gentle cursor parallax: the device leans toward the pointer, card stays put
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
      className={`cv-root relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      // flat, even grey field (no gradient, no shadow) per Гоша
      style={{ background: '#e7e8eb' }}
    >
      {mockupVideo ? (
        <div className="cv-device absolute bottom-[-6%] right-[-2%] h-[80%] w-[66%]">
          <CaseVideoMockup src={mockupVideo} />
        </div>
      ) : shot ? (
        <div className="cv-device flex h-full w-full items-end justify-center">
          {kind === 'phone' ? (
            <PhoneMock shot={shot} client={client} big={big} />
          ) : (
            <DisplayMock shot={shot} client={client} big={big} />
          )}
        </div>
      ) : (
        <span
          aria-hidden
          className="select-none font-medium tracking-[-0.02em] text-black/20"
          style={{ fontSize: big ? 'clamp(34px,4vw,56px)' : 'clamp(24px,3vw,40px)' }}
        >
          {client}
        </span>
      )}
    </div>
  );
}
