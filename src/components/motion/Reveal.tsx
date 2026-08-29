"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * ============================================================
 * Scroll reveal
 * ============================================================
 * The app's one entrance animation. Everything that should "arrive" as the
 * reader scrolls — section headings, figures, cards, timeline rows — wraps in
 * this instead of hand-rolling an IntersectionObserver, so the timing, easing
 * and reduced-motion behavior are identical site-wide.
 *
 * Three deliberate properties:
 *
 * 1. **The animation itself is CSS, not JS.** globals.css owns the
 *    `[data-reveal]` / `[data-reveal][data-revealed="true"]` rules; this
 *    component only flips one attribute. No per-element rAF loop, no style
 *    recalculation from JS, no animation library in the bundle.
 *
 * 2. **One shared observer for the whole page.** A page like /learn or a long
 *    lesson can have 60+ revealed elements; 60 IntersectionObserver instances
 *    is measurably worse than one with 60 entries. The observer is created
 *    lazily on first mount and torn down when the last element unmounts.
 *
 * 3. **It degrades to visible, never to hidden.** The content is in the
 *    server-rendered HTML regardless — this only animates its arrival. If JS
 *    never runs, the CSS would leave `opacity: 0`, so
 *    `no-js`-style safety matters: globals.css force-shows `[data-reveal]`
 *    under `prefers-reduced-motion: reduce` and in print, and the effect
 *    below reveals immediately (rather than observing) when the user prefers
 *    reduced motion. The remaining case — JS enabled but React failing to
 *    hydrate — is covered by the `revealAfterMs` safety timer.
 */

type ObserverEntryHandler = (isIntersecting: boolean) => void;

let sharedObserver: IntersectionObserver | null = null;
const handlers = new WeakMap<Element, ObserverEntryHandler>();
let observedCount = 0;

/** `rootMargin` bottom is negative so an element reveals slightly *after* its
 *  top edge enters the viewport, rather than the instant a single pixel does —
 *  a reveal that fires while the element is still a sliver off-screen reads as
 *  "already there," which defeats the point. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.08,
};

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        handlers.get(entry.target)?.(entry.isIntersecting);
      }
    }, OBSERVER_OPTIONS);
  }
  return sharedObserver;
}

function observe(element: Element, handler: ObserverEntryHandler) {
  const observer = getObserver();
  if (!observer) {
    // No IntersectionObserver (very old browser, or a test environment):
    // reveal immediately rather than leaving content invisible.
    handler(true);
    return () => {};
  }
  handlers.set(element, handler);
  observer.observe(element);
  observedCount += 1;

  return () => {
    observer.unobserve(element);
    handlers.delete(element);
    observedCount -= 1;
    if (observedCount === 0) {
      observer.disconnect();
      sharedObserver = null;
    }
  };
}

export type RevealProps = {
  children: ReactNode;
  /** Rendered element. Defaults to a `div`; pass `"section"`, `"li"`, ... to
   *  keep the surrounding markup semantic instead of nesting a wrapper div. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Stagger, in ms. Use small increments (60–120) across siblings — anything
   *  longer stops reading as one group arriving and starts reading as lag. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade, which is the right choice for
   *  anything whose position is load-bearing (a diagram aligned to text). */
  y?: number;
  /** Reveal only once (default) or re-hide when scrolled back out of view.
   *  Re-hiding is almost always wrong for text — it makes re-reading feel
   *  broken — so it is opt-in and used only for decorative layers. */
  repeat?: boolean;
  /**
   * Safety net: reveal unconditionally after this many ms even if the
   * observer never fires. Guards the "element is inside a scroll container
   * the observer doesn't see" and "hydration raced the observer" cases, both
   * of which would otherwise leave content permanently invisible.
   */
  revealAfterMs?: number;
};

export function Reveal({
  children,
  as: Component = "div",
  className,
  style,
  delay = 0,
  y,
  repeat = false,
  revealAfterMs = 2500,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion: reveal on mount, never observe. The CSS also force-shows
    // these elements, but setting the attribute keeps the DOM state honest for
    // anything (tests, future CSS) that reads it.
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      element.setAttribute("data-revealed", "true");
      return;
    }

    const timer = window.setTimeout(() => {
      element.setAttribute("data-revealed", "true");
    }, revealAfterMs);

    // Two hazards live in these next few lines, and both were real.
    //
    // 1. **Temporal dead zone.** `unobserve` used to be a `const` initialised
    //    by `observe(...)` and *called from inside the callback passed to that
    //    same call*. On the normal path that is safe, because the
    //    IntersectionObserver callback is asynchronous and the binding is
    //    long since assigned. But `observe` has a documented synchronous
    //    path — when `IntersectionObserver` is undefined it calls
    //    `handler(true)` immediately so content reveals rather than staying
    //    invisible — and on that path `if (!repeat) unobserve()` ran while
    //    the binding was still uninitialised and threw a ReferenceError out
    //    of the effect. The one branch written to keep content visible in an
    //    old browser or a jsdom test was the one branch that crashed.
    //
    // 2. **Double release.** The callback released the subscription on first
    //    intersection (`if (!repeat) unobserve()`) and the cleanup released
    //    it again on unmount, so `observedCount` in the shared-observer
    //    bookkeeping above went one negative per revealed element. It is
    //    only ever compared against `=== 0`, so once it went negative the
    //    shared IntersectionObserver was never disconnected and never reset —
    //    on a long lesson with 60 revealed elements, every one of them left
    //    the page's observer alive across client navigations.
    //
    // A `release` flag fixes both: the binding is mutable so it can be read
    // before assignment, and whoever gets there first is the only one who
    // releases.
    let unobserve: (() => void) | undefined;
    let released = false;

    function release() {
      if (released) return;
      released = true;
      unobserve?.();
      unobserve = undefined;
    }

    unobserve = observe(element, (isIntersecting) => {
      if (isIntersecting) {
        element.setAttribute("data-revealed", "true");
        window.clearTimeout(timer);
        if (!repeat) release();
      } else if (repeat) {
        element.setAttribute("data-revealed", "false");
      }
    });

    return () => {
      window.clearTimeout(timer);
      release();
    };
  }, [repeat, revealAfterMs]);

  return (
    <Component
      ref={ref}
      data-reveal=""
      data-revealed="false"
      className={className}
      style={{
        ...(delay ? { "--reveal-delay": `${delay}ms` } : null),
        ...(y !== undefined ? { "--reveal-y": `${y}px` } : null),
        ...style,
      } as CSSProperties}
    >
      {children}
    </Component>
  );
}
