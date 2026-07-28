'use client';

import { useUrlParam } from '@/lib/useUrlParam';

// Soft blurred brand glow behind the hero text — part of the original static look.
// Only shown for the phone variant; the video/shader variants provide their own
// light, and the blur muddied them.
export function HeroGlow() {
  const bg = useUrlParam('bg');
  if (bg !== 'phone') return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[120px] h-[720px] w-[1000px] -translate-x-1/2 rounded-full bg-accent/30 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[380px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-accent-hot/20 blur-[130px]"
      />
    </>
  );
}
