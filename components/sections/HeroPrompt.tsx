'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hero } from '@/lib/content';
import { guessType, type LetterType } from '@/lib/compose';
import { useCompose } from '@/components/compose/ComposeProvider';

const chipType: Record<string, LetterType> = {
  Сайт: 'site',
  Приложение: 'app',
  Магазин: 'shop',
  Игра: 'game',
};

function WaveIcon() {
  // mingcute voice-fill — five bars, tallest in the centre (40×40)
  return (
    <svg width="40" height="40" viewBox="0 0 41 41" fill="currentColor" aria-hidden>
      <path d="M20.3035 4.23083C20.9345 4.23087 21.5429 4.46593 22.01 4.89019C22.4772 5.31445 22.7695 5.89749 22.8301 6.5256L22.8419 6.7693V33.8462C22.8416 34.4981 22.5905 35.1249 22.1406 35.5967C21.6908 36.0685 21.0766 36.3492 20.4255 36.3805C19.7743 36.4118 19.1361 36.1914 18.643 35.765C18.1499 35.3386 17.8398 34.7388 17.7769 34.0899L17.765 33.8462V6.7693C17.765 6.09605 18.0325 5.45039 18.5085 4.97433C18.9846 4.49828 19.6302 4.23083 20.3035 4.23083ZM13.5343 9.30776C14.2075 9.30776 14.8532 9.5752 15.3292 10.0513C15.8053 10.5273 16.0727 11.173 16.0727 11.8462V28.7693C16.0727 29.4425 15.8053 30.0882 15.3292 30.5642C14.8532 31.0403 14.2075 31.3077 13.5343 31.3077C12.861 31.3077 12.2153 31.0403 11.7393 30.5642C11.2632 30.0882 10.9958 29.4425 10.9958 28.7693V11.8462C10.9958 11.173 11.2632 10.5273 11.7393 10.0513C12.2153 9.5752 12.861 9.30776 13.5343 9.30776ZM27.0727 9.30776C27.746 9.30776 28.3916 9.5752 28.8677 10.0513C29.3437 10.5273 29.6112 11.173 29.6112 11.8462V28.7693C29.6112 29.4425 29.3437 30.0882 28.8677 30.5642C28.3916 31.0403 27.746 31.3077 27.0727 31.3077C26.3995 31.3077 25.7538 31.0403 25.2777 30.5642C24.8017 30.0882 24.5342 29.4425 24.5342 28.7693V11.8462C24.5342 11.173 24.8017 10.5273 25.2777 10.0513C25.7538 9.5752 26.3995 9.30776 27.0727 9.30776ZM6.76502 14.3847C7.43826 14.3847 8.08393 14.6521 8.55999 15.1282C9.03604 15.6042 9.30348 16.2499 9.30348 16.9231V23.6924C9.30348 24.3656 9.03604 25.0113 8.55999 25.4873C8.08393 25.9634 7.43826 26.2308 6.76502 26.2308C6.09178 26.2308 5.44611 25.9634 4.97006 25.4873C4.49401 25.0113 4.22656 24.3656 4.22656 23.6924V16.9231C4.22656 16.2499 4.49401 15.6042 4.97006 15.1282C5.44611 14.6521 6.09178 14.3847 6.76502 14.3847ZM33.8419 14.3847C34.473 14.3847 35.0814 14.6198 35.5485 15.044C36.0156 15.4683 36.308 16.0513 36.3686 16.6794L36.3804 16.9231V23.6924C36.3801 24.3443 36.129 24.9711 35.6791 25.4429C35.2292 25.9147 34.6151 26.1953 33.9639 26.2266C33.3128 26.258 32.6745 26.0376 32.1814 25.6111C31.6884 25.1847 31.3782 24.5849 31.3153 23.9361L31.3035 23.6924V16.9231C31.3035 16.2499 31.5709 15.6042 32.047 15.1282C32.523 14.6521 33.1687 14.3847 33.8419 14.3847Z" />
    </svg>
  );
}

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

// Minimal shape of the Web Speech API we use (no DOM lib types for it in TS).
type SpeechResultLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: SpeechResultLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
};

export function HeroPrompt() {
  const { open } = useCompose();
  const [value, setValue] = useState('');
  const hint = guessType(value);

  const submit = () => open({ type: guessType(value) ?? 'idk', freeText: value.trim() });

  // Voice input (#27, draft): dictate into the field via Web Speech API; if the
  // browser has no SpeechRecognition, fall back to just opening the letter.
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      submit();
      return;
    }
    const rec = new SR();
    rec.lang = 'ru-RU';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      setValue(
        Array.from(e.results)
          .map((r) => r[0]?.transcript ?? '')
          .join(''),
      );
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

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
        data-hint="Нажмите — соберём письмо"
        data-hint-sub="или выберите чип ниже"
        className="relative mt-[32px] flex h-[72px] w-full max-w-[554px] cursor-pointer items-center gap-[12px] overflow-hidden rounded-[18px] bg-white pl-[20px] shadow-input sm:mt-[52px] sm:h-[88px] sm:gap-[24px] sm:pl-[24px]"
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
          className="pointer-events-none absolute top-1/2 h-[26px] w-[2.5px] -translate-y-1/2 rounded-full bg-accent-hot [animation:caret-blink_1.1s_step-end_infinite] sm:h-[34px]"
          style={{ left: caretLeft }}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSelect={syncCaret}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder={hero.inputPlaceholder}
          aria-label="Опишите задачу"
          className="min-w-0 flex-1 bg-transparent text-[18px] text-black caret-transparent outline-none placeholder:text-black/40"
        />
        {/* Empty field → voice affordance; once there's text the button flips to
            an Enter glyph and goes accent — both submit (open the letter). */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (value.trim()) submit();
            else toggleVoice();
          }}
          aria-label={
            value.trim() ? 'Отправить — Enter' : listening ? 'Остановить запись' : 'Голосовой ввод'
          }
          className={`grid h-[72px] w-[80px] shrink-0 place-items-center rounded-[18px] shadow-[-14px_0_28px_rgba(0,0,0,0.06)] transition sm:h-[88px] sm:w-[107px] ${
            value.trim() || listening
              ? 'bg-accent text-white'
              : 'bg-white text-black hover:bg-accent hover:text-white'
          } ${listening ? 'animate-pulse' : ''}`}
        >
          {value.trim() ? <EnterIcon /> : <WaveIcon />}
        </button>
      </div>

      <div className="nums mt-[16px] flex w-full flex-wrap items-center justify-center gap-[8px] sm:gap-[10px]">
        <span className="px-[2px] text-[13px] text-inverted/60 sm:text-[15px]">
          {hero.needLabel}
        </span>
        {hero.chips.map((chip) => {
          const active = hint != null && chipType[chip] === hint;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => open({ type: chipType[chip] ?? 'idk', freeText: value.trim() })}
              className={`${chip === 'Приложение' ? 'hidden sm:inline-flex' : 'inline-flex'} h-[31px] items-center rounded-chip px-[12px] text-[13px] font-semibold leading-none transition sm:px-[16px] sm:text-[15px] ${
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
    </>
  );
}
