'use client';

import { useReveal } from '@/hooks/useReveal';
import { WordsReveal } from '@/components/WordsReveal';
import { servicesIntro } from '@/lib/content';

// ─── Time & material roles (issue #41) ──────────────────────────────
// Roles available under the T&M model. NO rates and NO grades (Middle/Senior)
// by design — Gosha asked to drop ₽/час and grades, just "we have these specs".
const tmRoles = [
  'Продуктовый UX/UI дизайнер',
  'Арт-директор',
  'Дизайн-директор',
  'Frontend-разработчик',
  'Backend-разработчик',
  'Системный аналитик',
  'Продуктовый аналитик',
  'QA-специалист',
  'DevOps-инженер',
] as const;

export function Services() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section id="services" className="bg-white pb-[40px] pt-[48px] sm:pb-[48px] sm:pt-[64px] lg:pb-[56px] lg:pt-[96px]">
      <div ref={ref} className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        {/* Keep: "под ключ" framing, but WITHOUT concrete prices (issue #41) */}
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
          className="mt-[16px] block max-w-[520px] text-[16px] leading-[1.45] text-black/50 sm:mt-[20px] sm:text-[19px] sm:leading-[1.4]"
        >
          Не знаете, как назвать задачу, — поможем сформулировать и подберём состав работ. Ниже —
          направления, с которыми работаем.
        </WordsReveal>

        {/* Role cards (issue #41): one section heading only (the "под ключ" offer);
            no T&M label. Compact, less-rounded cards, no grades. */}
        <div className="mt-[32px] grid grid-cols-2 gap-[10px] sm:mt-[44px] sm:gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
          {tmRoles.map((role, i) => (
            <div
              key={role}
              data-hint="Роль в команде"
              data-hint-sub={role}
              className="reveal-hidden group relative flex min-h-[96px] flex-col justify-between rounded-[14px] border border-black/[0.08] bg-white px-[14px] py-[14px] transition duration-200 hover:border-black/20 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] sm:min-h-[112px] sm:rounded-[20px] sm:px-[22px] sm:py-[18px]"
            >
              <span className="text-[13px] font-medium tabular-nums text-black/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-end justify-between gap-[6px] sm:gap-[10px]">
                <span className="text-[15px] font-medium leading-[1.25] tracking-[-0.01em] text-fg sm:text-[18px] sm:leading-[1.2]">
                  {role}
                </span>
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
