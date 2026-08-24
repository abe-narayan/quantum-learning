"use client";

import { useSyncExternalStore } from "react";
import { getAllCompletedLessonSlugs, getLessonProgressStore } from "./localStorageStore";
import { EMPTY_LESSON_PROGRESS } from "./types";

const EMPTY_SLUG_SET: ReadonlySet<string> = new Set();

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
