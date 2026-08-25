"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Read through useSyncExternalStore (matching the convention in
// src/components/layout/ThemeToggle.tsx and src/lib/content/progress/useLessonProgress.ts)
// instead of a useState lazy initializer: the initializer form computes
// `false` on the server and the real OS preference on the client, which is
// a genuine hydration mismatch class for anyone with reduced motion set.
// getServerSnapshot fixes the pre-hydration value at `false` so server and
// client agree on the first render; the real preference then applies on
// the client's very first paint via getSnapshot, no setState-in-effect needed.
function subscribe(listener: () => void) {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", listener);
  return () => mediaQueryList.removeEventListener("change", listener);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
