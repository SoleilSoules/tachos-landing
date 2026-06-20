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
        className={`fixed left-1/2 top-1/2 z-[113] flex max-h-[90vh] w-[min(900px,calc(100vw-32px))] flex-col overflow-auto rounded-[28px] bg-ink text-inverted shadow-[0_50px_140px_rgba(0,0,0,0.55)] ${
          isOpen ? '' : 'pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-[10px] border-b border-white/10 bg-white/5 px-[20px] py-[14px]">
          <span className="flex gap-[6px]" aria-hidden>
            <i className="size-[10px] rounded-full bg-accent" />
            <i className="size-[10px] rounded-full bg-white/20" />
            <i className="size-[10px] rounded-full bg-white/20" />
          </span>
          <span className="text-[13px] text-inverted/55">Новое письмо</span>
          <button
            type="button"
            onClick={close}
            aria-label="Свернуть письмо"
            className="ml-auto grid size-[30px] place-items-center rounded-full bg-white/10 text-inverted/80 transition hover:bg-white/20 hover:text-inverted"
          >
            —
          </button>
        </div>

        <div className="p-[34px_40px]">
          {isSuccess ? <ComposeSent onClose={close} /> : <LetterBody active={isOpen} />}
        </div>
      </div>
    </>
  );
}
