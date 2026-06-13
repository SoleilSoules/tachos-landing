'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { founder } from '@/lib/content';

function PlayIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden>
      <path d="M1 1.5 12 7.5 1 13.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

// CTA that eases toward the cursor (disabled for reduced-motion).
function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      data-compose
      className={`${className} transition-transform duration-300 ease-out`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </button>
  );
}

export function Founder() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.25, rootMargin: '-60px 0px' });

  return (
    <div ref={ref} className="relative z-10 mt-[168px] flex justify-center px-6 pb-[150px]">
      <div className="reveal-hidden relative h-[414px] w-[1030px] overflow-hidden rounded-founder bg-ink">
        <Image
          src="/figma/founder-card-bg.png"
          alt=""
          fill
          sizes="1030px"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
        {/* warm glow behind the portrait */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_72%_72%,rgba(240,81,56,0.28),transparent_70%)]" />

        <div className="absolute inset-y-0 right-0 w-[472px] overflow-hidden rounded-l-[28px]">
          <Image
            src="/figma/founder-container.jpg"
            alt="Вадим — основатель студии"
            fill
            sizes="480px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-[24px] left-[28px]">
            <div className="text-[24px] font-semibold leading-tight text-white">
              {founder.person.name}
            </div>
            <div className="text-[15px] text-white/60">{founder.person.role}</div>
          </div>
        </div>

        <div className="absolute inset-y-[32px] left-[32px] flex w-[440px] flex-col justify-between">
          <div>
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-inverted">
              {founder.heading[0]}
              <br />
              {founder.heading[1]}
              <br />
              {founder.heading[2]}
            </h2>
            <ul className="mt-[28px] flex flex-col gap-[16px] text-[19px] leading-[1.2] text-inverted/60">
              {founder.facts.map((fact) => (
                <li key={fact}>
                  <span className="text-accent-bright">–</span> {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-[12px]">
            <MagneticButton className="h-[56px] shrink-0 whitespace-nowrap rounded-[54px] bg-white px-[28px] text-[16px] font-medium text-black hover:brightness-95">
              {founder.contactCta}
            </MagneticButton>
            <button
              type="button"
              className="flex h-[56px] items-center gap-[10px] whitespace-nowrap px-[8px] text-[16px] text-inverted transition hover:opacity-80"
            >
              <span className="grid size-[36px] shrink-0 place-items-center rounded-full bg-white/15">
                <PlayIcon />
              </span>
              {founder.presentation.label}
              <span className="text-inverted/50">{founder.presentation.duration}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
