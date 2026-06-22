'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '@/lib/useFocusTrap';

// Feedback widget — a self-contained "report a bug / share an idea" modal in the
// Tachos design language (the doki feedback form, reimplemented). The whole front
// end is self-sufficient; on submit it POSTs JSON to a tiny serverless function
// (NEXT_PUBLIC_FEEDBACK_ENDPOINT) that creates a GitHub Issue — the token never
// touches the browser. With no endpoint configured it runs in a harmless demo
// mode (validates + shows success) so the static site never breaks.
//
// Open it via the ⌘]/Ctrl] hotkey or by dispatching `window` event
// 'tachos:open-feedback' from any trigger (e.g. a footer link).

const ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? '';

// Screenshot limits — identical to doki's client guard.
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE = /^image\/(png|jpe?g|gif|webp)$/;
const MAX_SHOTS = 8;

type Kind = 'bug' | 'idea';
type Shot = { id: number; name: string; dataUrl: string };
type Status = 'idle' | 'sending' | 'success' | 'error';

const COPY = {
  bug: {
    bodyLabel: 'Что не так',
    bodyPh: 'Опишите, что вы увидели и что ожидали. ⌘V — вставить скриншот.',
  },
  idea: {
    bodyLabel: 'Что предложить',
    bodyPh: 'Опишите идею: что и зачем стоит улучшить. ⌘V — вставить скриншот.',
  },
} as const;

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>('bug');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [email, setEmail] = useState('');
  const [shots, setShots] = useState<Shot[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [bodyError, setBodyError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const fileRef = useRef<HTMLInputElement>(null);
  const shotId = useRef(0);
  const shotsCount = useRef(0); // current + in-flight reads, so the cap holds across async loads
  const honeypot = useRef<HTMLInputElement>(null);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Reset the form a beat after closing (so the exit animation isn't janky), but
  // never wipe an error the user hasn't seen.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setTitle('');
      setBody('');
      setEmail('');
      setShots([]);
      shotsCount.current = 0;
      setKind('bug');
      setBodyError(false);
      setStatus((s) => (s === 'error' ? s : 'idle'));
    }, 320);
    return () => clearTimeout(t);
  }, [open]);

  // Open from anywhere: ⌘]/Ctrl] hotkey, Esc to close, a custom window event, and
  // a click on any `[data-feedback]` trigger (delegation — works for server-rendered
  // buttons too, mirroring the site's existing `data-compose` pattern).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ']') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-feedback]')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    window.addEventListener('tachos:open-feedback', onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      window.removeEventListener('tachos:open-feedback', onOpen);
    };
  }, [open]);

  // Lock page scroll while open — same mechanism the letter modal uses: stop Lenis
  // on desktop, fall back to body.overflow on touch / reduced-motion.
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) {
      if (lenis) lenis.stop();
      else document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      else document.body.style.overflow = '';
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
    };
  }, [open]);

  // Validate + read image files into data-URLs, skipping anything that breaks the
  // type/size/count rules (with a toast) — same gating as doki's ingestFiles.
  // No side effects inside a setState updater (StrictMode would double-fire them),
  // so the cap is tracked on a ref that counts current + in-flight reads.
  const ingestFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      let room = MAX_SHOTS - shotsCount.current;
      for (const file of list) {
        if (room <= 0) {
          flash(`Можно не больше ${MAX_SHOTS} скриншотов`);
          break;
        }
        if (!ALLOWED_IMAGE.test(file.type)) {
          flash('Только png, jpeg, gif или webp');
          continue;
        }
        if (file.size > MAX_ATTACHMENT_BYTES) {
          flash(`«${file.name}» больше 5 МБ`);
          continue;
        }
        room -= 1;
        shotsCount.current += 1;
        const id = (shotId.current += 1);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const dataUrl = reader.result;
            setShots((cur) => [...cur, { id, name: file.name, dataUrl }]);
          } else {
            shotsCount.current -= 1; // unreadable → free the slot back up
          }
        };
        reader.onerror = () => {
          shotsCount.current -= 1;
        };
        reader.readAsDataURL(file);
      }
    },
    [flash],
  );

  const removeShot = (id: number) => {
    setShots((cur) => cur.filter((s) => s.id !== id));
    shotsCount.current = Math.max(0, shotsCount.current - 1);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.items)
      .filter((it) => it.kind === 'file')
      .map((it) => it.getAsFile())
      .filter((f): f is File => f !== null);
    if (files.length) {
      e.preventDefault();
      ingestFiles(files);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) ingestFiles(e.dataTransfer.files);
  };

  const submit = async () => {
    if (status === 'sending') return;
    if (!body.trim()) {
      setBodyError(true);
      return;
    }
    // Honeypot: a real user never fills the hidden field — pretend success to bots.
    if (honeypot.current?.value) {
      setStatus('success');
      return;
    }
    setStatus('sending');
    const payload = {
      type: kind,
      title: title.trim(),
      body: body.trim(),
      email: email.trim(),
      attachments: shots.map((s) => s.dataUrl),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
    };
    // Demo mode: no endpoint wired yet → don't fail the static site.
    if (!ENDPOINT) {
      setTimeout(() => setStatus('success'), 600);
      return;
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const c = COPY[kind];

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[112] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Обратная связь"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        data-lenis-prevent
        style={{
          transformOrigin: 'center',
          transform: open
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, calc(50vh - 40px)) scale(0.06)',
          opacity: open ? 1 : 0,
          transition: open
            ? 'transform .44s cubic-bezier(.2,.9,.25,1.12), opacity .26s ease-out'
            : 'transform .5s cubic-bezier(.6,0,.85,.35), opacity .46s ease-in .06s',
        }}
        className={`fixed left-1/2 top-1/2 z-[113] flex max-h-[90vh] w-[min(620px,calc(100vw-32px))] flex-col overflow-auto rounded-[28px] bg-ink text-inverted shadow-[0_50px_140px_rgba(0,0,0,0.55)] ${
          open ? '' : 'pointer-events-none'
        }`}
      >
        {/* Window-chrome header — mirrors the letter modal */}
        <div className="flex items-center gap-[10px] border-b border-white/10 bg-white/5 px-[20px] py-[14px]">
          <span className="flex gap-[6px]" aria-hidden>
            <i className="size-[10px] rounded-full bg-accent" />
            <i className="size-[10px] rounded-full bg-white/20" />
            <i className="size-[10px] rounded-full bg-white/20" />
          </span>
          <span className="text-[13px] text-inverted/55">Обратная связь</span>
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="ml-auto grid size-[30px] place-items-center rounded-full bg-white/10 text-inverted/80 transition hover:bg-white/20 hover:text-inverted"
          >
            ✕
          </button>
        </div>

        <div className="p-[28px_32px]">
          {status === 'success' ? (
            <FeedbackSent kind={kind} onClose={close} />
          ) : (
            <div className="flex flex-col gap-[20px]">
              {/* bug / idea toggle */}
              <div className="flex gap-[8px]">
                {(['bug', 'idea'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`h-[34px] rounded-[11px] px-[16px] text-[14px] font-semibold transition ${
                      kind === k
                        ? 'bg-accent text-inverted'
                        : 'bg-white/8 hover:bg-white/12 text-inverted/70'
                    }`}
                  >
                    {k === 'bug' ? 'Баг' : 'Идея'}
                  </button>
                ))}
              </div>

              {/* title */}
              <Field label="Коротко">
                <input
                  data-autofocus
                  type="text"
                  value={title}
                  maxLength={200}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="В двух словах о сути"
                  autoComplete="off"
                  className="h-[50px] w-full rounded-[14px] border border-white/10 bg-black/30 px-[16px] text-[15px] text-inverted outline-none transition placeholder:text-inverted/40 focus:border-white/25"
                />
              </Field>

              {/* body + paste/drop zone */}
              <Field label={c.bodyLabel}>
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  className={`rounded-[14px] border transition ${
                    bodyError
                      ? 'border-accent'
                      : dragging
                        ? 'border-accent/60 bg-accent/5'
                        : 'border-white/10'
                  }`}
                >
                  <textarea
                    value={body}
                    maxLength={4000}
                    onChange={(e) => {
                      setBody(e.target.value);
                      if (e.target.value.trim()) setBodyError(false);
                    }}
                    onPaste={onPaste}
                    placeholder={c.bodyPh}
                    rows={4}
                    className="block w-full resize-y rounded-[14px] bg-black/30 px-[16px] py-[13px] text-[15px] leading-[1.5] text-inverted outline-none placeholder:text-inverted/40"
                  />
                </div>
                {bodyError && (
                  <p role="alert" className="mt-[6px] text-[12px] text-accent">
                    Опишите {kind === 'bug' ? 'проблему' : 'идею'} — без этого не отправить
                  </p>
                )}
              </Field>

              {/* screenshots */}
              <div>
                <div className="flex flex-wrap items-center gap-[12px]">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="border-white/12 h-[38px] rounded-[12px] border bg-white/5 px-[16px] text-[13.5px] font-medium text-inverted/85 transition hover:bg-white/10"
                  >
                    + скриншоты
                  </button>
                  <span className="text-[12.5px] text-inverted/45">
                    ⌘V или перетащите — png/jpeg/gif/webp, до 5 МБ
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    multiple
                    hidden
                    onChange={(e) => {
                      if (e.target.files) ingestFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                {shots.length > 0 && (
                  <div className="mt-[12px] flex flex-wrap gap-[10px]">
                    {shots.map((s) => (
                      <div
                        key={s.id}
                        className="border-white/12 group relative size-[64px] overflow-hidden rounded-[10px] border bg-black/40"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.dataUrl} alt={s.name} className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeShot(s.id)}
                          aria-label={`Убрать ${s.name}`}
                          className="absolute right-[3px] top-[3px] grid size-[18px] place-items-center rounded-full bg-black/70 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* email */}
              <Field label="Почта для ответа">
                <input
                  type="email"
                  value={email}
                  maxLength={200}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="если хотите, чтобы ответили"
                  autoComplete="email"
                  className="h-[50px] w-full rounded-[14px] border border-white/10 bg-black/30 px-[16px] text-[15px] text-inverted outline-none transition placeholder:text-inverted/40 focus:border-white/25"
                />
              </Field>

              {/* honeypot — visually hidden, off the tab order */}
              <input
                ref={honeypot}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === 'error' && (
                <div
                  role="alert"
                  className="rounded-[10px] border border-accent/30 bg-accent/10 px-[14px] py-[10px] text-[13px] text-accent"
                >
                  Не удалось отправить — попробуйте ещё раз.
                </div>
              )}

              <div className="flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={close}
                  className="bg-white/8 hover:bg-white/12 rounded-[12px] px-[20px] py-[11px] text-[14px] text-inverted/80 transition"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === 'sending'}
                  className="flex items-center gap-[8px] rounded-[12px] bg-accent px-[24px] py-[11px] text-[15px] font-medium text-inverted shadow-[0_10px_30px_rgba(240,81,56,0.35)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <span
                        aria-hidden
                        className="size-[14px] animate-spin rounded-full border-2 border-inverted/30 border-t-inverted"
                      />
                      Отправляем…
                    </>
                  ) : (
                    'Отправить'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {toast && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute bottom-[16px] left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-[16px] py-[8px] text-[13px] text-inverted"
          >
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-[8px] block text-[13px] font-medium text-inverted/90">{label}</span>
      {children}
    </label>
  );
}

function FeedbackSent({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] py-[34px] text-center">
      <div className="grid size-[56px] place-items-center rounded-full bg-accent text-[24px] text-inverted">
        ✓
      </div>
      <h3 className="text-[22px] font-semibold">Спасибо, получили</h3>
      <p className="max-w-[380px] text-[14px] leading-[1.45] text-inverted/60">
        {kind === 'bug'
          ? 'Разберёмся с проблемой. Если оставили почту — напишем, когда починим.'
          : 'Спасибо за идею — посмотрим и подумаем, как применить.'}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-[14px] rounded-full bg-white/10 px-[22px] py-[11px] text-[14px] text-inverted transition hover:bg-white/15"
      >
        Готово
      </button>
    </div>
  );
}
