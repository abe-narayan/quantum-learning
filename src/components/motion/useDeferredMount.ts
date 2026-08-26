"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ============================================================
 * Deferred mount gate
 * ============================================================
 * Delays mounting an expensive child (concretely: the two homepage hero
 * simulators, whose `next/dynamic(..., { ssr: false })` wrappers fetch
 * their chunk the instant React tries to render them) until one of three
 * signals fires, whichever comes first:
 *
 * 1. **Idle, after paint.** `requestIdleCallback` (Safari fallback:
 *    `setTimeout`), capped by `idleTimeoutMs` so it fires within a bounded
 *    time even on a busy main thread — never "eventually," always "soon."
 * 2. **Near the viewport.** An `IntersectionObserver` with `rootMargin`, so
 *    a hero mounted below the fold (e.g. the Bloch sphere hero reused
 *    lower on the homepage) never fetches its chunk until a reader is
 *    actually about to scroll to it.
 * 3. **Interaction.** `pointerdown`/`touchstart`/`focusin` on the gated
 *    element fire immediately — a reader who is already trying to touch
 *    the placeholder should never be made to wait on an idle timer.
 *
 * This exists because `ssr: false` only defers *server* rendering — the
 * `import()` still fires the moment the lazy component is actually
 * rendered on the client, regardless of whether it's on- or off-screen.
 * See docs/PERF_AUDIT.md's homepage findings for the measured effect of
 * gating this on the two homepage hero widgets specifically.
 *
 * Deliberately a per-instance `IntersectionObserver`, unlike `Reveal`'s
 * shared one: this hook has at most one or two live instances on any page
 * (the two hero simulators), nowhere near the "dozens of revealed
 * elements" case that makes sharing worth the bookkeeping there.
 */

type UseDeferredMountOptions = {
  /** Upper bound, in ms, on the idle-after-paint wait. */
  idleTimeoutMs?: number;
  /** How far before entering the viewport the visibility signal fires. */
  rootMargin?: string;
  /**
   * Whether to gate on visibility at all. Default `true`. Set `false` for
   * an element that is already in the viewport at mount (an above-the-fold
   * hero): `IntersectionObserver` reports an already-visible element as
   * intersecting on its very first callback, which would fire immediately
   * and defeat the point of the idle-after-paint wait below.
   */
  observeVisibility?: boolean;
};

type IdleCallbackHandle = number;
type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => IdleCallbackHandle;
  cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
};

export function useDeferredMount<T extends HTMLElement>({
  idleTimeoutMs = 1200,
  rootMargin = "200px",
  observeVisibility = true,
}: UseDeferredMountOptions = {}) {
  const ref = useRef<T>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const element = ref.current;
    let settled = false;

    function trigger() {
      if (settled) return;
      settled = true;
      setReady(true);
    }

    const win = window as WindowWithIdleCallback;

    let observer: IntersectionObserver | undefined;
    if (element && observeVisibility && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) trigger();
        },
        { rootMargin }
      );
      observer.observe(element);
    }

    const idleId =
      typeof win.requestIdleCallback === "function"
        ? win.requestIdleCallback(trigger, { timeout: idleTimeoutMs })
        : window.setTimeout(trigger, idleTimeoutMs);
    const cancelIdle = () => {
      if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };

    const interactionEvents = ["pointerdown", "touchstart", "focusin"] as const;
    interactionEvents.forEach((event) => element?.addEventListener(event, trigger, { once: true, passive: true }));

    return () => {
      settled = true;
      observer?.disconnect();
      cancelIdle();
      interactionEvents.forEach((event) => element?.removeEventListener(event, trigger));
    };
  }, [ready, idleTimeoutMs, rootMargin, observeVisibility]);

  return { ref, ready };
}
