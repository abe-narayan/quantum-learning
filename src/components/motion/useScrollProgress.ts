"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ============================================================
 * Scroll plumbing
 * ============================================================
 * One rAF-coalesced scroll listener, shared by every scroll-linked effect in
 * the app (the background field, section-progress readouts, parallax layers).
 *
 * Why a shared subscription rather than a `useEffect` + `addEventListener`
 * per consumer: `scroll` fires at input frequency, which on a 120 Hz trackpad
 * is faster than paint. N independent listeners each doing their own
 * `getBoundingClientRect()` is N forced layouts per event — the classic
 * scroll-jank shape. Here, every consumer is notified once per animation
 * frame with values read exactly once, and nothing reads layout during the
 * event itself.
 */

type Listener = (progress: number, scrollY: number) => void;

const listeners = new Set<Listener>();
let frame = 0;
let attached = false;

function readAndNotify() {
  frame = 0;
  const scrollY = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  // A page shorter than the viewport has nothing to scroll; report 0 rather
  // than dividing by zero (which yields Infinity/NaN and poisons every
  // downstream interpolation).
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
  for (const listener of listeners) listener(progress, scrollY);
}

function schedule() {
  if (frame) return;
  frame = window.requestAnimationFrame(readAndNotify);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  // Fire once so a consumer mounting mid-page (a lesson opened at an anchor,
  // a back-navigation restoring scroll position) starts from the truth.
  schedule();
}

function detach() {
  if (!attached || listeners.size > 0) return;
  attached = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
}

/**
 * Subscribe to document scroll progress without re-rendering React.
 *
 * This is the form every high-frequency consumer should use: the callback
 * runs on the animation frame and writes straight to a canvas or a CSS
 * custom property. Routing 120 updates/second through `useState` would
 * re-render the subtree on every one of them.
 */
export function useScrollSubscription(listener: Listener) {
  // Keep the latest callback in a ref so a consumer can pass an inline arrow
  // without re-subscribing (and thus re-attaching listeners) every render.
  const ref = useRef(listener);

  // Written in an effect rather than during render. The bare
  // `ref.current = listener` form of this pattern is the more familiar one,
  // but it mutates during render, which `react-hooks/refs` rejects and which
  // the React Compiler (enabled repo-wide via `reactCompiler: true` in
  // next.config.ts) is entitled to reorder or re-run around. Declared *before*
  // the subscription effect below so it always runs first: effects fire in
  // declaration order, so the ref holds this render's callback by the time
  // anything can call through it.
  useEffect(() => {
    ref.current = listener;
  });

  useEffect(() => {
    const wrapped: Listener = (progress, scrollY) => ref.current(progress, scrollY);
    listeners.add(wrapped);
    attach();
    return () => {
      listeners.delete(wrapped);
      detach();
    };
  }, []);
}

/**
 * Scroll progress as React state, 0–1, quantised to `steps` buckets.
 *
 * For the low-frequency consumers that genuinely need to re-render (a
 * progress readout, an active-section indicator). Quantising is what makes
 * that affordable: at the default 200 steps a full-page scroll causes at most
 * 200 re-renders instead of thousands, and no one can see the difference in a
 * progress bar.
 */
export function useScrollProgress(steps = 200): number {
  const [progress, setProgress] = useState(0);

  useScrollSubscription((value) => {
    const quantised = Math.round(value * steps) / steps;
    setProgress((previous) => (previous === quantised ? previous : quantised));
  });

  return progress;
}
