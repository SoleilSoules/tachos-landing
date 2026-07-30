'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Office/team video on a white surface (no heading — just the clip). A native
// <video> has no player chrome, so no overlay/letterbox "shadow" is possible.
//
// The clip is ~12 MB and sits below the fold, so it must NOT download with the
// page (autoPlay alone forces the fetch — together with the hero reel that was
// ~17 MB of video on first load). preload="none" + a poster keep the frame
// painted for free; playback starts/stops as the block enters/leaves the
// viewport. Reduced-motion users keep the still poster.
export function VideoBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // play() may reject (autoplay policy, fetch aborted) — poster stays
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section id="studio" className="bg-white pb-12 pt-6 lg:pb-[120px] lg:pt-[48px]">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        <div
          data-hint="studio"
          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink lg:rounded-card"
        >
          <video
            ref={videoRef}
            src={asset('/figma/studio.mp4')}
            poster={asset('/figma/studio-poster.jpg')}
            preload="none"
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
