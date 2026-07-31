'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { CaseVideoMockup } from '@/components/CaseVideoMockup';

// Full-bleed animated cover (the reel rendered in Remotion). It plays on its own
// as soon as the card is on screen (per Гоша) and pauses the moment it leaves, so
// nothing decodes off-screen and no interaction is required to see the work.
//
// The still sits UNDER the video and the video fades in only once playback has
// actually started. That's not decoration: `preload="none"` means the first
// frames arrive a beat late, and these reels open on black — without the still
// underneath the card would flash black before the clip appears.
function CoverVideo({ src, poster, client }: { src: string; poster?: string; client: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // Reduced-motion asks for no movement — keep the still, never fetch the clip.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // play() may reject (autoplay policy, aborted fetch) — the still stays
          v.play()
            .then(() => setPlaying(true))
            .catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {poster && (
        <Image
          src={asset(poster)}
          alt={client}
          fill
          sizes="(max-width:1024px) 100vw, 640px"
          className="object-cover"
        />
      )}
      <video
        ref={video}
        src={asset(src)}
        muted
        loop
        playsInline
        // nothing is fetched until the card scrolls into view — the reels stay
        // off the initial page weight
        preload="none"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: playing ? 1 : 0 }}
      />
    </>
  );
}

// Case cover: the product screenshot sits FLAT and FRONTAL — no grey field, no tilt,
// no cursor parallax (calm + static per Гоша). Wide desktop shots fill the whole
// cover; phone shots are a tall titanium iPhone dropped ~halfway off the bottom edge
// so only the top of the screen (the hero) reads big. No-shot cases get a brand plate.

const TITANIUM =
  'linear-gradient(135deg,#5c5e63 0%,#242528 27%,#161719 52%,#303236 73%,#4d4f54 100%)';

// Titanium iPhone, frontal, screenshot inside. Pushed down so the bottom half bleeds
// past the lower edge — the hero of the screenshot stays visible up top.
function PhoneMock({ shot, client, big }: { shot: string; client: string; big: boolean }) {
  return (
    <div className="flex h-full w-full items-end justify-center">
      <div
        className={`relative aspect-[780/1688] translate-y-[62%] ${big ? 'h-[170%]' : 'h-[150%]'}`}
      >
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
    </div>
  );
}

export function CaseCover({
  client,
  shot,
  shotKind,
  mockupVideo,
  coverVideo,
  variant = 'card',
  className = '',
}: {
  client: string;
  shot?: string;
  shotKind?: 'phone' | 'desktop' | 'cover';
  mockupVideo?: string;
  coverVideo?: string;
  variant?: 'card' | 'hero';
  className?: string;
}) {
  const big = variant === 'hero';
  const kind: 'phone' | 'desktop' | 'cover' = shotKind ?? 'desktop';

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f3f4f6] ${className}`}
    >
      {coverVideo ? (
        <CoverVideo src={coverVideo} poster={shot} client={client} />
      ) : mockupVideo ? (
        <div className="absolute bottom-[-6%] right-[-2%] h-[80%] w-[66%]">
          <CaseVideoMockup src={mockupVideo} />
        </div>
      ) : shot ? (
        kind === 'phone' ? (
          <PhoneMock shot={shot} client={client} big={big} />
        ) : kind === 'cover' ? (
          // Full-bleed cover photo. A still card gets its life from a slow push
          // toward the centre ON HOVER (Гоша) — six seconds, so it reads as a
          // camera creeping in, not a hover effect. The reels autoplay instead and
          // don't need it. motion-safe keeps it off under reduced-motion.
          <Image
            src={asset(shot)}
            alt={client}
            fill
            sizes="(max-width:1024px) 100vw, 640px"
            className="object-cover transition-transform duration-[6000ms] ease-out motion-safe:group-hover:scale-[1.12]"
          />
        ) : (
          // wide screenshot as a real frontal device (no tilt): titanium body, inner
          // bezel, glass glare. Smaller so it sits on the cover like a product shot.
          <div
            className={`relative aspect-[16/10] translate-y-[28%] ${big ? 'w-[72%]' : 'w-[78%]'} rounded-[20px] p-[1.3%] shadow-[0_26px_60px_-28px_rgba(0,0,0,0.55)]`}
            style={{ background: TITANIUM }}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <Image
                src={asset(shot)}
                alt={client}
                fill
                sizes="(max-width:1024px) 100vw, 560px"
                className="object-cover object-top"
                style={{ objectPosition: '50% 0' }}
              />
            </div>
            {/* glass glare */}
            <span
              className="pointer-events-none absolute inset-0 rounded-[20px]"
              style={{
                background:
                  'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.13) 49%,transparent 58%)',
              }}
            />
          </div>
        )
      ) : (
        // No-shot case: an intentional brand plate (app-icon monogram + wordmark) so
        // the card reads as a deliberate cover — not an empty artboard — until a real
        // product still arrives.
        <div className="flex flex-col items-center gap-[18px] px-8 text-center">
          <div
            aria-hidden
            className="grid place-items-center rounded-[26%] bg-[#f0f1f3] text-black shadow-[0_12px_32px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.05]"
            style={{ width: big ? 116 : 92, height: big ? 116 : 92 }}
          >
            <span
              className="font-semibold leading-none tracking-[-0.03em]"
              style={{ fontSize: big ? 60 : 46 }}
            >
              {client.trim().charAt(0)}
            </span>
          </div>
          <span
            className="select-none font-medium tracking-[-0.02em] text-black/70"
            style={{ fontSize: big ? 'clamp(24px,2.6vw,34px)' : 'clamp(18px,2vw,26px)' }}
          >
            {client}
          </span>
        </div>
      )}
    </div>
  );
}
