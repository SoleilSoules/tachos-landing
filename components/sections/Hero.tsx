import { hero, trustLabel } from '@/lib/content';
import { HeroLogos } from './HeroLogos';
import { HeroPrompt } from './HeroPrompt';

// Hero is above the fold, so its content must NOT wait for JS to appear — using
// the scroll-reveal hook here meant the text stayed opacity:0 until hydration +
// IntersectionObserver fired, so it popped in *after* the priority background
// image. Instead the entry uses a pure CSS fade-up (staggered via animation-delay)
// that runs on the very first paint, independent of JS. reduced-motion → instant.
//
// Composition (filter.im-style, per Гоша): the whole viewport belongs to the hero
// video and everything textual is pinned to the BOTTOM — headline flush left, a
// hairline under it, then a row of «what we do» (left) against the prompt (right),
// and finally the client logos spanning the full width. Video gets the space above.
export function Hero() {
  return (
    <div className="relative z-10 flex w-full flex-col px-5 pb-[50px] sm:px-8 lg:px-[80px] lg:pb-[66px]">
      {/* cap tuned so the second line («сильных продуктов и брендов») still fits on
          ONE line at 1440 — a third line eats the video's space */}
      <h1 className="max-w-[1080px] select-none text-[clamp(30px,5.2vw,66px)] font-medium leading-[0.96] tracking-[-0.025em] text-inverted [animation:fade-up_0.55s_ease-out_both] motion-reduce:[animation:none]">
        {hero.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      {/* left: sub-head + prompt (the CTA lives inside the hero itself, not in a
          separate band) · right: the client logos */}
      <div className="mt-[18px] flex flex-col gap-[26px] [animation:fade-up_0.55s_ease-out_0.12s_both] motion-reduce:[animation:none] lg:mt-[36px] lg:flex-row lg:items-start lg:justify-between lg:gap-[24px]">
        <div className="w-full lg:max-w-[554px]">
          <p className="mb-[34px] max-w-[520px] select-none text-[13.5px] leading-[1.45] text-inverted/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] sm:text-[17px]">
            {hero.subhead.rest}
          </p>
          {/* the «Мне нужен: …» chips are back under the field (Гоша) */}
          <HeroPrompt />
        </div>

        <div className="w-full lg:w-[660px] lg:shrink-0 lg:pt-[108px]">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-inverted/45 sm:text-[12px]">
            {trustLabel}
          </p>
          <div className="mt-[16px]">
            <HeroLogos />
          </div>
        </div>
      </div>

      {/* No text scroll-hint here — after 6s idle on the hero the mascot
          (CursorCompanion) stands in at the bottom-centre and says «листайте вниз». */}
    </div>
  );
}
