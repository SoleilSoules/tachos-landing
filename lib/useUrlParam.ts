'use client';

import { useSyncExternalStore } from 'react';

// Query params drive the design switches that must survive static export
// (?bg= for the hero background, ?products= for the light/dark deck) — there is
// no server to branch on, so the value is read on the client.
//
// useSyncExternalStore — not setState in an effect: the param is an external
// value React doesn't own. The server snapshot is null, so SSR and the first
// client paint agree; React re-reads the real value right after hydration in the
// same commit, with no cascading render.

// A param can't change without a navigation, so there is nothing to subscribe to.
const subscribe = () => () => {};
const getServerSnapshot = (): string | null => null;

// getSnapshot must be referentially stable per param, or React re-subscribes on
// every render — one reader per name, built lazily.
const readers = new Map<string, () => string | null>();

function reader(name: string): () => string | null {
  let r = readers.get(name);
  if (!r) {
    r = () => new URLSearchParams(window.location.search).get(name);
    readers.set(name, r);
  }
  return r;
}

export function useUrlParam(name: string): string | null {
  return useSyncExternalStore(subscribe, reader(name), getServerSnapshot);
}
