'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { nav } from '@/lib/content';

export function Nav() {
  // Vadim: once you scroll, the bar should pin with a plate. Transparent over the
  // dark hero, then a dark blurred plate so the white nav text stays readable
  // over the light sections below.
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        stuck ? 'px-[14px] pt-[10px]' : 'px-0 pt-0'
      }`}
    >
      {/* once stuck, the bar detaches from the edges into a floating pill
          (rounded, translucent, blurred) — monte-tuning style. */}
      <div
        className={`mx-auto flex w-full max-w-page items-center justify-between transition-all duration-300 ${
          stuck
            ? 'h-[60px] rounded-[22px] border border-white/10 bg-ink/75 px-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'h-[84px] px-[48px]'
        }`}
      >
        {/* logo alone on the left; nav + CTA grouped to the right edge */}
        <a
          href="#"
          data-logo-mark
          className="flex items-center"
          aria-label="tachos — на главную"
        >
          <Image
            src={asset('/logos/tachos.svg')}
            alt="tachos"
            width={90}
            height={22}
            priority
            className="block"
            style={{ height: 22, width: 'auto' }}
          />
        </a>

        <div className="flex items-center gap-[40px]">
          <nav className="nums flex items-center gap-[34px]">
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[16px] font-medium tracking-[0.04em] text-inverted transition-colors hover:text-accent-bright"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contacts"
            data-compose
            className="rounded-button bg-accent-bright px-[16px] py-[7px] text-[16px] text-inverted backdrop-blur-sm transition hover:brightness-110"
          >
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
