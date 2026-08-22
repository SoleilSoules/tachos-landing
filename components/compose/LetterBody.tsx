'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  composeQuestions,
  typeChips,
  validateContact,
  type LetterType,
  type ContactError,
} from '@/lib/compose';
import { footer } from '@/lib/content';
import { useCompose } from './ComposeProvider';

const typeWord: Record<LetterType, string> = {
  app: 'мобильное приложение',
  web: 'веб-сервис',
  backend: 'backend',
  internal: 'внутреннюю систему',
  other: 'что-то другое',
  unset: '',
};

type SlotKey = 'type' | 'have' | 'when' | 'budget';
type Segment = { text: string } | { slot: SlotKey };

// Re-trigger the key-bump animation: remove, force a reflow, add again.
export const keyBump = (el: HTMLElement | null) => {
  if (!el) return;
  el.classList.remove('key-bump');
  void el.offsetWidth;
  el.classList.add('key-bump');
};

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function CopyGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
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

function Slot({
  value,
  ph,
  showPopup,
  options,
  onPick,
}: {
  value?: string;
  ph: string;
  showPopup: boolean;
  options: { v: string; label: string }[];
  onPick: (v: string) => void;
}) {
  const popRef = useRef<HTMLSpanElement>(null);

  // The options hang centred under their slot, so a slot near either edge pushes
  // them past the letter's boundary. Work it out from the SLOT's geometry and the
  // popup's own width — never from the popup's current position, which already
  // carries the previous shift and would compound it on every recalculation.
  useEffect(() => {
    const el = popRef.current;
    const anchor = el?.parentElement;
    if (!showPopup || !el || !anchor) return;
    const bounds = el.closest('[data-letter-bounds]')?.getBoundingClientRect();
    if (!bounds) return;

    const slot = anchor.getBoundingClientRect();
    const w = el.offsetWidth; // layout width, unaffected by transform
    const pad = 8;
    const centred = slot.left + slot.width / 2 - w / 2;
    const clamped = Math.max(bounds.left + pad, Math.min(centred, bounds.right - pad - w));
    const shift = Math.round(clamped - centred);
    el.style.transform = shift ? `translateX(calc(-50% + ${shift}px))` : '';
  }, [showPopup, options]);

  return (
    <span className="relative inline-block align-baseline">
      <span
        className={
          value
            ? 'font-medium text-accent underline decoration-accent/40 underline-offset-[6px]'
            : showPopup
              ? 'rounded-[4px] bg-accent/15 px-[4px] text-accent/90 underline decoration-accent/50 decoration-dotted underline-offset-[6px]'
              : 'text-inverted/35 underline decoration-inverted/25 decoration-dotted underline-offset-[6px]'
        }
      >
        {value || ph}
      </span>
      {showPopup && (
        // Opaque floating plate (its own bg + shadow) so the option pills read
        // as a deliberate popover ON TOP of the letter — never a see-through mush
        // overlapping the divider/text below.
        <span
          ref={popRef}
          // No plate behind the options: they float as separate pills and wrap
          // instead of being clipped by a fixed-width scroller (the last one used
          // to hide off the right edge).
          className="absolute left-1/2 top-[calc(100%+10px)] z-40 flex w-max max-w-[min(92vw,540px)] -translate-x-1/2 flex-wrap gap-[7px] leading-none [animation:compose-pop-in_.22s_ease-out] motion-reduce:[animation:none] sm:gap-[8px]"
        >
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => onPick(o.v)}
              // Warm at rest, hot on hover — the spotlight adds the rest of the heat.
              className="relative z-10 inline-flex h-[36px] shrink-0 items-center whitespace-nowrap rounded-[12px] border border-accent/35 bg-accent/[0.13] px-[14px] text-[13px] font-semibold text-accent shadow-[0_10px_26px_rgba(0,0,0,0.5)] transition duration-200 hover:border-accent hover:bg-accent hover:text-inverted sm:h-[40px] sm:rounded-[13px] sm:px-[17px] sm:text-[14px]"
            >
              {o.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

// Success card shown in place of the letter after a send. Reused by the modal and
// the inline (footer) instance.
export function ComposeSent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] py-[40px] text-center">
      <div className="grid size-[56px] place-items-center rounded-full bg-accent text-[22px] font-semibold text-inverted">
        А
      </div>
      <h3 className="text-[24px] font-semibold">Письмо у Анны</h3>
      <p className="max-w-[420px] text-[15px] leading-[1.4] text-inverted/60">
        Ответим в течение рабочего дня. Один ответ по делу — без рассылок и спама.
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-[16px] rounded-full bg-white/10 px-[22px] py-[11px] text-[14px] text-inverted transition hover:bg-white/15"
        >
          Вернуться на сайт
        </button>
      )}
    </div>
  );
}

// The whole letter-composer body, reusable in BOTH the modal overlay and inline
// in the footer. `active` drives the step-by-step typing (modal: isOpen; footer:
// in-view). The picked answers live in the shared `useCompose` state, so the two
// instances stay in sync — choose a type in the footer and the modal shows it too.
export function LetterBody({
  active,
  autofocus = true,
  // 'lg' is the footer, where the letter replaces a section heading and has the
  // full page width to breathe; 'md' is the modal.
  size = 'md',
}: {
  active: boolean;
  autofocus?: boolean;
  size?: 'md' | 'lg';
}) {
  const { state, sendStatus, setField, submitLetter, resetSend } = useCompose();
  const contactRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [contactError, setContactError] = useState<ContactError>(null);
  const [agreeError, setAgreeError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mailCopied, setMailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [done, setDone] = useState<SlotKey[]>([]);
  const doneRef = useRef<SlotKey[]>([]);
  doneRef.current = done;

  const contactErrId = useId();
  const agreeErrId = useId();

  const isSending = sendStatus === 'sending';
  const isError = sendStatus === 'error';

  const segments = useMemo<Segment[]>(
    () => [
      { text: 'Здравствуйте! Нам нужно сделать ' },
      { slot: 'type' },
      { text: state.freeText ? `. Своими словами: «${state.freeText}». Сейчас ` : '. Сейчас ' },
      { slot: 'have' },
      { text: '. Сроки — ' },
      { slot: 'when' },
      { text: '.\n\nОриентир по бюджету — ' },
      { slot: 'budget' },
      { text: '.\n\nРасскажите, как вы работаете и что нужно от нас для оценки.' },
    ],
    [state.freeText],
  );

  const segRef = useRef(0);
  const charRef = useRef(0);
  const wasActiveRef = useRef(false);
  const [, forceTick] = useState(0);
  const rerender = () => forceTick((t) => t + 1);

  // Step-by-step: type prose until an UNFILLED slot, then STOP and show only that
  // slot's popup. Re-runs on `done` change (a pick) WITHOUT resetting segRef (only
  // a fresh activation resets), so typing resumes onward to the next slot.
  useEffect(() => {
    if (!active) {
      wasActiveRef.current = false;
      segRef.current = 0;
      charRef.current = 0;
      // Same-identity bailout so an inactive instance doesn't loop the effect.
      setDone((d) => (d.length ? [] : d));
      return;
    }
    const justActivated = !wasActiveRef.current;
    wasActiveRef.current = true;
    if (justActivated) {
      segRef.current = 0;
      charRef.current = 0;
      // a pre-picked type (hero chip) counts as the first slot already answered.
      if (state.type !== 'unset') setDone((d) => (d.includes('type') ? d : ['type']));
      rerender();
    }
    if (reducedMotion()) {
      segRef.current = segments.length;
      rerender();
      return;
    }

    let id: ReturnType<typeof setTimeout>;
    let stop = false;
    const step = () => {
      if (stop) return;
      const cur = segments[segRef.current];
      if (!cur) {
        rerender();
        return; // letter finished
      }
      if ('text' in cur) {
        if (charRef.current < cur.text.length) {
          // one char at a time, a touch slower — calmer, more readable typing
          charRef.current = Math.min(cur.text.length, charRef.current + 1);
          rerender();
          id = setTimeout(step, 34);
        } else {
          segRef.current += 1;
          charRef.current = 0;
          rerender();
          id = setTimeout(step, 60);
        }
      } else if (doneRef.current.includes(cur.slot)) {
        segRef.current += 1; // slot chosen — type past it to the next prose
        rerender();
        id = setTimeout(step, 120);
      } else {
        rerender(); // unfilled slot — STOP and wait for the user's pick
      }
    };
    id = setTimeout(step, justActivated ? 360 : 90);
    return () => {
      stop = true;
      clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, done, segments]);

  // Reset send status when this instance deactivates — but NEVER wipe an 'error'
  // the user hasn't dismissed: both instances (modal + footer) share sendStatus,
  // so closing the modal must not silently clear an error the footer should show.
  useEffect(() => {
    if (!active && sendStatus !== 'error') resetSend();
  }, [active, sendStatus, resetSend]);

  const typing = segRef.current < segments.length;
  const curSeg = segments[segRef.current];
  const awaiting = curSeg && 'slot' in curSeg && !done.includes(curSeg.slot) ? curSeg.slot : null;

  // Every slot answered and the typing caught up → the contact is the only thing
  // left, so the field lights up in accent until the user starts filling it.
  const letterDone = !typing && segments.every((s) => !('slot' in s) || done.includes(s.slot));
  const nudgeContact = letterDone && !contact.trim() && !contactError;

  const pick = (key: SlotKey, v: string) => {
    setField(key, v);
    setDone((d) => (d.includes(key) ? d : [...d, key]));
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };
  const send = () => {
    const ce = validateContact(contact);
    const ae = !agreed;
    setContactError(ce);
    setAgreeError(ae);
    if (ce) {
      contactRef.current?.focus();
      return;
    }
    if (ae) return;
    submitLetter(contact);
  };
  // Copy with feedback on every path: clipboard API → legacy textarea fallback
  // (insecure context / in-app webviews) → error toast.
  const copy = async (text: string, msg: string): Promise<boolean> => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no-clipboard');
      await navigator.clipboard.writeText(text);
      flash(msg);
      return true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        // execCommand signals failure via its return value, not an exception —
        // without this check the toast claimed «скопирована» on a failed copy
        const ok = document.execCommand('copy');
        ta.remove();
        if (!ok) throw new Error('execCommand copy failed');
        flash(msg);
        return true;
      } catch {
        flash('Не удалось скопировать — выделите текст вручную');
        return false;
      }
    }
  };
  const copyMail = async () => {
    const ok = await copy(footer.contacts.email.value, 'Почта скопирована');
    if (!ok) return;
    setMailCopied(true);
    setTimeout(() => setMailCopied(false), 1400);
  };
  const copyPhone = async () => {
    const ok = await copy(footer.contacts.phone.value, 'Телефон скопирован');
    if (!ok) return;
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 1400);
  };

  const slotValue = (key: SlotKey): string =>
    key === 'type' ? (state.type !== 'unset' ? typeWord[state.type] : '') : state[key];
  const slotOptions = (key: SlotKey) =>
    key === 'type'
      ? typeChips.map((c) => ({ v: c.type, label: c.label }))
      : [...composeQuestions[key].options];
  const slotPh = (key: SlotKey) => (key === 'budget' ? 'по запросу' : '…');

  return (
    // data-letter-bounds marks the box the option popups must stay inside.
    <div data-letter-bounds className="relative flex flex-col gap-[22px]">
      {/* The studio's own contacts head the letter (Гоша) — same pair as the
          footer, for anyone who'd rather write or call directly. */}
      <div className="flex flex-wrap items-center gap-x-[22px] gap-y-[6px] text-[13px] text-inverted/45">
        <button
          type="button"
          onClick={copyMail}
          aria-label={`Скопировать почту ${footer.contacts.email.value}`}
          className="group/mail inline-flex items-center gap-[6px] rounded-[6px] outline-none transition hover:text-inverted/80 focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <span className="underline decoration-dotted underline-offset-[4px]">
            {footer.contacts.email.value}
          </span>
          {mailCopied ? (
            <span className="text-[12px] text-accent">✓</span>
          ) : (
            <CopyGlyph className="text-inverted/35 transition group-hover/mail:text-inverted/70" />
          )}
        </button>
        <button
          type="button"
          onClick={copyPhone}
          aria-label={`Скопировать телефон ${footer.contacts.phone.value}`}
          className="group/tel inline-flex items-center gap-[6px] rounded-[6px] outline-none transition hover:text-inverted/80 focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <span className="nums">{footer.contacts.phone.value}</span>
          {phoneCopied ? (
            <span className="text-[12px] text-accent">✓</span>
          ) : (
            <CopyGlyph className="text-inverted/35 transition group-hover/tel:text-inverted/70" />
          )}
        </button>
      </div>

      {/* THE LETTER — types step by step, stopping at each empty slot */}
      {/* Mobile: slightly tighter line-height so the letter reads as a block, not airy lines */}
      {/* The letter IS the headline of this form — sized to carry the screen,
          with the line-height kept generous enough for the option pills to drop
          under a slot without crowding the next line. */}
      <div
        className={`whitespace-pre-line font-medium tracking-[-0.01em] text-inverted ${
          size === 'lg'
            ? 'text-[22px] leading-[1.6] sm:text-[28px] sm:leading-[1.7] lg:text-[36px] lg:leading-[1.7]'
            : 'text-[19px] leading-[1.65] sm:text-[23px] sm:leading-[1.75] lg:text-[27px] lg:leading-[1.85]'
        }`}
      >
        {segments.map((s, i) => {
          if (i > segRef.current) return null;
          if ('text' in s) {
            const txt = i < segRef.current ? s.text : s.text.slice(0, charRef.current);
            const showCaret = typing && i === segRef.current && !awaiting;
            return (
              <span key={i}>
                {txt}
                {showCaret && (
                  <span
                    aria-hidden
                    className="ml-[1px] inline-block h-[1em] w-[2px] -translate-y-[1px] bg-accent-hot align-middle [animation:compose-caret_1s_step-end_infinite]"
                  />
                )}
              </span>
            );
          }
          const key = s.slot;
          return (
            <Slot
              key={i}
              value={slotValue(key)}
              ph={slotPh(key)}
              showPopup={awaiting === key && i === segRef.current}
              options={slotOptions(key)}
              onPick={(v) => pick(key, v)}
            />
          );
        })}
      </div>

      {/* Mobile: trim the gap above the reply block — 48px reads as a dead zone on small screens */}
      <div className="mt-[28px] border-t border-white/10 pt-[18px] sm:mt-[48px] sm:pt-[22px]">
        <div className="mb-[12px] text-[14px] font-medium text-inverted/90">
          Куда прислать ответ
        </div>

        {isError && (
          <div
            role="alert"
            className="mb-[12px] rounded-[10px] border border-accent/30 bg-accent/10 px-[14px] py-[10px] text-[13px] text-accent"
          >
            Не удалось отправить — попробуйте еще раз или скопируйте письмо.
          </div>
        )}

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <div className="flex-1">
            <input
              ref={contactRef}
              data-autofocus={autofocus || undefined}
              data-hint="contact"
              type="text"
              value={contact}
              onChange={(e) => {
                keyBump(e.currentTarget);
                setContact(e.target.value);
                setContactError(null);
              }}
              placeholder="Телефон, почта или Telegram"
              autoComplete="off"
              aria-invalid={contactError !== null}
              aria-describedby={contactError ? contactErrId : undefined}
              // White field, like the hero prompt — the one bright surface in the
              // letter, so the eye lands on the thing left to fill.
              className={`h-[54px] w-full rounded-[14px] border bg-white px-[16px] text-[15px] text-black outline-none transition placeholder:text-black/40 ${
                contactError
                  ? 'border-accent'
                  : nudgeContact
                    ? 'contact-nudge border-accent/70'
                    : 'border-transparent'
              }`}
            />
            {contactError && (
              <p id={contactErrId} role="alert" className="mt-[6px] text-[12px] text-accent">
                {contactError === 'empty'
                  ? 'Оставьте контакт — ответим туда'
                  : 'Не похоже на телефон, почту или @telegram'}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={send}
            disabled={isSending}
            className="flex h-[54px] items-center justify-center gap-[8px] rounded-[14px] bg-accent px-[40px] text-[16px] font-medium text-inverted shadow-[0_10px_30px_rgba(240,81,56,0.35)] transition hover:brightness-110 disabled:opacity-60 sm:w-[200px]"
          >
            {isSending ? (
              <>
                <span
                  aria-hidden
                  className="size-[14px] animate-spin rounded-full border-2 border-inverted/30 border-t-inverted"
                />
                Отправляем…
              </>
            ) : isError ? (
              'Повторить'
            ) : (
              'Обсудить задачу'
            )}
          </button>
        </div>

        {/* One short line: the legal wording is in the tooltip-length title, the
            visible promise is the part that matters to a visitor. */}
        <label className="mt-[14px] flex cursor-pointer items-center gap-[8px] text-[12.5px] leading-[1.4] text-inverted/45">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setAgreeError(false);
            }}
            aria-invalid={agreeError}
            aria-describedby={agreeError ? agreeErrId : undefined}
            className="accent-accent"
          />
          <span>Согласен на обработку персональных данных. Ответим по делу, без рассылок</span>
        </label>
        {agreeError && (
          <p id={agreeErrId} role="alert" className="mt-[6px] text-[12px] text-accent">
            Нужно согласие
          </p>
        )}

        {/* The doc's postscript — the form itself is a work sample. */}
        <p className="mt-[14px] text-[12.5px] leading-[1.4] text-inverted/35">
          P. S. Нравится эта форма? Можем сделать похожую для вашего продукта.
        </p>
      </div>

      {toast && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-[16px] py-[8px] text-[13px] text-inverted"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
