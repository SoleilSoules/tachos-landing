'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hero } from '@/lib/content';
import { guessType, type LetterType } from '@/lib/compose';
import { useCompose } from '@/components/compose/ComposeProvider';
import { keyBump } from '@/components/compose/LetterBody';
import { AiIcon } from '@/components/AiIcon';

// The doc's seven quick-choice chips fold onto the five letter types.
const chipType: Record<string, LetterType> = {
  'Мобильное приложение': 'app',
  Сайт: 'web',
  Маркетплейс: 'web',
  CRM: 'internal',
  'Интеграцию с другими системами': 'backend',
  Геймификацию: 'other',
  Другое: 'other',
};

function EnterIcon() {
  // return/enter glyph — replaces the voice icon once the field has text,
  // signalling that Enter (or a click) submits the description.
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 10l-4 4 4 4" />
      <path d="M5 14h11a4 4 0 0 0 4-4V6" />
    </svg>
  );
}

// `chips` toggles the «Мне нужен: …» row under the field — hidden in the hero for
// now (Гоша), the component keeps working without it.
export function HeroPrompt({ chips = true }: { chips?: boolean } = {}) {
  const { open } = useCompose();
  const [value, setValue] = useState('');
  const hint = guessType(value);

  // Placeholder differs by viewport: short on mobile (night change), the original
  // longer copy on desktop (pre-night) — restored per Гоша.
  const [placeholder, setPlaceholder] = useState('Опишите задачу');
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const upd = () => setPlaceholder(mq.matches ? hero.inputPlaceholder : 'Опишите задачу');
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  const submit = () => open({ type: guessType(value) ?? 'unset', freeText: value.trim() });

  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [caretLeft, setCaretLeft] = useState(22);

  // One custom rounded caret for BOTH the empty and typing states — the native
  // caret is hidden (caret-transparent) since its shape can't be rounded via CSS.
  // We place ours by measuring the text up to the cursor in a hidden mirror span
  // that shares the input's font, then offsetting by the input's scroll.
  const syncCaret = useCallback(() => {
    const el = inputRef.current;
    const mirror = mirrorRef.current;
    if (!el || !mirror) return;
    const pos = el.selectionStart ?? el.value.length;
    mirror.textContent = el.value.slice(0, pos);
    const base =
      el.offsetLeft + el.clientLeft + parseFloat(getComputedStyle(el).paddingLeft || '0');
    const maxLeft = (el.parentElement?.clientWidth ?? 554) - 127;
    const x = base + mirror.offsetWidth - el.scrollLeft;
    setCaretLeft(Math.max(base, Math.min(x, maxLeft)));
  }, []);

  // Focus on load so you can type immediately (rAF makes this reliable in Safari).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      syncCaret();
    });
    return () => cancelAnimationFrame(id);
  }, [syncCaret]);

  // Re-place the caret whenever the value changes (DOM is updated by then).
  useEffect(() => {
    syncCaret();
  }, [value, syncCaret]);

  return (
    <>
      {/* field 554×88, voice button 107×88, 24px gap — exact Figma sizes.
          The whole pill is clickable — it focuses the input. */}
      <div
        onClick={submit}
        data-hint="hero"
        className="relative flex h-[72px] w-full max-w-[554px] cursor-pointer items-center gap-[12px] overflow-hidden rounded-[28px] bg-white pl-[20px] shadow-input sm:h-[88px] sm:pl-[22px]"
      >
        {/* hidden mirror — measures caret x using the same font as the input */}
        <span
          ref={mirrorRef}
          aria-hidden
          className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-[18px]"
        />
        {/* the single rounded caret — identical bar in empty + typing states */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-[26px] w-[2.5px] -translate-y-1/2 rounded-full bg-accent-hot [animation:caret-blink_1.1s_step-end_infinite]"
          style={{ left: caretLeft }}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            keyBump(e.currentTarget);
            setValue(e.target.value);
          }}
          onSelect={syncCaret}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={placeholder}
          aria-label="Опишите задачу"
          className="min-w-0 flex-1 bg-transparent text-[18px] text-black caret-transparent outline-none placeholder:text-black/40"
        />
        {/* The button always opens the letter (voice dictation was dropped —
            Гоша). It flips to an Enter glyph once there's text; accent is reserved
            for that state and hover, so at rest the field reads calm. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            submit();
          }}
          data-hint="send"
          aria-label="Открыть письмо — Enter"
          // Flat fills only (Гоша): the gradient and the lit inner edge gave it a
          // moulded, sticker-like look — one solid colour sits better on the field.
          className={`relative grid h-[72px] w-[98px] shrink-0 place-items-center overflow-hidden rounded-[28px] transition sm:h-[88px] sm:w-[107px] ${
            value.trim()
              ? 'bg-accent text-white hover:brightness-110'
              : 'bg-surface2 text-black hover:bg-accent hover:text-white'
          }`}
        >
          {/* above the sweep layer */}
          <span className="relative z-10">{value.trim() ? <EnterIcon /> : <AiIcon />}</span>
        </button>
      </div>

      {/* chips sit under the field, flush left with it (hero is left-aligned now) */}
      {chips && (
        <div className="nums mt-[16px] flex w-full flex-wrap items-center justify-start gap-[8px] sm:gap-[10px]">
          <span className="px-[2px] text-[13px] text-inverted/60 sm:text-[15px]">
            {hero.needLabel}
          </span>
          {hero.chips.map((chip, i) => {
            const active = hint != null && chipType[chip] === hint;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => open({ type: chipType[chip] ?? 'unset', freeText: value.trim() })}
                // Seven chips don't fit a phone row — keep the first three there
                // (Гоша's «3 тега на мобилке»), the rest appear from sm up.
                className={`${i > 2 ? 'hidden sm:inline-flex' : 'inline-flex'} h-[31px] items-center rounded-chip px-[12px] text-[13px] font-semibold leading-none transition sm:px-[16px] sm:text-[15px] ${
                  active
                    ? 'bg-accent text-inverted'
                    : 'bg-surface2 text-black hover:bg-accent hover:text-inverted'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
