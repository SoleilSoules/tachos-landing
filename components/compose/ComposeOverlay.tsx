'use client';

import { useFocusTrap } from '@/lib/useFocusTrap';
import { useCompose } from './ComposeProvider';
import { LetterBody, ComposeSent } from './LetterBody';

// Modal shell around the shared <LetterBody>. The same body renders inline in the
// footer; the picked answers stay in sync via the shared compose state.
export function ComposeOverlay() {
  const { isOpen, close, sendStatus } = useCompose();
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);
  const isSuccess = sendStatus === 'success';

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[112] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Письмо в студию"
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        data-lenis-prevent
        style={{
          transformOrigin: 'center',
          transform: isOpen
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, calc(50vh - 40px)) scale(0.06)',
          opacity: isOpen ? 1 : 0,
          transition: isOpen
            ? 'transform .44s cubic-bezier(.2,.9,.25,1.12), opacity .26s ease-out'
            : 'transform .5s cubic-bezier(.6,0,.85,.35), opacity .46s ease-in .06s',
        }}
        // The sheet opens near its final size: the letter types itself line by
        // line, and without a floor the box grew under the reader's eyes.
        className={`fixed left-1/2 top-1/2 z-[113] flex max-h-[90vh] min-h-[min(460px,80vh)] w-[min(900px,calc(100vw-32px))] flex-col overflow-auto rounded-[28px] bg-ink text-inverted shadow-[0_50px_140px_rgba(0,0,0,0.55)] sm:min-h-[min(600px,82vh)] ${
          isOpen ? '' : 'pointer-events-none'
        }`}
      >
        {/* No window chrome: the mac traffic lights and the "Новое письмо" title
            were set dressing around two real actions. Just a close button. */}
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть письмо"
          className="absolute right-[18px] top-[18px] z-10 grid size-[36px] place-items-center rounded-full bg-white/[0.07] text-[19px] leading-none text-inverted/70 transition hover:bg-white/15 hover:text-inverted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright"
        >
          ×
        </button>

        <div className="p-[38px_28px_32px] sm:p-[44px_44px_38px]">
          {isSuccess ? <ComposeSent onClose={close} /> : <LetterBody active={isOpen} />}
        </div>
      </div>
    </>
  );
}
