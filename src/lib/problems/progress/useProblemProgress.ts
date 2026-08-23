"use client";

import { useSyncExternalStore } from "react";
import { getProgressStore } from "./localStorageStore";
import { EMPTY_PROGRESS, type ProblemAttempt } from "./types";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
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
