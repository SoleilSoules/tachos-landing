'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BASE = 1440; // Figma design width

// Scales the fixed 1440 design grid to the viewport width, so the layout fills
// any screen pixel-perfect and proportionally — no per-breakpoint reflow. The
// outer box takes the scaled height so document flow stays correct. Overlay /
// floating button / companion live outside this wrapper (real viewport coords).
export function Scaler({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const recompute = useCallback(() => {
    const w = document.documentElement.clientWidth;
    const s = w / BASE;
    setScale(s);
    if (inner.current) setHeight(inner.current.offsetHeight * s);
  }, []);

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (inner.current) ro.observe(inner.current);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [recompute]);

  return (
    <div className="overflow-clip" style={{ height }}>
      <div
        ref={inner}
        style={{
          width: BASE,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
