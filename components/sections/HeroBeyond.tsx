import { asset } from '@/lib/asset';

// The hero reel Гоша shot, full-bleed behind the first screen. The old ?bg=
// comparison videos (beam / smoke / var1-3, ~14 MB) were retired once the reel
// won — they live in git history if ever needed again.
export function HeroBeyond() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={asset('/figma/hero-reel-poster.jpg')}
        // Desktop: full width, height follows the 16:9 frame — nothing is
        // cropped, the reel scales with the viewport. Pinned to the BOTTOM
        // so the frame meets the white sheet: when the section ends up
        // taller than 16:9, the leftover strip falls above the reel (behind
        // the nav) instead of showing as a black band under it. Phones are
        // far too narrow for that ratio (the reel would be a 220px strip),
        // so there it fills the screen instead.
        className="absolute inset-x-0 top-0 h-full w-full object-cover motion-reduce:hidden lg:bottom-0 lg:top-auto lg:h-auto lg:object-fill"
      >
        <source src={asset('/figma/hero-reel.mp4')} type="video/mp4" />
      </video>
    </div>
  );
}
