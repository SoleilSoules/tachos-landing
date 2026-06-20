'use client';

import { useReveal } from '@/hooks/useReveal';
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
    <section id="services" className="bg-white pt-[64px] pb-[72px] lg:pt-[96px] lg:pb-[104px]">
      <div ref={ref} className="mx-auto max-w-page px-5 sm:px-8 lg:px-[80px]">
        {/* Keep: "под ключ" framing, but WITHOUT concrete prices (issue #41) */}
        <h2 className="reveal-hidden max-w-[680px] text-[clamp(28px,7.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-fg lg:leading-[1.08]">
          {servicesIntro.titleLead}{' '}
          <span className="text-black/35">{servicesIntro.titleAccent}</span>
        </h2>
        <p className="reveal-hidden mt-[20px] max-w-[520px] text-[19px] leading-[1.4] text-black/50">
          Не знаете, как назвать задачу, — поможем сформулировать и подберём
          состав работ. Ниже — направления, в которых мы сильны.
        </p>

        {/* Role cards (issue #41): one section heading only (the "под ключ" offer);
            no T&M label. Compact, less-rounded cards, no grades. */}
        <div className="mt-[44px] grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
          {tmRoles.map((role) => (
            <div
              key={role}
              data-hint="Роль в команде"
              data-hint-sub={role}
              className="reveal-hidden flex min-h-[92px] items-center rounded-[20px] bg-surface px-[22px] py-[20px] transition hover:bg-surface2"
            >
              <span className="text-[18px] font-medium leading-[1.2] tracking-[-0.01em] text-fg">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
