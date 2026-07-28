'use client';

import { useSyncExternalStore } from 'react';

// A media query is an external store React doesn't own, so useSyncExternalStore
// is the right tool — not setState in an effect, which costs a second render on
// every mount. The server snapshot is false: SSR has no viewport, and every
// caller treats false as "plain desktop, animate normally", which is also what a
// no-JS client gets.

type Store = {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

// SSR has no matchMedia. The stand-in also keeps the hook's callbacks stable on
// the server, which useSyncExternalStore requires.
const SERVER_STORE: Store = { subscribe: () => () => {}, getSnapshot: () => false };

// One store per query string, built on first browser read and shared by every
// caller — both callbacks must keep their identity across renders, or React
// tears the listener down and re-attaches it on every pass.
const stores = new Map<string, Store>();

function store(query: string): Store {
  if (typeof window === 'undefined') return SERVER_STORE;
  let s = stores.get(query);
  if (!s) {
    const mql = window.matchMedia(query);
    s = {
      subscribe: (onChange) => {
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
      },
      getSnapshot: () => mql.matches,
    };
    stores.set(query, s);
  }
  return s;
}

export function useMediaQuery(query: string): boolean {
  const { subscribe, getSnapshot } = store(query);
  return useSyncExternalStore(subscribe, getSnapshot, SERVER_STORE.getSnapshot);
}

// Named shorthands for the two queries the site branches on everywhere.
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useTouchDevice = () => useMediaQuery('(hover: none), (pointer: coarse)');
