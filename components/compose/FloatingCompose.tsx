'use client';

import { useEffect, useState } from 'react';
import { useCompose } from './ComposeProvider';

// mingcute voice glyph — same as the hero input, so the small pill reads as a
// miniature of that field.
function WaveIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="currentColor" aria-hidden>
      <path d="M20.3035 4.23083C20.9345 4.23087 21.5429 4.46593 22.01 4.89019C22.4772 5.31445 22.7695 5.89749 22.8301 6.5256L22.8419 6.7693V33.8462C22.8416 34.4981 22.5905 35.1249 22.1406 35.5967C21.6908 36.0685 21.0766 36.3492 20.4255 36.3805C19.7743 36.4118 19.1361 36.1914 18.643 35.765C18.1499 35.3386 17.8398 34.7388 17.7769 34.0899L17.765 33.8462V6.7693C17.765 6.09605 18.0325 5.45039 18.5085 4.97433C18.9846 4.49828 19.6302 4.23083 20.3035 4.23083ZM13.5343 9.30776C14.2075 9.30776 14.8532 9.5752 15.3292 10.0513C15.8053 10.5273 16.0727 11.173 16.0727 11.8462V28.7693C16.0727 29.4425 15.8053 30.0882 15.3292 30.5642C14.8532 31.0403 14.2075 31.3077 13.5343 31.3077C12.861 31.3077 12.2153 31.0403 11.7393 30.5642C11.2632 30.0882 10.9958 29.4425 10.9958 28.7693V11.8462C10.9958 11.173 11.2632 10.5273 11.7393 10.0513C12.2153 9.5752 12.861 9.30776 13.5343 9.30776ZM27.0727 9.30776C27.746 9.30776 28.3916 9.5752 28.8677 10.0513C29.3437 10.5273 29.6112 11.173 29.6112 11.8462V28.7693C29.6112 29.4425 29.3437 30.0882 28.8677 30.5642C28.3916 31.0403 27.746 31.3077 27.0727 31.3077C26.3995 31.3077 25.7538 31.0403 25.2777 30.5642C24.8017 30.0882 24.5342 29.4425 24.5342 28.7693V11.8462C24.5342 11.173 24.8017 10.5273 25.2777 10.0513C25.7538 9.5752 26.3995 9.30776 27.0727 9.30776ZM6.76502 14.3847C7.43826 14.3847 8.08393 14.6521 8.55999 15.1282C9.03604 15.6042 9.30348 16.2499 9.30348 16.9231V23.6924C9.30348 24.3656 9.03604 25.0113 8.55999 25.4873C8.08393 25.9634 7.43826 26.2308 6.76502 26.2308C6.09178 26.2308 5.44611 25.9634 4.97006 25.4873C4.49401 25.0113 4.22656 24.3656 4.22656 23.6924V16.9231C4.22656 16.2499 4.49401 15.6042 4.97006 15.1282C5.44611 14.6521 6.09178 14.3847 6.76502 14.3847ZM33.8419 14.3847C34.473 14.3847 35.0814 14.6198 35.5485 15.044C36.0156 15.4683 36.308 16.0513 36.3686 16.6794L36.3804 16.9231V23.6924C36.3801 24.3443 36.129 24.9711 35.6791 25.4429C35.2292 25.9147 34.6151 26.1953 33.9639 26.2266C33.3128 26.258 32.6745 26.0376 32.1814 25.6111C31.6884 25.1847 31.3782 24.5849 31.3153 23.9361L31.3035 23.6924V16.9231C31.3035 16.2499 31.5709 15.6042 32.047 15.1282C32.523 14.6521 33.1687 14.3847 33.8419 14.3847Z" />
    </svg>
  );
}

// A single fixed pill at the bottom — a miniature of the hero input. The
// secondary cta/cases plates were removed (Vadim): instead the mascot flies to
// the centre of the screen and speaks at those moments (see CursorCompanion).
export function FloatingCompose() {
  const { open, isOpen } = useCompose();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hide the floating pill once the footer (which carries the inline letter
    // form) is in view — no point duplicating the compose CTA over the real form.
    let footerVisible = false;
    const compute = () => setVisible(!isOpen && window.scrollY >= 620 && !footerVisible);
    const footer = document.getElementById('contacts');
    const io =
      footer && 'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([e]) => {
              if (!e) return;
              footerVisible = e.isIntersecting;
              compute();
            },
            { threshold: 0.01 },
          )
        : null;
    if (footer) io?.observe(footer);
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      io?.disconnect();
    };
  }, [isOpen]);

  return (
    <div
      className="pointer-events-none fixed bottom-[24px] left-1/2 z-[110] -translate-x-1/2"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => open()}
        aria-label="Собрать письмо в студию"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : 20}px)`,
          maxWidth: 'calc(100vw - 32px)',
        }}
        className={`group block w-max cursor-pointer overflow-hidden rounded-[24px] bg-white text-left text-black shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex h-[66px] items-center gap-[8px] py-[8px] pl-[18px] pr-[8px]">
          <span
            className="h-[26px] w-[2.5px] shrink-0 bg-accent-hot [animation:caret-blink_1.1s_step-end_infinite] motion-reduce:animate-none"
            aria-hidden
          />
          <span className="whitespace-nowrap pr-[4px] text-[15px] text-black/55">
            Начните описывать задачу, мы поможем
          </span>
          <span className="grid size-[50px] shrink-0 place-items-center rounded-[16px] bg-surface2 text-black transition group-hover:bg-accent group-hover:text-white">
            <WaveIcon size={20} />
          </span>
        </div>
      </button>
    </div>
  );
}
