"use client";

import { useRef, useSyncExternalStore } from "react";
import { getProgressStore, handleExternalStorageChange } from "./localStorageStore";
import { EMPTY_PROGRESS, type ProblemAttempt, type ProblemProgress } from "./types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Exported (beyond just being passed to `useSyncExternalStore` below) so tests can subscribe a spy directly. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  // The native `storage` event only fires in *other* tabs/windows on this
  // origin — never the one that made the write — which is exactly the gap
  // this closes: recording an attempt/hint/solution in tab A previously
  // left tab B's `useProblemProgress`/`useProblemsProgress` snapshots stale
  // until a manual reload, since `notify()` was only ever called from
  // same-tab writes. Registered once for the lifetime of the page, so no
  // corresponding `removeEventListener`/cleanup is needed.
  window.addEventListener("storage", (event) => {
    if (handleExternalStorageChange(event)) {
      notify();
    }
  });
}

/**
 * Reads one problem's persisted progress via `useSyncExternalStore` —
 * React's own primitive for an external store that may not exist during
 * SSR, rather than a manual "read in a useEffect, then setState" dance.
 * The server (and the pre-hydration client render) both see
 * `EMPTY_PROGRESS`; the real, localStorage-backed value appears only after
 * hydration completes, with no risk of a hydration mismatch and no
 * cascading-render lint warning.
 */
export function useProblemProgress(slug: string) {
  const progress = useSyncExternalStore(
    subscribe,
    () => getProgressStore().getProblemProgress(slug),
    () => EMPTY_PROGRESS
  );

  function recordAttempt(attempt: ProblemAttempt) {
    getProgressStore().recordAttempt(slug, attempt);
    notify();
  }

  function revealHint(hintsRevealed: number) {
    getProgressStore().revealHint(slug, hintsRevealed);
    notify();
  }

  function revealSolution() {
    getProgressStore().revealSolution(slug);
    notify();
  }

  return { progress, recordAttempt, revealHint, revealSolution } as const;
}

/**
 * Read-only view of several problems' progress at once — for a small
 * aggregate summary (e.g. "3 of 5 solved" on a checkpoint widget), not a
 * new persistence layer. `getProblemProgress` returns a cached, stable
 * object reference per slug that only changes on an actual write (see
 * `localStorageStore.ts`), so this memoizes the combined array against
 * those same references and only returns a new array when one of them
 * actually changed — otherwise `useSyncExternalStore` would see a fresh
 * array on every call and re-render forever, the exact bug documented on
 * `useProblemProgress` above.
 */
export function useProblemsProgress(slugs: string[]): ProblemProgress[] {
  const cacheRef = useRef<{ refs: ProblemProgress[]; result: ProblemProgress[] } | null>(null);
  // getServerSnapshot needs the same referential stability as getSnapshot
  // above — `slugs.map(() => EMPTY_PROGRESS)` would otherwise allocate a new
  // array on every call (every SSR pass, and again on client hydration),
  // which is exactly the "getServerSnapshot should be cached" infinite-loop
  // hazard the comment above already calls out, just unguarded on this
  // branch. Cached here per slugs.length, since the contents are always
  // EMPTY_PROGRESS regardless of which slugs they are.
  const emptyRef = useRef<ProblemProgress[] | null>(null);

  return useSyncExternalStore(
    subscribe,
    () => {
      const store = getProgressStore();
      const refs = slugs.map((slug) => store.getProblemProgress(slug));
      const prev = cacheRef.current;
      if (prev && prev.refs.length === refs.length && refs.every((ref, i) => ref === prev.refs[i])) {
        return prev.result;
      }
      cacheRef.current = { refs, result: refs };
      return refs;
    },
    () => {
      if (!emptyRef.current || emptyRef.current.length !== slugs.length) {
        emptyRef.current = slugs.map(() => EMPTY_PROGRESS);
      }
      return emptyRef.current;
    }
  );
}
