"use client";

import { useSyncExternalStore } from "react";
import { getAllCompletedLessonSlugs, getLessonProgressStore, handleExternalStorageChange } from "./localStorageStore";
import { EMPTY_LESSON_PROGRESS } from "./types";

const EMPTY_SLUG_SET: ReadonlySet<string> = new Set();

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
  // this closes: completing a lesson in tab A previously left tab B's
  // `useLessonProgress`/`useCompletedLessonSlugs` snapshots stale until a
  // manual reload, since `notify()` was only ever called from same-tab
  // writes. Registered once for the lifetime of the page, so no
  // corresponding `removeEventListener`/cleanup is needed.
  window.addEventListener("storage", (event) => {
    if (handleExternalStorageChange(event)) {
      notify();
    }
  });
}

/**
 * Reads one lesson's persisted completion state via `useSyncExternalStore`,
 * mirroring `useProblemProgress` — the server and pre-hydration client both
 * see `EMPTY_LESSON_PROGRESS`, so there's no hydration mismatch.
 */
export function useLessonProgress(slug: string) {
  const progress = useSyncExternalStore(
    subscribe,
    () => getLessonProgressStore().getLessonProgress(slug),
    () => EMPTY_LESSON_PROGRESS
  );

  function setCompleted(completed: boolean) {
    getLessonProgressStore().setCompleted(slug, completed);
    notify();
  }

  return { progress, setCompleted } as const;
}

/** Subscribes to every completed-lesson-slug change — for aggregate per-course badges. */
export function useCompletedLessonSlugs(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getAllCompletedLessonSlugs, () => EMPTY_SLUG_SET);
}
