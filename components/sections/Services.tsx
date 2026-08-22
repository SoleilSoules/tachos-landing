'use client';

import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { services, servicesIntro } from '@/lib/content';

export function Services() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="services"
      className="bg-white pb-[40px] pt-[48px] sm:pb-[48px] sm:pt-[64px] lg:pb-[56px] lg:pt-[96px]"
    >
      <div ref={ref} className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        <WordsReveal
          as="h2"
          stagger={48}
          className="max-w-[680px] text-[clamp(28px,7.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-fg lg:leading-[1.08]"
        >
          {servicesIntro.titleLead}{' '}
          <span className="text-black/35">{servicesIntro.titleAccent}</span>
        </WordsReveal>
        <WordsReveal
          as="p"
          stagger={20}
          start={260}
          className="mt-[16px] block max-w-[560px] text-[16px] leading-[1.45] text-black/50 sm:mt-[20px] sm:text-[19px] sm:leading-[1.4]"
        >
          {servicesIntro.body}
        </WordsReveal>
        {/* the "own staff" promise rides right under the offer, quieter than it */}
        <p className="mt-[10px] text-[15px] font-medium leading-[1.4] text-accent sm:text-[16px]">
          {servicesIntro.note}
        </p>

        {/* Six service cards, numbered 01–06 as in the copy doc. Same card
            language as the team block below, one step roomier for the body copy. */}
        <div className="mt-[32px] grid grid-cols-1 gap-[10px] sm:mt-[44px] sm:grid-cols-2 sm:gap-[14px] lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.title}
              data-hint="service"
              data-hint-sub={service.title}
              className="reveal-hidden group relative flex min-h-[170px] flex-col rounded-[14px] bg-[#f3f4f6] px-[18px] py-[16px] transition duration-200 hover:bg-[#eceef0] sm:min-h-[210px] sm:rounded-[20px] sm:px-[22px] sm:py-[20px]"
            >
              <span className="text-[13px] font-medium tabular-nums text-black/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-[14px] text-[17px] font-medium leading-[1.2] tracking-[-0.01em] text-fg sm:mt-[18px] sm:text-[20px]">
                {service.title}
              </h3>
              <p className="mt-[8px] text-[14px] leading-[1.4] text-black/50 sm:text-[15px]">
                {service.body}
              </p>
              <div className="mt-auto flex justify-end pt-[12px]">
                {/* arrow slides in on hover — one transient accent, not a baked-in one */}
                <span
                  aria-hidden
                  className="-translate-x-1 text-[16px] leading-none text-accent opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
