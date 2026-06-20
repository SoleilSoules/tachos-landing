'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { useCompose } from '@/components/compose/ComposeProvider';
import { footer } from '@/lib/content';
import { LetterBody, ComposeSent } from '@/components/compose/LetterBody';

export function Footer() {
  const { sendStatus } = useCompose();
  const isSuccess = sendStatus === 'success';
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mailCopied, setMailCopied] = useState(false);

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
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect(); // one-shot: once typing starts it never needs to re-fire
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no-clipboard');
      await navigator.clipboard.writeText(footer.contacts.email.value);
      setMailCopied(true);
      setTimeout(() => setMailCopied(false), 1400);
    } catch {
      // no clipboard (insecure context / webview) — don't fake a "✓ скопировано";
      // the address is shown on screen to copy by hand
    }
  };

  return (
    <footer id="contacts" ref={ref} className="relative overflow-hidden rounded-t-[40px] bg-bg text-inverted">
      <div className="relative mx-auto max-w-page px-[96px] pb-[54px] pt-[100px]">
        <div className="relative grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,1fr)_460px]">
          {/* left — the smart letter, the very same composer as the modal (synced) */}
          <div>
            <h2 className="max-w-[611px] text-[52px] font-semibold leading-[0.9] tracking-[-0.01em]">
              {footer.formTitle[0]} {footer.formTitle[1]}
              <br />
              {footer.formTitle[2]}
            </h2>
            <div className="mt-[36px] max-w-[660px]">
              {isSuccess ? <ComposeSent /> : <LetterBody active={inView} autofocus={false} />}
            </div>
          </div>

          {/* right — the perch where the big Начос sits (over the flame glow) */}
          <div
            data-mascot-perch
            aria-hidden
            className="pointer-events-none relative hidden min-h-[460px] lg:block"
          >
            <div className="absolute right-[10px] top-1/2 h-[600px] w-[520px] -translate-y-1/2">
              <Image src={asset('/figma/footer-fire.svg')} alt="" fill className="object-contain" priority={false} />
            </div>
          </div>
        </div>

        {/* requisites — city, tap-to-copy email, phone + manager card */}
        <div className="relative mt-[64px] flex flex-wrap items-end justify-between gap-[36px] border-t border-white/10 pt-[40px]">
          <div className="flex flex-col gap-[16px] text-[16px] font-medium tracking-[0.04em]">
            <span className="uppercase text-white/80">{footer.contacts.city}</span>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Скопировать почту"
              className="group/mail flex w-fit items-center gap-[8px] text-white/70 transition hover:text-accent-bright"
            >
              <span className="underline decoration-dotted underline-offset-[5px]">{footer.contacts.email.value}</span>
              <span className="text-[13px] text-white/40 group-hover/mail:text-accent-bright">
                {mailCopied ? '✓ скопировано' : 'нажмите, чтобы скопировать'}
              </span>
            </button>
            <a
              href={`tel:${footer.contacts.phone.value.replace(/[^+\d]/g, '')}`}
              className="w-fit text-white/70 transition hover:text-accent-bright"
            >
              {footer.contacts.phone.value}
            </a>
          </div>

          {/* manager moved here */}
          <div className="flex items-center gap-[10px]">
            <span className="size-[54px] shrink-0 overflow-hidden rounded-full">
              <Image src={asset('/figma/mgr-anna.png')} alt={footer.manager.name} width={54} height={54} className="size-full object-cover" />
            </span>
            <span className="leading-tight">
              <span className="block text-[16px] tracking-[0.03em] text-[#f5f7f6]">{footer.manager.name}</span>
              <span className="block text-[14px] text-[#b9b9b9]">{footer.manager.role}</span>
            </span>
            <span className="ml-[6px] grid size-[58px] place-items-center rounded-full bg-accent">
              <Image src={asset('/figma/mgr-tg.svg')} alt="" width={26} height={26} />
            </span>
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
