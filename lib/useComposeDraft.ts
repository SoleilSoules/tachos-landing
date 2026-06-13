'use client';

import { useEffect, useRef } from 'react';
import { type ComposeState, COMPOSE_DRAFT_KEY } from './compose';

// Only the task description survives between sessions — never the contact field
// or consent. Those are personal data (152-ФЗ); we don't persist them locally.
type DraftPayload = Pick<ComposeState, 'type' | 'have' | 'when' | 'budget' | 'freeText'>;

export function loadDraft(): DraftPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COMPOSE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;
    if (typeof parsed.type !== 'string') return null;
    return parsed as DraftPayload;
  } catch {
    return null;
  }
}

export function saveDraft(state: ComposeState): void {
  if (typeof window === 'undefined') return;
  const payload: DraftPayload = {
    type: state.type,
    have: state.have,
    when: state.when,
    budget: state.budget,
    freeText: state.freeText,
  };
  try {
    localStorage.setItem(COMPOSE_DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // storage unavailable / quota — drafts are best-effort
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(COMPOSE_DRAFT_KEY);
  } catch {
    /* noop */
  }
}

// Debounced auto-save of the draft once the user has touched the form.
export function useAutoSaveDraft(state: ComposeState, touched: boolean) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (!touched) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => saveDraft(state), 600);
    return () => clearTimeout(timer.current);
  }, [state, touched]);
}
