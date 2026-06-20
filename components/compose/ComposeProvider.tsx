'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type ComposeState,
  type LetterType,
  initialCompose,
  buildLetter,
} from '@/lib/compose';
import { loadDraft, clearDraft, useAutoSaveDraft } from '@/lib/useComposeDraft';
import { ComposeOverlay } from './ComposeOverlay';
import { FloatingCompose } from './FloatingCompose';
import { CursorCompanion } from './CursorCompanion';

type SendStatus = 'idle' | 'sending' | 'success' | 'error';
type OpenOpts = { type?: LetterType; freeText?: string };

type ComposeCtx = {
  isOpen: boolean;
  sendStatus: SendStatus;
  sent: boolean;
  touched: boolean;
  hasDraft: boolean;
  state: ComposeState;
  open: (opts?: OpenOpts) => void;
  close: () => void;
  setField: <K extends keyof ComposeState>(key: K, value: ComposeState[K]) => void;
  submitLetter: (contact: string) => Promise<void>;
  resetSend: () => void;
};

const Ctx = createContext<ComposeCtx | null>(null);

export function useCompose(): ComposeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompose must be used within ComposeProvider');
  return ctx;
}

// ⚠️ TODO (Vadim) — DEMO STUB, NOT A REAL TRANSPORT. This sends NOTHING: it waits
// 1.1s and resolves (rejecting ~5% only so the error UI is reachable in the demo).
// The static GitHub Pages build has no backend. BEFORE PROD: replace with a real
// POST (a Next route handler /api/contact, or Formspree / an email service), check
// `res.ok` and throw on non-2xx, and DELETE the Math.random() reject. Until then
// the form only *simulates* sending — submitted leads are NOT delivered anywhere.
async function sendMail(_contact: string, _subject: string, _body: string) {
  await new Promise<void>((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.05 ? resolve() : reject(new Error('demo-stub'))), 1100),
  );
}

export function ComposeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [sent, setSent] = useState(false); // stays true after a successful send
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<ComposeState>(initialCompose);

  // Mirror isOpen in a ref so open() can guard without being a dependency.
  const isOpenRef = useRef(false);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Restore a saved draft after mount (in an effect, not the initializer, to
  // avoid SSR/hydration mismatch).
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setState((s) => ({ ...s, ...draft }));
      setTouched(true);
    }
  }, []);

  useAutoSaveDraft(state, touched);

  const hasDraft = touched && !sent;

  const open = useCallback((opts?: OpenOpts) => {
    // Don't overwrite the letter if the form is already open (re-clicking a CTA).
    if (!isOpenRef.current && opts) {
      if (opts.type || opts.freeText !== undefined) {
        setState((s) => ({
          ...s,
          ...(opts.type ? { type: opts.type } : {}),
          ...(opts.freeText !== undefined ? { freeText: opts.freeText } : {}),
        }));
      }
      if (opts.freeText) setTouched(true);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const setField = useCallback(
    <K extends keyof ComposeState>(key: K, value: ComposeState[K]) => {
      setState((s) => ({ ...s, [key]: value }));
      setTouched(true);
    },
    [],
  );

  const submitLetter = useCallback(
    async (contact: string) => {
      setSendStatus('sending');
      try {
        // inside try so a bad draft/state can't throw past the catch and leave
        // the button stuck on "Отправляем…"
        const { subject, body } = buildLetter(state);
        await sendMail(contact, subject, body);
        setSendStatus('success');
        setSent(true);
        clearDraft();
      } catch (err) {
        // Surface the cause — the user sees a generic retry, but the engineer
        // needs the reason (network, non-2xx, serialisation) to debug prod.
        console.error('[compose] submit failed', err);
        setSendStatus('error');
      }
    },
    [state],
  );

  const resetSend = useCallback(() => setSendStatus('idle'), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Server-rendered CTAs carry `data-compose` and open the shared letter.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-compose]');
      if (!el) return;
      e.preventDefault();
      const t = el.getAttribute('data-compose');
      open(t ? { type: t as LetterType } : {});
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Deep link: ?compose[=type] opens the letter on load.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('compose');
    if (p !== null) open(p ? { type: p as LetterType } : {});
  }, [open]);

  return (
    <Ctx.Provider
      value={{
        isOpen,
        sendStatus,
        sent,
        touched,
        hasDraft,
        state,
        open,
        close,
        setField,
        submitLetter,
        resetSend,
      }}
    >
      {children}
      <ComposeOverlay />
      <FloatingCompose />
      <CursorCompanion />
    </Ctx.Provider>
  );
}
