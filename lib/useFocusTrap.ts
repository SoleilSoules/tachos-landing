'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input:not([disabled]),select,[tabindex]:not([tabindex="-1"])';

// Traps Tab focus within the container while `active`, autofocuses the element
// marked [data-autofocus] (or the first focusable), and restores focus to the
// trigger on deactivation.
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const ref = useRef<T>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      trigger.current?.focus?.();
      return;
    }
    trigger.current = document.activeElement as HTMLElement;
    const el = ref.current;
    if (!el) return;

    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );

    const target = el.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0];
    const id = setTimeout(() => target?.focus({ preventScroll: true }), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      // WHY: f.length was just checked > 0, so the first and last elements exist.
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return ref;
}
