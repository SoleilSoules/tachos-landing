'use client';

import { useEffect, useState } from 'react';

// The curved white top edge echoes the sunrise horizon — but only for the smoke
// variant. The laser-beam variant wants a flat seam, so we render nothing there.
export function CasesTopEdge() {
  const [arc, setArc] = useState(true);

  useEffect(() => {
    // smoke (incl. the default, no ?bg) gets the arc; other variants stay flat
    const q = new URLSearchParams(window.location.search).get('bg');
    setArc(q === null || q === 'smoke');
  }, []);

  if (!arc) return null;

  return (
    <div aria-hidden className="absolute inset-x-0 top-0 leading-[0] -translate-y-[calc(100%-1px)]">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="h-[34px] w-full sm:h-[46px]">
        <path d="M0,90 C480,50 960,50 1440,90 Z" fill="white" />
      </svg>
    </div>
  );
}
