'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { useCompose } from '@/components/compose/ComposeProvider';
import { footer } from '@/lib/content';
import { LetterBody, ComposeSent } from '@/components/compose/LetterBody';

function CopyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="text-white/40 transition group-hover/c:text-accent-bright"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.5 10.5h-.5A1.5 1.5 0 0 1 1.5 9V3A1.5 1.5 0 0 1 3 1.5h6A1.5 1.5 0 0 1 10.5 3v.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  const { sendStatus } = useCompose();
  const isSuccess = sendStatus === 'success';
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mailCopied, setMailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  // Start the inline letter typing once the footer scrolls into view (not on load,
  // since it sits at the very bottom).
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect(); // one-shot: once typing starts it never needs to re-fire
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Copy a contact value with a brief ✓; no fake success if clipboard is blocked.
  const copyContact = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no-clipboard');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // no clipboard (insecure context / webview) — value stays on screen to copy
    }
  };

  return (
    <footer
      id="contacts"
      ref={ref}
      className="relative overflow-hidden rounded-t-[24px] bg-bg text-inverted lg:rounded-t-[40px]"
    >
      <div className="relative mx-auto max-w-page px-5 pb-[40px] pt-[64px] sm:px-10 lg:px-[96px] lg:pb-[54px] lg:pt-[100px]">
        <div className="relative grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,1fr)_460px]">
          {/* left — the smart letter, the very same composer as the modal (synced) */}
          <div>
            <h2 className="max-w-[611px] text-[clamp(30px,8vw,52px)] font-semibold leading-[0.95] tracking-[-0.01em] lg:leading-[0.9]">
              {footer.formTitle[0]}
              <br />
              {footer.formTitle[1]} {footer.formTitle[2]}
            </h2>
            <div className="mt-[36px] max-w-[660px]">
              {isSuccess ? <ComposeSent /> : <LetterBody active={inView} autofocus={false} />}
            </div>
            {/* manager sits right under the letter — Anna is who replies to it */}
            <div className="mt-[28px] flex items-center gap-[10px]">
              <span className="size-[54px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src={asset('/figma/mgr-anna.png')}
                  alt={footer.manager.name}
                  width={54}
                  height={54}
                  className="size-full object-cover"
                />
              </span>
              <span className="leading-tight">
                <span className="block text-[16px] tracking-[0.03em] text-[#f5f7f6]">
                  {footer.manager.name}
                </span>
                <span className="block text-[14px] text-[#b9b9b9]">{footer.manager.role}</span>
              </span>
            </div>
          </div>

          {/* right — sizer slot the cursor mascot flies into and GROWS to fill (it
              literally becomes the big footer mascot; rendered + flown here by
              CursorCompanion.tsx, which reads this slot's live rect). The inline SVG is a
              STATIC fallback shown only under reduced-motion, where the animated companion
              is disabled. Hidden on touch/small where the mascot is off. */}
          <div className="pointer-events-none relative hidden min-h-[580px] lg:block xl:min-h-[660px]">
            <div
              data-mascot-perch
              className="absolute right-[10px] top-1/2 h-[560px] w-[560px] origin-center -translate-y-1/2 opacity-0 motion-reduce:opacity-100 xl:h-[640px] xl:w-[640px]"
            >
              <svg viewBox="0 0 26 26" className="h-full w-full" aria-hidden>
                <path
                  d="M6 4.6 L20 4.6 Q23 4.6 21.6 7.4 L14.9 20.4 Q13 23.5 11.1 20.4 L4.4 7.4 Q3 4.6 6 4.6 Z"
                  fill="#F84800"
                />
                <g>
                  <circle cx="10" cy="10" r="2.1" fill="#fff" />
                  <circle cx="10.5" cy="10.4" r="1" fill="#0E0E10" />
                </g>
                <g>
                  <circle cx="16" cy="10" r="2.1" fill="#fff" />
                  <circle cx="16.5" cy="10.4" r="1" fill="#0E0E10" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* requisites — city, tap-to-copy email, phone */}
        {/* mobile: tighter gap + lighter top padding above requisites; desktop unchanged */}
        <div className="relative mt-[40px] border-t border-white/10 pt-[28px] lg:mt-[64px] lg:pt-[40px]">
          <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[14px] text-[16px] font-medium tracking-[0.04em]">
            <span className="uppercase text-white/80">{footer.contacts.city}</span>
            <button
              type="button"
              onClick={() => copyContact(footer.contacts.email.value, setMailCopied)}
              aria-label="Скопировать почту"
              className="group/c flex items-center gap-[8px] text-white/70 transition hover:text-accent-bright sm:ml-auto"
            >
              <span className="underline decoration-dotted underline-offset-[5px]">
                {footer.contacts.email.value}
              </span>
              {mailCopied ? (
                <span className="text-[14px] text-accent-bright">✓</span>
              ) : (
                <CopyIcon />
              )}
            </button>
            <button
              type="button"
              onClick={() => copyContact(footer.contacts.phone.value, setPhoneCopied)}
              aria-label="Скопировать телефон"
              className="group/c flex items-center gap-[8px] text-white/70 transition hover:text-accent-bright"
            >
              <span>{footer.contacts.phone.value}</span>
              {phoneCopied ? (
                <span className="text-[14px] text-accent-bright">✓</span>
              ) : (
                <CopyIcon />
              )}
            </button>
          </div>
        </div>

        {/* one-line legal — Vadim to expand for РКН / 152-ФЗ if needed */}
        <div className="mt-[28px] text-[12px] tracking-[0.02em] text-white/25">
          ООО «Тачос» · ИНН 3460009833 · 400131, г. Волгоград, наб. 62-й Армии, д. 6
        </div>
      </div>
    </footer>
  );
}
