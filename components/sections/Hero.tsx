import { hero } from '@/lib/content';
import { HeroPrompt } from './HeroPrompt';

// Hero is above the fold, so its content must NOT wait for JS to appear — using
// the scroll-reveal hook here meant the text stayed opacity:0 until hydration +
// IntersectionObserver fired, so it popped in *after* the priority background
// image. Instead the entry uses a pure CSS fade-up (staggered via animation-delay)
// that runs on the very first paint, independent of JS. reduced-motion → instant.
export function Hero() {
  return (
    <div className="relative z-10 flex flex-col items-center px-6 pt-[210px] text-center">
      <h1 className="max-w-[966px] select-none text-[82px] font-medium leading-[0.9] tracking-[-0.02em] text-inverted [animation:fade-up_0.55s_ease-out_both] motion-reduce:[animation:none]">
        {hero.title[0]}
        <br />
        {hero.title[1]}
      </h1>

      <div className="mt-[24px] [animation:fade-up_0.55s_ease-out_0.08s_both] motion-reduce:[animation:none]">
        {/* accent line on top, plain copy on the second line — both centred */}
        <p className="font-script text-[28px] font-medium leading-none text-accent-warm">{hero.subhead.lead}</p>
        <p className="mx-auto mt-[14px] max-w-[760px] select-none text-[19px] leading-[1.4] text-inverted [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]">
          {hero.subhead.rest}
        </p>
      </div>

      <div className="[animation:fade-up_0.55s_ease-out_0.16s_both] motion-reduce:[animation:none]">
        <HeroPrompt />
      </div>

      {/* No text scroll-hint here — after 6s idle on the hero the mascot
          (CursorCompanion) stands in at the bottom-centre and says «листайте вниз». */}
    </div>
  );
}
