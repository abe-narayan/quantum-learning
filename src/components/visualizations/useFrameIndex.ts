"use client";

import { useState } from "react";

/**
 * Shared "scrub through a precomputed array via an index" state, used by
 * every `*Explorer` component that lets a reader step through precomputed
 * frames (a slider, e.g. `ParametricCurve`) or presets (a toggle button
 * row, e.g. `MatrixGridExplorer`) — both are the same "current index into a
 * fixed array" concern. `index` is clamped to the array's bounds so a
 * shorter `items` prop (or an out-of-range persisted index) never reads
 * past the end.
 */
export function useFrameIndex<T>(items: readonly T[]) {
  const [index, setIndex] = useState(0);
  const frame = items[Math.min(index, items.length - 1)];
  return { index, setIndex, frame } as const;
}
