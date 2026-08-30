"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useScrollSubscription } from "@/components/motion/useScrollProgress";
import { useFieldState } from "./fieldStore";
import {
  REGIME_COMPOSITE_CEILING,
  REGIME_DESCRIPTIONS,
  REGIME_RENDERERS,
  type FieldFrame,
} from "./regimes";

/**
 * ============================================================
 * The background environment
 * ============================================================
 * One fixed, full-viewport canvas behind the entire site, painting whichever
 * regime the current page declared (see fieldStore.ts and regimes.ts).
 *
 * Everything about this component is arranged so it can be removed at runtime
 * without the site noticing:
 *
 *   - It is `pointer-events: none` and sits at `z-index: -10`, below all
 *     content and below PillarScope's CSS atmosphere layer.
 *   - It draws nothing at all on a data-saver connection, and exactly one
 *     static frame under `prefers-reduced-motion`. The page's own colors come
 *     from CSS tokens, never from this canvas, so "no field" is a valid,
 *     complete rendering of every page.
 *   - The `<canvas>` element itself is always rendered, and whether to draw
 *     into it is decided inside the effect. Gating the element on React state
 *     instead would mean a `setState` inside an effect, an extra render of
 *     the whole app on every mount, and a server/client render that disagree
 *    , to hide a transparent, empty, negatively z-indexed layer that is
 *     already indistinguishable from nothing.
 *   - It is `aria-hidden` with a text description exposed separately (below),
 *     so a screen-reader user is told what the environment depicts rather
 *     than either being read a canvas element or being silently excluded.
 *
 * Performance discipline, in the order that matters:
 *   1. One rAF loop for the whole site, not one per effect.
 *   2. Scroll is read through the shared coalesced subscription
 *      (useScrollProgress.ts) and written to a ref, never to React state,
 *      which would re-render the app on every scroll event.
 *   3. The loop stops entirely when the tab is hidden, and is never started
 *      at all under `prefers-reduced-motion` (one static frame, repainted
 *      only on resize). It does *not* idle out on a visible, unscrolled tab:
 *      every regime is time-animated, so there is no "static regime" to
 *      detect, a claim to the contrary used to sit here and described code
 *      that has never existed.
 *   4. Backing-store resolution is capped at 2x (1.5x on phones), an
 *      uncapped DPR on a 3x phone is ~9x the fill cost for a decorative layer.
 *   5. `detail` and `intensity` scale down on small screens and low
 *      core-count devices, so a phone draws a genuinely simpler scene rather
 *      than the same scene slowly.
 *   6. The `journey` stop table (`measureStops`) is the one thing here that
 *      reads layout. It is measured on resize and on a document-size change,
 *      never inside `paint`, a `getBoundingClientRect` per frame would force
 *      a synchronous layout sixty times a second for a decorative layer.
 */

/** Above this width the field is drawn at full strength. */
const WIDE_BREAKPOINT = 1024;
const NARROW_BREAKPOINT = 640;

type Quality = {
  dprCap: number;
  intensity: number;
  detail: number;
  /** Minimum ms between frames. 0 = every frame. */
  frameInterval: number;
};

function measureQuality(width: number): Quality {
  const cores = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 8) : 8;
  const lowPower = cores <= 4;

  if (width < NARROW_BREAKPOINT) {
    // Phone: half the detail, a quieter field (there is far less empty space
    // beside the text to put it in), and a 30fps ceiling.
    return { dprCap: 1.5, intensity: 0.55, detail: 0.3, frameInterval: 33 };
  }
  if (width < WIDE_BREAKPOINT) {
    return { dprCap: 2, intensity: 0.75, detail: 0.6, frameInterval: lowPower ? 33 : 0 };
  }
  return { dprCap: 2, intensity: 1, detail: 1, frameInterval: lowPower ? 33 : 0 };
}

/** Resolves the pillar color ramp to concrete color strings the canvas can
 *  use. Reads the *computed* value of the custom properties, which has all
 *  `var()` references substituted, so `--pillar-accent` comes back as a
 *  literal `oklch(...)`, exactly what `fillStyle` wants. Alpha is applied via
 *  `globalAlpha` in the renderers rather than baked into these strings, so no
 *  color-string surgery is needed anywhere. */
function readColors(probe: HTMLElement) {
  const styles = getComputedStyle(probe);
  const read = (name: string, fallback: string) => {
    const value = styles.getPropertyValue(name).trim();
    return value.length > 0 ? value : fallback;
  };
  // The fallbacks are `"transparent"`, not hex.
  //
  // They are not dead code: they fire on first paint, under jsdom, and any
  // time this canvas mounts before the theme attribute lands on <html>. The
  // previous values (`#818cf8`, `#4b5563`, `#e6ebf4`) were the *dark* ramp, so
  // a light-theme reader could get a frame of dark particles over paper before
  // the re-read corrected it, and `#4b5563` was not `--pillar-dim` in either
  // theme, so that one had no correct moment at all.
  //
  // `transparent` is a valid canvas colour (`rgba(0,0,0,0)`), so a particle
  // that cannot read its own colour simply does not paint. That is the right
  // failure for this layer specifically: the whole field is decorative, sits
  // behind the page at a negative z-index, and already has a text equivalent
  // (see the regime description) — the design brief's own standard is that it
  // can fail to load entirely and the page still reads the same. Drawing
  // nothing for one frame costs nothing; drawing the wrong theme is a visible
  // flash on every light-theme page load.
  // The per-theme strength multiplier (globals.css §1). Read here rather than
  // hard-coded because it is a *palette* fact, not a device or regime one:
  // paper leaves the field about a twentieth of the luminance headroom the
  // dark ground does before it takes `--subtle-foreground` under AA. Read
  // through the same probe as the colours so it re-resolves on a theme
  // change, and defaulting to 1 so a missing token cannot dim the field to
  // nothing.
  const strength = Number(styles.getPropertyValue("--field-strength").trim());
  return {
    accent: read("--pillar-accent", "transparent"),
    dim: read("--pillar-dim", "transparent"),
    foreground: read("--foreground", "transparent"),
    strength: Number.isFinite(strength) && strength > 0 ? Math.min(1, strength) : 1,
  };
}

export function QuantumField() {
  const { regime, pillar } = useFieldState();
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ progress: 0, scrollY: 0 });
  // Bumped whenever the resolved theme changes, to force a color re-read.
  const [themeEpoch, setThemeEpoch] = useState(0);

  useScrollSubscription((progress, scrollY) => {
    scrollRef.current.progress = progress;
    scrollRef.current.scrollY = scrollY;
  });

  // The theme (and therefore every color the field draws with) can change
  // without this component re-rendering: ThemeToggle writes an attribute on
  // <html>, and the OS preference can flip under a "system" setting. Watch
  // both, and re-read colors when either fires.
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeEpoch((n) => n + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setThemeEpoch((n) => n + 1);
    media.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    // Respect an explicit data-saver preference: a decorative animated
    // canvas is exactly the kind of thing that setting asks us not to run.
    type MaybeSaveData = { saveData?: boolean };
    const connection = (navigator as Navigator & { connection?: MaybeSaveData }).connection;
    if (connection?.saveData) return;

    const canvas = canvasRef.current;
    const probe = probeRef.current;
    if (!canvas || !probe) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let quality = measureQuality(window.innerWidth);
    let colors = readColors(probe);
    let width = 0;
    let height = 0;
    let frameHandle = 0;
    let lastFrameTime = 0;
    const start = performance.now();
    /** Document-space Y of every narrative stop the page declared, ascending.
     *  Empty on every page that declares none. See `measureStops`. */
    let stops: number[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      quality = measureQuality(window.innerWidth);
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dprCap);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /**
     * Reads the page's declared narrative stops: any element carrying
     * `data-journey-stop`, in document order.
     *
     * `journey` (regimes.ts) crossfades six environments across `frame.scroll`,
     * and `frame.scroll` is the raw fraction of the document scrolled. That is
     * only the same thing as "which part of the curriculum am I looking at" if
     * the six sections happen to be evenly spaced, which is a coincidence the
     * homepage cannot keep: it opens with a hero, a prediction and a
     * how-it-works block before the first track, and carries a detour between
     * two of them. Scored against the raw fraction, the field is already
     * drawing lattice while the reader is still reading about wave mechanics.
     *
     * So the page names its own stops and the field scores against those. This
     * is read from the DOM rather than plumbed through props for the same
     * reason the regime itself is a module store (fieldStore.ts): the
     * alternative is a client Provider around a tree that is otherwise entirely
     * server components. The attribute is server-rendered, costs no JavaScript,
     * and a page that sets none falls back to the raw fraction unchanged.
     *
     * Measured on resize and whenever the document's own height changes (a lazy
     * simulator arriving, an image landing), never per frame: `paint` runs 60
     * times a second and `getBoundingClientRect` forces layout.
     */
    function measureStops() {
      if (regime !== "journey") {
        stops = [];
        return;
      }
      const measured: number[] = [];
      for (const node of document.querySelectorAll("[data-journey-stop]")) {
        measured.push(node.getBoundingClientRect().top + window.scrollY);
      }
      measured.sort((a, b) => a - b);
      stops = measured;
    }

    /**
     * Position within the declared stops, normalized to 0..1, or `null` when
     * the page declared fewer than two (nothing to interpolate between).
     *
     * Scored at the viewport's vertical midpoint rather than its top edge, so a
     * section "arrives" when it is centred in front of the reader instead of
     * when its first pixel appears. Piecewise-linear between stops, so uneven
     * section lengths still hand over at the section boundary.
     */
    function journeyProgress(scrollY: number): number | null {
      const last = stops.length - 1;
      if (last < 1) return null;
      const eye = scrollY + height * 0.5;
      if (eye <= stops[0]) return 0;
      if (eye >= stops[last]) return 1;
      for (let i = 0; i < last; i += 1) {
        if (eye >= stops[i + 1]) continue;
        const span = stops[i + 1] - stops[i];
        const local = span > 0 ? (eye - stops[i]) / span : 0;
        return (i + local) / last;
      }
      return 1;
    }

    // One frame object for the life of the effect, rewritten in place each
    // paint rather than rebuilt. The renderers in regimes.ts destructure it
    // at entry and none of them retains it past its own call, `drawJourney`
    // is the only one that passes it on, and it dispatches through
    // `JOURNEY_SEQUENCE`, which is typed `Exclude<FieldRegime, "journey">`
    // and so cannot re-enter, which is what makes reuse safe. Keep it that
    // way: a renderer that stores the frame (to diff against the previous
    // one, say) would now be storing a handle to the *current* frame.
    const frame: FieldFrame = {
      ctx,
      width: 0,
      height: 0,
      time: 0,
      scroll: 0,
      scrollY: 0,
      accent: colors.accent,
      dim: colors.dim,
      foreground: colors.foreground,
      intensity: quality.intensity,
      detail: quality.detail,
    };

    function paint(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      frame.width = width;
      frame.height = height;
      // Frozen at zero for reduced motion: the composition still draws (a
      // still image of the physics is informative and beautiful), it simply
      // does not evolve.
      frame.time = prefersReducedMotion ? 0 : (now - start) / 1000;
      // Scored against the page's own narrative stops when it declared any,
      // and against the raw document fraction otherwise, which is every page
      // but the homepage, and the homepage too before its stops are measured.
      const anchored = prefersReducedMotion ? null : journeyProgress(scrollRef.current.scrollY);
      frame.scroll = prefersReducedMotion ? 0 : (anchored ?? scrollRef.current.progress);
      frame.scrollY = prefersReducedMotion ? 0 : scrollRef.current.scrollY;
      frame.accent = colors.accent;
      frame.dim = colors.dim;
      frame.foreground = colors.foreground;
      // Three factors, one per thing that legitimately varies:
      //
      //   quality.intensity            the *device* budget — a phone draws a
      //                                quieter field than a desktop
      //   REGIME_COMPOSITE_CEILING     the *legibility* budget per regime,
      //                                measured against the composite a
      //                                reader's eye lands on rather than
      //                                against any one mark (see the long
      //                                note on that constant in regimes.ts
      //                                for why the per-mark ceiling there
      //                                could not do this job)
      //   colors.strength              the *palette* budget — paper has far
      //                                less headroom than the dark ground
      //
      // Applied here, once, on the top-level regime: `drawJourney` rescales
      // `frame.intensity` for each side of its crossfade, so applying any of
      // this inside the dispatch table would charge a journey frame twice.
      frame.intensity = quality.intensity * REGIME_COMPOSITE_CEILING[regime] * colors.strength;
      frame.detail = quality.detail;
      REGIME_RENDERERS[regime](frame);
    }

    function loop(now: number) {
      frameHandle = window.requestAnimationFrame(loop);
      if (quality.frameInterval > 0 && now - lastFrameTime < quality.frameInterval) return;
      lastFrameTime = now;
      paint(now);
    }

    function startLoop() {
      if (frameHandle) return;
      frameHandle = window.requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (!frameHandle) return;
      window.cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }

    function onVisibilityChange() {
      if (document.hidden) stopLoop();
      else if (!prefersReducedMotion) startLoop();
    }

    function onResize() {
      resize();
      measureStops();
      colors = readColors(probe!);
      // Redraw immediately so a resize under reduced motion (where no loop is
      // running) doesn't leave a stretched or blank canvas.
      paint(performance.now());
    }

    resize();
    measureStops();

    // The homepage's stops move after first paint. A lazily-mounted simulator
    // replaces its skeleton; a revealed section settles; a font lands. Any of
    // those leaves a stale stop table, which would put the crossfade
    // permanently a section behind. Watching the document element catches all
    // of them without polling, and the observer is only constructed at all on
    // a page that actually declared stops.
    const bodyObserver =
      stops.length > 1 && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measureStops())
        : null;
    bodyObserver?.observe(document.documentElement);

    if (prefersReducedMotion) {
      // One static frame, no loop, no scroll response. Scroll-linked motion
      // is still motion; a reader who asked for less of it should not get a
      // background that reacts to every wheel tick.
      paint(performance.now());
    } else {
      startLoop();
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stopLoop();
      bodyObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
    };
  }, [regime, prefersReducedMotion, themeEpoch, pillar]);

  return (
    <>
      {/* Color probe. Carries the current pillar so the ramp resolves exactly
          as it would for content inside that pillar, without QuantumField
          needing to know any color values itself. Zero-size and clipped
          rather than `display: none` so computed styles are unambiguous. */}
      <div
        ref={probeRef}
        {...(pillar ? { "data-pillar": pillar } : null)}
        aria-hidden="true"
        data-decorative=""
        style={{
          position: "fixed",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      />
      <canvas ref={canvasRef} className="field-canvas" aria-hidden="true" data-decorative="" />
      {/* The environment carries meaning (it depicts the physics of the
          pillar you are in), so it gets a text equivalent rather than being
          hidden outright. `sr-only` and polite-free: it is a static
          description of the page's setting, not a live region. */}
      <p className="sr-only">{REGIME_DESCRIPTIONS[regime]}</p>
    </>
  );
}
