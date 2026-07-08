import { asset } from '@/lib/asset';

// The original static hero: a hand holding an iPhone with a warm orange lock
// screen. Kept as a comparison option (?bg=phone) against the animated backgrounds.
export function HeroPhone() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset('/figma/hero-bg.png')}
        alt=""
        className="absolute left-1/2 top-[4%] h-[84%] w-auto max-w-none -translate-x-1/2 select-none"
      />
    </div>
  );
}
