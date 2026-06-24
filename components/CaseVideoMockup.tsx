'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Animated iPhone mockup for a case cover: a real muted <video> sits inside a CSS
// titanium handset that slowly turns ¾-left → front → ¾-right and back, like a
// product turntable (the angles Гоша referenced). The whole thing is one 3D scene
// (perspective on the stage, preserve-3d on the device). The video pauses when the
// card scrolls offscreen so we don't decode a hidden clip. Reduced-motion holds a
// static ¾ angle and the video doesn't autoplay.
export function CaseVideoMockup({ src, className = '' }: { src: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // leave it paused on the first frame

    // Only decode while visible — a grid of autoplaying videos is wasteful otherwise.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`cvm-stage ${className}`}>
      <div className="cvm-device">
        <div className="cvm-screen">
          <video
            ref={video}
            src={asset(src)}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          />
        </div>
        {/* dynamic island + a moving diagonal glare sell the glass/titanium read */}
        <span aria-hidden className="cvm-island" />
        <span aria-hidden className="cvm-sheen" />
      </div>
      <div aria-hidden className="cvm-floor" />
    </div>
  );
}
