'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  buildLetter,
  composeQuestions,
  typeChips,
  validateContact,
  type ComposeState,
  type ContactError,
} from '@/lib/compose';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { useCompose } from './ComposeProvider';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ComposeOverlay() {
  const { isOpen, state, sendStatus, setField, close, submitLetter, resetSend } =
    useCompose();
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);
  const letterRef = useRef<HTMLTextAreaElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [contactError, setContactError] = useState<ContactError>(null);
  const [agreeError, setAgreeError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Whether the user hand-edited the letter — if so, chip changes don't rewrite it.
  const edited = useRef(false);
  const prevChips = useRef({
    type: state.type,
    have: state.have,
    when: state.when,
    budget: state.budget,
    freeText: state.freeText,
  });

  const { subject, body } = buildLetter(state);
  const contactErrId = useId();
  const agreeErrId = useId();

  const isSending = sendStatus === 'sending';
  const isSuccess = sendStatus === 'success';
  const isError = sendStatus === 'error';

  // Reset edited flag each time the form opens.
  useEffect(() => {
    if (isOpen) edited.current = false;
  }, [isOpen]);

  // Clear transient send status when the form closes.
  useEffect(() => {
    if (!isOpen) resetSend();
  }, [isOpen, resetSend]);

  // Typewriter: rewrite the letter on chip change — unless the user edited it.
  useEffect(() => {
    if (!isOpen) return;
    const el = letterRef.current;
    if (!el) return;

    const prev = prevChips.current;
    const chipsChanged =
      prev.type !== state.type ||
      prev.have !== state.have ||
      prev.when !== state.when ||
      prev.budget !== state.budget ||
      prev.freeText !== state.freeText;
    prevChips.current = {
      type: state.type,
      have: state.have,
      when: state.when,
      budget: state.budget,
      freeText: state.freeText,
    };

    if (edited.current && chipsChanged) return;

    if (prefersReducedMotion()) {
      el.value = body;
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    el.value = '';
    const tick = () => {
      el.value = body.slice(0, i);
      i += 2 + Math.round(Math.random() * 2);
      if (i <= body.length + 2) timer = setTimeout(tick, 16);
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, state.type, state.have, state.when, state.budget, state.freeText]);

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

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text).then(() => flash(msg));
  };

  const groups: { key: keyof typeof composeQuestions; field: keyof ComposeState }[] = [
    { key: 'have', field: 'have' },
    { key: 'when', field: 'when' },
    { key: 'budget', field: 'budget' },
  ];

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
        className={`fixed left-1/2 top-1/2 z-[113] flex max-h-[88vh] w-[min(940px,calc(100vw-32px))] flex-col overflow-auto rounded-[28px] bg-ink text-inverted shadow-[0_50px_140px_rgba(0,0,0,0.55)] ${
          isOpen ? '' : 'pointer-events-none'
        }`}
      >
        {isSuccess && <ComposeSent onClose={close} />}

        <div className="flex items-center gap-[10px] border-b border-white/10 bg-white/5 px-[20px] py-[14px]">
          <span className="flex gap-[6px]" aria-hidden>
            <i className="size-[10px] rounded-full bg-accent" />
            <i className="size-[10px] rounded-full bg-white/20" />
            <i className="size-[10px] rounded-full bg-white/20" />
          </span>
          <span className="text-[13px] text-inverted/55">
            Новое письмо — само напишется, вы только выбирайте
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Свернуть письмо"
            className="ml-auto grid size-[30px] place-items-center rounded-full bg-white/10 text-inverted/80 transition hover:bg-white/20 hover:text-inverted"
          >
            —
          </button>
        </div>

        <div
          role="group"
          aria-label="Тип запроса"
          className="flex flex-wrap items-center gap-[8px] px-[20px] pt-[18px]"
        >
          <span className="text-[13px] text-inverted/45">Про что письмо</span>
          {typeChips.map((c) => (
            <button
              key={c.type}
              type="button"
              onClick={() => setField('type', c.type)}
              aria-pressed={state.type === c.type}
              className={`rounded-full px-[14px] py-[7px] text-[14px] transition ${
                state.type === c.type
                  ? 'bg-accent text-inverted'
                  : 'bg-white/8 text-inverted/80 hover:bg-white/15'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-0 md:grid-cols-[1.25fr_.75fr]">
          <div className="border-b border-white/10 p-[26px_30px] md:border-b-0 md:border-r">
            <div className="mb-[14px] flex flex-wrap gap-x-[18px] gap-y-[4px] text-[12.5px] text-inverted/45">
              <span>
                От: <b className="font-medium text-inverted/80">вы</b>
              </span>
              <span>
                Кому: <b className="font-medium text-inverted/80">hello@tachos.ru</b>
              </span>
              <span>
                Тема: <b className="font-medium text-inverted/80">{subject}</b>
              </span>
            </div>
            <textarea
              ref={letterRef}
              spellCheck={false}
              aria-label="Текст письма (можно редактировать)"
              onChange={() => {
                edited.current = true;
              }}
              className="h-[260px] w-full resize-none rounded-[14px] border border-white/10 bg-black/20 p-[16px] font-sans text-[15px] leading-[1.5] text-inverted/90 outline-none focus:border-white/25"
            />
          </div>

          <div className="flex flex-col gap-[18px] p-[26px]">
            {groups.map(({ key, field }) => (
              <div key={key} role="group" aria-labelledby={`q-${key}`}>
                <div id={`q-${key}`} className="mb-[8px] text-[13px] text-inverted/55">
                  {composeQuestions[key].label}
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {composeQuestions[key].options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setField(field, o.v)}
                      aria-pressed={state[field] === o.v}
                      className={`rounded-full px-[13px] py-[7px] text-[13.5px] transition ${
                        state[field] === o.v
                          ? 'bg-accent text-inverted'
                          : 'bg-white/8 text-inverted/80 hover:bg-white/15'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-[2px] flex flex-col gap-[12px]">
              <div>
                <input
                  ref={contactRef}
                  data-autofocus
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
                  className={`w-full rounded-[12px] border bg-black/20 px-[14px] py-[11px] text-[14px] text-inverted outline-none transition placeholder:text-inverted/40 focus:border-white/25 ${
                    contactError ? 'border-accent' : 'border-white/10'
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

              <div>
                <label className="flex cursor-pointer items-start gap-[8px] text-[12px] leading-[1.4] text-inverted/55">
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
                  <span>
                    Даю согласие на обработку персональных данных. Один ответ по
                    делу — без рассылок.
                  </span>
                </label>
                {agreeError && (
                  <p id={agreeErrId} role="alert" className="mt-[6px] text-[12px] text-accent">
                    Нужно согласие
                  </p>
                )}
              </div>

              {isError && (
                <div
                  role="alert"
                  className="rounded-[10px] border border-accent/30 bg-accent/10 px-[14px] py-[10px] text-[13px] text-accent"
                >
                  Не удалось отправить — попробуйте ещё раз или скопируйте письмо.
                </div>
              )}

              <div className="flex flex-wrap gap-[8px]">
                <button
                  type="button"
                  onClick={send}
                  disabled={isSending}
                  className="flex items-center gap-[8px] rounded-full bg-accent px-[20px] py-[11px] text-[14px] text-inverted transition hover:brightness-110 disabled:opacity-60"
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
                    'Отправить'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copy(letterRef.current?.value ?? body, 'Письмо в буфере — вставьте в чат')
                  }
                  className="rounded-full bg-white/8 px-[20px] py-[11px] text-[14px] text-inverted/85 transition hover:bg-white/15"
                >
                  В Telegram
                </button>
                <button
                  type="button"
                  onClick={() => copy(letterRef.current?.value ?? body, 'Письмо скопировано')}
                  className="rounded-full bg-white/8 px-[20px] py-[11px] text-[14px] text-inverted/85 transition hover:bg-white/15"
                >
                  Скопировать
                </button>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div
            aria-live="polite"
            className="pointer-events-none sticky bottom-[14px] mx-auto mb-[14px] w-fit rounded-full bg-black/80 px-[16px] py-[8px] text-[13px] text-inverted"
          >
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

function ComposeSent({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] rounded-[28px] bg-ink p-[40px] text-center">
      <div className="grid size-[56px] place-items-center rounded-full bg-accent text-[22px] font-semibold text-inverted">
        А
      </div>
      <h3 className="text-[24px] font-semibold">Письмо у Анны</h3>
      <p className="max-w-[420px] text-[15px] leading-[1.4] text-inverted/60">
        Ответим в течение рабочего дня. Один ответ по делу — без рассылок и спама.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-[16px] rounded-full bg-white/10 px-[22px] py-[11px] text-[14px] text-inverted transition hover:bg-white/15"
      >
        Вернуться на сайт
      </button>
    </div>
  );
}
