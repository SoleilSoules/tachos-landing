'use client';

import { useEffect, useState } from 'react';
import { useCompose } from './ComposeProvider';
import { AiIcon } from '@/components/AiIcon';

// A single fixed pill at the bottom — a miniature of the hero input. The
// secondary cta/cases plates were removed (Vadim): instead the mascot flies to
// the centre of the screen and speaks at those moments (see CursorCompanion).
export function FloatingCompose() {
  const { open, isOpen } = useCompose();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Visible after the hero, but HIDE it once the footer reaches the pill — the
    // footer has its own inline composer, so the floating pill overlapping it read
    // as clutter (Гоша). The pill sits ~90px tall off the bottom edge; when the
    // footer's top crosses that line it's sitting under the pill → hide.
    const compute = () => {
      const footer = document.getElementById('contacts');
      const inFooter = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 90
        : false;
      setVisible(!isOpen && window.scrollY >= 620 && !inFooter);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
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
        data-hint="floating"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : 20}px)`,
          maxWidth: 'calc(100vw - 32px)',
        }}
        className={`group block w-max cursor-pointer overflow-hidden rounded-[24px] bg-white text-left text-black shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* compact on mobile; on desktop (sm:) the original roomier pill. Voice button
            is flush to the right edge, full height (no gap to the white field) like hero. */}
        {/* No padding on the right or the vertical: the voice plate runs the full
            height and sits flush with the pill's edge (Гоша). The button's own
            overflow-hidden + rounded-[24px] clip its corners to the pill. */}
        <div className="flex h-[56px] items-center gap-[5px] pl-[14px] sm:h-[66px] sm:pl-[16px]">
          <span
            className="h-[22px] w-[2.5px] shrink-0 bg-accent-hot [animation:caret-blink_1.1s_step-end_infinite] motion-reduce:animate-none sm:h-[26px]"
            aria-hidden
          />
          <span className="flex-1 whitespace-nowrap pr-[6px] text-[14px] text-black/55 sm:text-[15px]">
            <span className="sm:hidden">Опишите задачу</span>
            <span className="hidden sm:inline">Начните описывать задачу, мы поможем</span>
          </span>
          {/* same mark as the hero button, so the pill reads as its miniature.
              Rounded on ALL four corners (Гоша) — the right pair lines up with the
              pill's own radius, the left pair is the change. */}
          <span className="grid h-full w-[64px] shrink-0 place-items-center rounded-[24px] bg-surface2 text-black transition group-hover:bg-accent group-hover:text-white sm:w-[80px]">
            <AiIcon size={30} />
          </span>
        </div>
      </button>
    </div>
  );
}
