'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  buildLetter,
  composeQuestions,
  typeChips,
  validateContact,
  type LetterType,
  type ContactError,
} from '@/lib/compose';
import { useCompose } from './ComposeProvider';

const typeWord: Record<LetterType, string> = {
  site: 'сайт',
  app: 'приложение',
  shop: 'магазин',
  game: 'игру',
  idk: '',
};

type SlotKey = 'type' | 'have' | 'when' | 'budget';
type Segment = { text: string } | { slot: SlotKey };

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
  return (
    <span className="relative inline-block align-baseline">
      <span
        className={
          value
            ? 'font-medium text-accent underline decoration-accent/40 underline-offset-[6px]'
            : showPopup
              ? 'rounded-[4px] bg-accent/15 px-[4px] text-accent/90 underline decoration-dotted decoration-accent/50 underline-offset-[6px]'
              : 'text-inverted/35 underline decoration-dotted decoration-inverted/25 underline-offset-[6px]'
        }
      >
        {value || ph}
      </span>
      {showPopup && (
        // Opaque floating plate (its own bg + shadow) so the option pills read
        // as a deliberate popover ON TOP of the letter — never a see-through mush
        // overlapping the divider/text below.
        <span className="absolute left-0 top-[calc(100%+8px)] z-40 flex max-w-[min(440px,78vw)] flex-wrap gap-[8px] rounded-[14px] bg-ink p-[8px] leading-none shadow-[0_18px_44px_rgba(0,0,0,0.55)] ring-1 ring-white/10 motion-safe:[animation:compose-pop-in_.22s_ease-out]">
          {options.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => onPick(o.v)}
              className="inline-flex h-[32px] items-center whitespace-nowrap rounded-[11px] border border-accent/30 bg-accent/15 px-[13px] text-[13.5px] font-semibold text-accent transition hover:bg-accent hover:text-inverted"
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
export function LetterBody({ active, autofocus = true }: { active: boolean; autofocus?: boolean }) {
  const { state, sendStatus, setField, submitLetter, resetSend } = useCompose();
  const contactRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [contactError, setContactError] = useState<ContactError>(null);
  const [agreeError, setAgreeError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mailCopied, setMailCopied] = useState(false);
  const [done, setDone] = useState<SlotKey[]>([]);
  const doneRef = useRef<SlotKey[]>([]);
  doneRef.current = done;

  const { subject, body } = buildLetter(state);
  const contactErrId = useId();
  const agreeErrId = useId();

  const isSending = sendStatus === 'sending';
  const isError = sendStatus === 'error';

  const segments = useMemo<Segment[]>(
    () => [
      { text: 'Здравствуйте! У меня запрос на ' },
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
      if (state.type !== 'idk') setDone((d) => (d.includes('type') ? d : ['type']));
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
        document.execCommand('copy');
        ta.remove();
        flash(msg);
        return true;
      } catch {
        flash('Не удалось скопировать — выделите текст вручную');
        return false;
      }
    }
  };
  const copyMail = async () => {
    const ok = await copy('hello@tachos.ru', 'Почта скопирована');
    if (!ok) return;
    setMailCopied(true);
    setTimeout(() => setMailCopied(false), 1400);
  };

  const slotValue = (key: SlotKey): string =>
    key === 'type' ? (state.type !== 'idk' ? typeWord[state.type] : '') : state[key];
  const slotOptions = (key: SlotKey) =>
    key === 'type'
      ? typeChips.map((c) => ({ v: c.type, label: c.label }))
      : [...composeQuestions[key].options];
  const slotPh = (key: SlotKey) => (key === 'budget' ? 'по запросу' : '…');

  return (
    <div className="relative flex flex-col gap-[24px]">
      <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[4px] text-[13px] text-inverted/45">
        <span>
          От: <b className="font-medium text-inverted/80">вы</b>
        </span>
        <button
          type="button"
          onClick={copyMail}
          aria-label="Скопировать почту hello@tachos.ru"
          className="group/mail inline-flex items-center gap-[6px] rounded-[6px] px-[2px] py-[1px] outline-none transition hover:text-inverted/70 focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <span>
            Кому:{' '}
            <b className="font-medium text-inverted/80 underline decoration-dotted underline-offset-2">
              hello@tachos.ru
            </b>
          </span>
          {mailCopied ? (
            <span className="text-[12px] text-accent">✓</span>
          ) : (
            <CopyGlyph className="text-inverted/40 transition group-hover/mail:text-inverted/70" />
          )}
        </button>
        <span>
          Тема: <b className="font-medium text-inverted/80">{subject}</b>
        </span>
      </div>

      {/* THE LETTER — types step by step, stopping at each empty slot */}
      <div className="whitespace-pre-line text-[17px] leading-[1.85] text-inverted/90 lg:text-[20px] lg:leading-[2.2]">
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

      <div className="mt-[10px] border-t border-white/10 pt-[22px]">
        <div className="mb-[12px] text-[14px] font-medium text-inverted/90">Куда вам ответить</div>

        {isError && (
          <div role="alert" className="mb-[12px] rounded-[10px] border border-accent/30 bg-accent/10 px-[14px] py-[10px] text-[13px] text-accent">
            Не удалось отправить — попробуйте ещё раз или скопируйте письмо.
          </div>
        )}

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <div className="flex-1">
            <input
              ref={contactRef}
              data-autofocus={autofocus || undefined}
              data-hint="Сюда придёт ответ"
              data-hint-sub="телефон, почта или @telegram"
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setContactError(null);
              }}
              placeholder="Телефон, почта или @telegram"
              autoComplete="off"
              aria-invalid={contactError !== null}
              aria-describedby={contactError ? contactErrId : undefined}
              className={`h-[54px] w-full rounded-[14px] border bg-black/30 px-[16px] text-[15px] text-inverted outline-none transition placeholder:text-inverted/40 focus:border-white/25 ${
                contactError ? 'border-accent' : 'border-white/10'
              }`}
            />
            {contactError && (
              <p id={contactErrId} role="alert" className="mt-[6px] text-[12px] text-accent">
                {contactError === 'empty' ? 'Оставьте контакт — ответим туда' : 'Не похоже на телефон, почту или @telegram'}
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
                <span aria-hidden className="size-[14px] animate-spin rounded-full border-2 border-inverted/30 border-t-inverted" />
                Отправляем…
              </>
            ) : isError ? (
              'Повторить'
            ) : (
              'Отправить'
            )}
          </button>
        </div>

        <label className="mt-[16px] flex cursor-pointer items-start gap-[8px] text-[12px] leading-[1.4] text-inverted/55">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setAgreeError(false);
            }}
            aria-invalid={agreeError}
            aria-describedby={agreeError ? agreeErrId : undefined}
            className="mt-[2px] accent-accent"
          />
          <span>Даю согласие на обработку персональных данных. Один ответ по делу — без рассылок.</span>
        </label>
        {agreeError && (
          <p id={agreeErrId} role="alert" className="mt-[6px] text-[12px] text-accent">
            Нужно согласие
          </p>
        )}
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
