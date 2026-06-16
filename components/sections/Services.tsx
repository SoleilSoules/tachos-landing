'use client';

import { useReveal } from '@/hooks/useReveal';
import { servicesIntro } from '@/lib/content';

// ─── Time & material roles (issue #41) ──────────────────────────────
// Roles available under the T&M model. NO rates by design — Gosha asked
// to drop all ₽/час figures; cards show the role name only. Kept as a
// local const for now; we lift into content.ts later if reused elsewhere.
const tmRoles = [
  'Middle продуктовый UX/UI дизайнер',
  'Senior продуктовый UX/UI дизайнер',
  'Арт-директор',
  'Дизайн-директор',
  'Middle Frontend разработчик',
  'Senior Frontend разработчик',
  'Middle Backend разработчик',
  'Senior Backend разработчик',
  'Системный аналитик',
  'Продуктовый аналитик',
  'QA-специалист',
  'DevOps-инженер',
] as const;

export function Services() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section id="services" className="bg-white pt-[96px] pb-[104px]">
      <div ref={ref} className="mx-auto max-w-page px-[80px]">
        {/* Keep: "под ключ" framing, but WITHOUT concrete prices (issue #41) */}
        <h2 className="reveal-hidden max-w-[680px] text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-fg">
          {servicesIntro.titleLead}{' '}
          <span className="text-black/35">{servicesIntro.titleAccent}</span>
        </h2>
        <p className="reveal-hidden mt-[20px] max-w-[520px] text-[19px] leading-[1.4] text-black/50">
          Не знаете, как назвать задачу, — поможем сформулировать и подберём
          состав работ. Ниже — направления, в которых мы сильны.
        </p>

        {/* ─── Time & material (issue #41) ─── */}
        {/* Two-line heading: black lead + muted second line "time and material". */}
        <h3 className="reveal-hidden mt-[72px] text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg">
          Мы работаем по модели
          <br />
          <span className="text-fg/35">time and material</span>
        </h3>

        {/* Role grid: 4 up on desktop, 2 on tablet, 1 on mobile. No rates —
            each card holds only the role name, top-aligned (issue #41). */}
        <div className="mt-[40px] grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-4">
          {tmRoles.map((role) => (
            <div
              key={role}
              className="reveal-hidden flex min-h-[260px] flex-col rounded-card bg-surface p-[28px]"
            >
              <span className="text-[22px] font-medium leading-[1.18] tracking-[-0.01em] text-fg">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
