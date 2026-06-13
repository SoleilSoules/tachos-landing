'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { servicesIntro, serviceFeatures, services } from '@/lib/content';

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Services() {
  const [open, setOpen] = useState<string | null>(services[0]?.name ?? null);
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section id="services" className="bg-white pt-[120px] pb-[140px]">
      <div ref={ref} className="mx-auto max-w-page px-[80px]">
        <h2 className="reveal-hidden max-w-[680px] text-[44px] font-semibold leading-[1.08] tracking-[-0.02em] text-fg">
          {servicesIntro.titleLead}{' '}
          <span className="text-black/35">{servicesIntro.titleAccent}</span>
        </h2>
        <p className="reveal-hidden mt-[20px] max-w-[520px] text-[16px] leading-[1.4] text-black/50">
          {servicesIntro.body}
        </p>

        {/* feature row */}
        <div className="reveal-hidden mt-[44px] grid grid-cols-2 gap-[18px] sm:grid-cols-3 lg:grid-cols-5">
          {serviceFeatures.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-[12px] rounded-[16px] bg-surface px-[16px] py-[14px]"
            >
              <span className="grid size-[32px] shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                <CheckIcon />
              </span>
              <span className="text-[14px] font-medium leading-[1.15] text-fg">{f.label}</span>
            </div>
          ))}
        </div>

        {/* price list */}
        <div className="reveal-hidden mt-[56px] border-t border-black/10">
          {services.map((s) => {
            const isOpen = open === s.name;
            return (
              <div key={s.name} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.name)}
                  className="flex w-full items-center justify-between gap-[20px] py-[28px] text-left"
                >
                  <span className="text-[26px] font-medium tracking-[-0.01em] text-fg">
                    {s.name}
                  </span>
                  <span className="flex items-center gap-[24px]">
                    <span className="nums hidden text-[18px] font-medium text-black/60 sm:block">
                      {s.price}
                    </span>
                    <span
                      className={`grid size-[40px] shrink-0 place-items-center rounded-full border border-black/15 text-fg transition ${
                        isOpen ? 'rotate-45 bg-fg text-white' : ''
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] pb-[28px]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[560px] text-[16px] leading-[1.4] text-black/55">
                      {s.desc}
                    </p>
                    <span className="nums mt-[10px] block text-[16px] font-medium text-black/70 sm:hidden">
                      {s.price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
