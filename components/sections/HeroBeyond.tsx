import { asset } from '@/lib/asset';

// Video hero background, brand-orange (hue=170), two variants to compare:
//  • beam  — Gosha's "Huly Laser" remix (a vertical light beam)
//  • smoke — the "Beyond Horizons" remix (the billowing sunrise)
// Both are his own Unicorn recordings, recoloured in ffmpeg. Oversized and pulled
// up so the effect sits low behind the hero. Lower edge fades into the page bg.
const VARIANTS = {
  // our own hero reel — fills the whole viewport (object-cover), no inner
  // gradients: the section itself lays the readability wash over it
  reel: {
    src: '/figma/hero-reel.mp4',
    poster: '/figma/hero-reel-poster.jpg',
    top: '0',
    cover: true,
  },
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
  // three live product shots (hand + phone), warm-graded to fit the dark site
  v1: { src: '/figma/hero-var1.mp4', poster: '/figma/hero-var1-poster.jpg', top: '-5%' },
  v2: { src: '/figma/hero-var2.mp4', poster: '/figma/hero-var2-poster.jpg', top: '-5%' },
  v3: { src: '/figma/hero-var3.mp4', poster: '/figma/hero-var3-poster.jpg', top: '-5%' },
} as const;

export function HeroBeyond({ variant = 'beam' }: { variant?: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant];
  const cover = 'cover' in v && v.cover;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={asset(v.poster)}
        style={cover ? undefined : { top: v.top }}
        className={
          cover
            ? // Desktop: full width, height follows the 16:9 frame — nothing is
              // cropped, the reel scales with the viewport. Pinned to the BOTTOM
              // so the frame meets the white sheet: when the section ends up
              // taller than 16:9, the leftover strip falls above the reel (behind
              // the nav) instead of showing as a black band under it. Phones are
              // far too narrow for that ratio (the reel would be a 220px strip),
              // so there it fills the screen instead.
              'absolute inset-x-0 top-0 h-full w-full object-cover motion-reduce:hidden lg:top-auto lg:bottom-0 lg:h-auto lg:object-fill'
            : 'absolute left-1/2 w-[140%] min-w-[1500px] max-w-none -translate-x-1/2 motion-reduce:hidden'
        }
      >
        <source src={asset(v.src)} type="video/mp4" />
      </video>
      {/* live product footage sits behind the text like the concept: darken the
          top (under the headline) and lay a light overall wash so it reads as a
          dim background texture, not a bright video */}
      {variant.startsWith('v') && (
        <>
          <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-bg/90 via-bg/45 to-transparent" />
          <div className="bg-bg/25 absolute inset-0" />
        </>
      )}
      {/* fade the video's lower edge so its bottom border never reads as a hard
          line. Beam fades into WHITE (flat seam → white Cases, no dark band);
          smoke fades into the dark bg (the white arc handles that seam). The
          reel skips this — the section's own wash already covers its bottom. */}
      {!cover && (
        <div
          className={
            variant === 'beam'
              ? 'absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_bottom,transparent_0%,#ffffff_72%)]'
              : 'absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-bg'
          }
        />
      )}
    </div>
  );
}
