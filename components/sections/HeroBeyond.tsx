import { asset } from '@/lib/asset';

// Video hero background, brand-orange (hue=170), two variants to compare:
//  • beam  — Gosha's "Huly Laser" remix (a vertical light beam)
//  • smoke — the "Beyond Horizons" remix (the billowing sunrise)
// Both are his own Unicorn recordings, recoloured in ffmpeg. Oversized and pulled
// up so the effect sits low behind the hero. Lower edge fades into the page bg.
const VARIANTS = {
  beam: {
    src: '/figma/hero-beam-orange.mp4',
    poster: '/figma/hero-beam-orange-poster.jpg',
    top: '-49%',
  },
  smoke: {
    src: '/figma/hero-smoke-orange.mp4',
    poster: '/figma/hero-smoke-orange-poster.jpg',
    top: '-24%',
  },
} as const;

export function HeroBeyond({ variant = 'beam' }: { variant?: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={asset(v.poster)}
        style={{ top: v.top }}
        className="absolute left-1/2 w-[140%] min-w-[1500px] max-w-none -translate-x-1/2 motion-reduce:hidden"
      >
        <source src={asset(v.src)} type="video/mp4" />
      </video>
      {/* fade the video's lower edge so its bottom border never reads as a hard
          line. Beam fades into WHITE (flat seam → white Cases, no dark band);
          smoke fades into the dark bg (the white arc handles that seam). */}
      <div
        className={
          variant === 'beam'
            ? 'absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_bottom,transparent_0%,#ffffff_72%)]'
            : 'absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-bg'
        }
      />
    </div>
  );
}
