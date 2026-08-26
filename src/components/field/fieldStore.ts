"use client";

import { useSyncExternalStore } from "react";
import type { Pillar } from "@/lib/content/types";
import type { FieldRegime } from "@/lib/design/pillars";

/**
 * Which background environment the page currently wants, held in a
 * module-level store rather than React context.
 *
 * Context would mean a client Provider wrapping the whole app in
 * src/app/layout.tsx, which would opt every page's tree into being a client
 * boundary child — for a site that is otherwise almost entirely server
 * components and static HTML, that is a real cost for a decorative feature.
 * A module store keeps the client surface to exactly two leaf components:
 * `<QuantumField>` (subscribes) and `<FieldRegimeSetter>` (publishes).
 *
 * Store plumbing follows the same shape as ThemeToggle.tsx and
 * useLessonProgress.ts: a listener set, notified on write, read through
 * `useSyncExternalStore` with a server snapshot so the pre-hydration render
 * matches the server.
 */

export type FieldState = {
  regime: FieldRegime;
  /** Drives the color ramp the field draws with. `null` = site default. */
  pillar: Pillar | null;
};

/**
 * What the field shows before any page declares otherwise: `atlas`, the
 * calm, pillar-less reference environment (see regimes.ts) — never
 * `journey`. `journey` is the homepage's own narrative, six pillars
 * crossfading in curriculum order as you scroll; it means something only on
 * a page whose scroll position tracks a descent through the curriculum. A
 * default has no such position, so a default that resolved to `journey`
 * would play that crossfade behind *any* page that forgot to declare a
 * regime — which is exactly what happened before this was `atlas` (see
 * docs/UX_REVIEW.md P1-2): six routes with no `<PillarScope>` at all
 * inherited the homepage's crossfade purely by omission. Every route should
 * now declare its regime explicitly via `<PillarScope>` (bare for the
 * neutral case, `pillar={...}` for a pillar page, or `regime="journey"` for
 * the homepage specifically); this default exists only as the honest
 * fallback for the moment before that declaration lands, or for a route that
 * genuinely renders none. */
const DEFAULT_STATE: FieldState = { regime: "atlas", pillar: null };

let state: FieldState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function setFieldState(next: FieldState) {
  if (state.regime === next.regime && state.pillar === next.pillar) return;
  state = next;
  notify();
}

export function resetFieldState() {
  setFieldState(DEFAULT_STATE);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): FieldState {
  return state;
}

function getServerSnapshot(): FieldState {
  return DEFAULT_STATE;
}

export function useFieldState(): FieldState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
