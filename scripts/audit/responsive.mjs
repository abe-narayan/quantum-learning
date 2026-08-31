#!/usr/bin/env node
/**
 * Renders a set of representative routes at each viewport this site promises
 * to work at, and reports every layout defect that can be measured rather than
 * eyeballed.
 *
 * Usage:
 *   node scripts/audit/responsive.mjs [--base http://localhost:3000] [--widths 320,375,390,768,1280]
 *
 * What it checks, per route per width:
 *
 *  - **Horizontal overflow.** The single most common mobile defect here, and
 *    invisible on a developer's 1512px screen. Elements inside a container
 *    that legitimately scrolls sideways (a wide table, a circuit diagram in a
 *    `ScrollableFigure`) are excluded, because those are the fix, not the bug.
 *  - **Tap target size.** WCAG 2.5.8 asks for 24x24 CSS px; this checks the
 *    stricter 44px that touch UI actually needs, and reports anything under.
 *  - **Console errors and uncaught exceptions**, which on a static site almost
 *    always mean a hydration mismatch.
 *  - **Text too small to read**, under 12px on a body-copy element.
 *  - **Contrast of every text node against its own painted background**,
 *    including the atmospheric canvas layers, which is where this design's
 *    real risk sits. Uses the WCAG 2.x relative-luminance formula.
 *
 * Exit code is 1 if any BLOCKER is found, so this can gate a release. Warnings
 * do not fail it: a 24px icon button that is genuinely decorative should not
 * stop a deploy, but it should be printed.
 */
import { pathToFileURL } from "node:url";

import { launchChrome, Page } from "./cdp.mjs";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const BASE = (getArg("base", "http://localhost:3000") ?? "").replace(/\/+$/, "");
const WIDTHS = (getArg("widths", "320,375,390,768,1280") ?? "").split(",").map((w) => Number(w.trim()));
const ONLY = getArg("routes", null);

/**
 * One route per distinct layout on the site. Not every route: 830 pages share
 * about a dozen templates, and rendering all of them would turn a 40-second
 * check into an hour without finding anything the templates do not already
 * show.
 */
export const DEFAULT_ROUTES = [
  "/",
  "/learn",
  "/lessons",
  "/lessons/quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
  "/lessons/quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
  // A lesson whose body is mostly fixed-width SVG figures in a grid, which is
  // the shape that has produced three separate clipping defects here. It was
  // not in this list, and that is exactly why its two grids were still
  // overflowing at 320px after the same bug had been fixed twice elsewhere.
  "/lessons/quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
  "/problems",
  // A real slug. This list is checked by routeInventory.test.ts, because
  // an audit route that 404s reports on the not-found page instead and
  // silently passes: the not-found page has no overflow and no contrast
  // problems, so a typo here reads as a clean bill of health.
  "/problems/bell-state-outcome-probability",
  "/simulators",
  "/map",
  "/glossary",
  "/courses/quantum-gates-and-circuits",
  "/mechanics",
  "/computing",
  "/hardware",
  "/software",
  "/mastery",
  "/apex",
  "/current-quantum",
  "/about",
];

const ROUTES = ONLY ? ONLY.split(",") : DEFAULT_ROUTES;

/** Runs inside the page. Returns every measurable layout defect it can see. */
const PROBE = String.raw`(() => {
  const vw = document.documentElement.clientWidth;
  const overflow = [];
  const smallTargets = [];
  const allTargets = [];
  const buriedTargets = [];
  const tinyText = [];
  const lowContrast = [];

  const describe = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return el.tagName.toLowerCase() + id + cls;
  };

  // Whether some ancestor already contains this element horizontally, either
  // by scrolling it or by clipping it.
  //
  // Scrolling was always excluded: a wide table in a ScrollableFigure is the
  // fix, not the bug. Clipping has to be too, and for a stronger reason —
  // this check exists to find things that push the *page* sideways, and
  // content inside an overflow-hidden box cannot, whatever its rect says.
  // The concept map is the case that proves it: its graph is an absolutely
  // positioned surface that extends far outside a touch-none viewport
  // because that is what there is to pan to, and every node currently off
  // screen was reported as overflow. Thirty blockers on one route, all of
  // them the feature working.
  //
  // The walk stops at the body element, which matters: the sitewide
  // html/body overflow-x: clip would otherwise exempt every element.
  const containedSideways = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const overflowX = getComputedStyle(p).overflowX;
      if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden' || overflowX === 'clip') {
        return true;
      }
      p = p.parentElement;
    }
    return false;
  };

  const srOnly = (el) => {
    let p = el;
    while (p) {
      const cs = getComputedStyle(p);
      if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return true;
      if (p.getAttribute && p.getAttribute('aria-hidden') === 'true') return true;
      p = p.parentElement;
    }
    return false;
  };

  // Content inside a closed <details> is not on the page yet.
  //
  // It does not look hidden to any of the tests above, which is the problem.
  // Measured in this harness's own headless Chrome, a span inside a closed
  // disclosure reports display:block, visibility:visible and a box of 1x1 —
  // non-zero, so the width/height guards pass it through — while
  // elementFromPoint at its centre returns an ancestor rather than the element.
  //
  // Both failure directions follow. A real control folded away is measured as
  // a 1x1 tap target and reported as a blocker nobody can act on, and a
  // checker that cries wolf is worse than none. And any probe that treats
  // "has a box" as "the reader can reach this" counts a control that cannot be
  // clicked as one that can. This became load-bearing when three templates
  // (the lesson header's objectives, the course card's module manifest, the
  // problem page's context summary) all moved to closed disclosures on the
  // same day.
  const collapsed = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS' && !p.open) {
        // A <summary> is the visible part of a closed disclosure, so it and
        // its contents stay in scope.
        return !el.closest('summary');
      }
    }
    return false;
  };

  // ---- overflow -----------------------------------------------------------
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.right > vw + 1 || r.left < -1) {
      if (containedSideways(el)) continue;
      if (srOnly(el)) continue;
      // Deliberately NOT skipping collapsed(el) here, unlike the tap-target
      // and contrast walkers below. (No backticks in this comment: it lives
      // inside a String.raw template literal, where one ends the string.)
      //
      // A reader cannot tap or read what is folded away, so measuring it there
      // is noise. Overflow is different: it is a property of the layout, not of
      // the current disclosure state, and it becomes visible the instant the
      // reader opens the fold. This lesson is the proof. Adding the guard here
      // dropped optimalGroverIterations(6) from the findings, and that span
      // measures 265px wide reaching x=335 in a 320px viewport, inside a closed
      // details element. Suppressing it would have reported the page clean
      // while the reader who opens that disclosure loses the right-hand end of
      // the code, with no scrollbar to say so, because body has overflow-x: clip.
      // An ancestor already reported is the real offender; skip descendants.
      if (overflow.some((o) => o.el === el.parentElement)) { continue; }
      overflow.push({
        el,
        sel: describe(el),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || '').trim().slice(0, 60),
      });
    }
  }

  // ---- tap targets --------------------------------------------------------
  //
  // The element's own border box is NOT the hit area on this site. The
  // whole-row click target here is a stretched pseudo-element: the anchor
  // stays small and wraps only the title, and an
  // 'after:absolute after:inset-0' fills the nearest positioned ancestor.
  // That is a considered answer to a real conflict rather than an oversight
  // (see SiteContents.tsx): putting the description inside the anchor
  // would make the link's accessible name a whole paragraph, and naming it
  // with aria-label would push that description out of the accessibility
  // tree altogether. So the anchor is named "Simulators", the sentence stays
  // readable content, and the row is one large target.
  //
  // Measuring the anchor reported those rows at 288x28 and called them
  // failures. Five of fifteen homepage warnings at 320px were this pattern,
  // all of them wrong, so the geometry has to be resolved the way the
  // browser resolves it: find the stretch, then measure what it stretched to.
  // The containing block of an absolutely positioned box: the nearest
  // positioned ancestor.
  const containingBlock = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      if (getComputedStyle(p).position !== 'static') return p;
      p = p.parentElement;
    }
    return null;
  };

  // Two idioms in this codebase put the hit area on a pseudo-element, and
  // both are deliberate:
  //
  //  1. 'after:absolute after:inset-0' on a small anchor inside a positioned
  //     row (SiteContents, CourseList) — the whole row is the target while
  //     the link's accessible name stays the destination alone.
  //  2. A 44x44 pseudo centred on a 40px painted face
  //     (IconButton's TOUCH_TARGET_CLASSES) — the hit area grows without the
  //     visible chrome growing with it, so a row of instrument buttons keeps
  //     one baseline. It is written 'max(44px, own size)' so it can never
  //     shrink a larger labelled trigger.
  //
  // Measure what the browser will actually hit, not the border box.
  const hitArea = (el) => {
    const own = el.getBoundingClientRect();
    for (const pseudo of ['::after', '::before']) {
      const ps = getComputedStyle(el, pseudo);
      if (!ps || ps.content === 'none' || ps.content === 'normal') continue;
      if (ps.position !== 'absolute') continue;

      // Case 1: pinned on all four sides, so it fills its containing block.
      if ([ps.top, ps.right, ps.bottom, ps.left].every((v) => parseFloat(v) === 0)) {
        const block = containingBlock(el);
        if (block) return { rect: block.getBoundingClientRect(), kind: 'stretched', block };
      }

      // Case 2: an explicitly sized box larger than the control it sits on.
      const pw = parseFloat(ps.width);
      const ph = parseFloat(ps.height);
      if (pw > own.width + 0.5 || ph > own.height + 0.5) {
        const w = Math.max(own.width, pw);
        const h = Math.max(own.height, ph);
        const cx = (own.left + own.right) / 2;
        const cy = (own.top + own.bottom) / 2;
        return {
          rect: { left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2, width: w, height: h },
          kind: 'expanded',
          block: null,
        };
      }
    }
    return null;
  };

  const interactive = 'a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
  for (const el of document.querySelectorAll(interactive)) {
    const own = el.getBoundingClientRect();
    if (own.width === 0 || own.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (srOnly(el)) continue;
    if (collapsed(el)) continue;
    // A link inside a paragraph is inline text, not a tap target with a box.
    if (cs.display === 'inline' && el.tagName === 'A') continue;

    const hit = hitArea(el);
    const r = hit ? hit.rect : own;

    if (r.width < 44 || r.height < 44) {
      smallTargets.push({
        el,
        rect: r,
        sel: describe(el),
        w: Math.round(r.width),
        h: Math.round(r.height),
        via: hit ? hit.kind : '',
        text: (el.textContent || '').trim().slice(0, 40) || el.getAttribute('aria-label') || '',
      });
    }
    allTargets.push({ el, rect: r });

    // ---- unreachable controls --------------------------------------------
    // A stretched click overlay covering a row that contains ANOTHER control
    // buries it: the overlay is a positioned descendant and paints above a
    // static sibling, so the tap never reaches the inner control. That is a
    // real failure and the reason this check exists.
    //
    // It is asked of the browser, not computed. A first version compared
    // rectangles and then excluded anything with 'position' other than
    // 'static', which is not where the lift comes from: CurrentQuantumCard
    // puts 'relative z-10' on the FIGURE, and its 13 credit links inherit
    // that stacking context while staying static themselves. All ten of them
    // were reported as buried and every one was reachable. Stacking order is
    // the product of ancestors, z-index, opacity, transforms, filters and
    // containment; reimplementing it is how you get ten confident wrong
    // answers. elementFromPoint IS the hit test, so ask it.
    const cx = (own.left + own.right) / 2;
    const cy = (own.top + own.bottom) / 2;
    if (cx >= 0 && cy >= 0 && cx <= vw && cy <= document.documentElement.clientHeight) {
      const hitEl = document.elementFromPoint(cx, cy);
      if (hitEl && hitEl !== el && !el.contains(hitEl)) {
        // Only report a control buried by something that is itself a click
        // target, and only where the coverer is not simply this control's own
        // label or a wrapping anchor.
        const coverer = hitEl.closest(interactive);
        if (coverer && coverer !== el && !coverer.contains(el)) {
          buriedTargets.push({
            sel: describe(el),
            under: describe(coverer),
            text: (el.textContent || '').trim().slice(0, 40) || el.getAttribute('aria-label') || '',
          });
        }
      }
    }
  }

  // How much clearance an undersized target has. WCAG 2.5.8 exempts a small
  // target whose neighbours are far enough away that a mis-tap cannot hit one
  // of them, and that distinction is the difference between two real defects
  // with different fixes: a 32px wordmark alone in a header row is a
  // precision annoyance, while a 32px letter in a 26-letter A-Z strip is a
  // reader repeatedly landing on the wrong letter. Reporting them
  // identically hides which is which.
  for (const t of smallTargets) {
    let nearest = Infinity;
    for (const other of allTargets) {
      if (other.el === t.el || t.el.contains(other.el) || other.el.contains(t.el)) continue;
      const dx = Math.max(0, Math.max(t.rect.left - other.rect.right, other.rect.left - t.rect.right));
      const dy = Math.max(0, Math.max(t.rect.top - other.rect.bottom, other.rect.top - t.rect.bottom));
      nearest = Math.min(nearest, Math.hypot(dx, dy));
    }
    t.clearance = Number.isFinite(nearest) ? Math.round(nearest) : -1;
  }

  // ---- text size and contrast --------------------------------------------
  const srgbToLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);

  // Colors are resolved by PAINTING them, never by parsing them, and the
  // whole ancestor stack is composited in one pass on the canvas rather than
  // blended in JS.
  //
  // Two reasons, both of which produced wrong answers here first:
  //
  //  1. This design system is authored in oklch (see globals.css), and Chrome
  //     returns "oklch(0.78 0.14 268)" verbatim from getComputedStyle. A regex
  //     for rgba() does not match it, and a checker that treats "unparseable"
  //     as "keep walking up for a background" reports the site's own accent
  //     buttons as 1.07:1 black-on-black.
  //  2. Recovering a translucent color's channels from a single painted pixel
  //     cannot be done accurately, and must not be attempted: 'getImageData'
  //     already returns UNPREMULTIPLIED RGBA, so dividing by alpha a second
  //     time overshoots enormously at low alpha. At 'bg-brand/5' that turned a
  //     perfectly readable indigo eyebrow into a reported 1.09:1 failure.
  //
  // Letting the browser composite avoids both. Fill an opaque base, then fill
  // each translucent layer over it in paint order; the result is the exact
  // pixel the user sees, for any color syntax the browser supports.
  const swatch = document.createElement('canvas');
  swatch.width = 1; swatch.height = 1;
  const sctx = swatch.getContext('2d', { willReadFrequently: true });

  /** True if the browser understood this color string at all. */
  const supported = (c) => {
    if (!c) return false;
    sctx.fillStyle = '#010203';
    sctx.fillStyle = c;
    return sctx.fillStyle !== '#010203' || /^(#010203|rgb\(1, ?2, ?3\))$/i.test(c.trim());
  };

  /** Alpha of a color string, 0..1, read from a single painted pixel. */
  const alphaOf = (c) => {
    sctx.clearRect(0, 0, 1, 1);
    sctx.fillStyle = c;
    sctx.fillRect(0, 0, 1, 1);
    return sctx.getImageData(0, 0, 1, 1).data[3] / 255;
  };

  /** Paints an opaque base then each layer in order; returns the final RGB. */
  const composite = (layers) => {
    sctx.clearRect(0, 0, 1, 1);
    sctx.fillStyle = '#000';
    sctx.fillRect(0, 0, 1, 1);
    for (const layer of layers) {
      sctx.fillStyle = layer;
      sctx.fillRect(0, 0, 1, 1);
    }
    const d = sctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  /**
   * Every painted background between this element and the first opaque one
   * above it, ordered outermost-first so they can be composited in paint
   * order. Stops at the first opaque layer, because nothing above it shows.
   */
  const bgLayers = (el) => {
    const stack = [];
    let p = el;
    while (p) {
      const c = getComputedStyle(p).backgroundColor;
      if (supported(c)) {
        const a = alphaOf(c);
        if (a > 0) stack.push(c);
        if (a === 1) break;
      }
      p = p.parentElement;
    }
    return stack.reverse();
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (text.length < 3) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    if (srOnly(el)) continue;
    if (collapsed(el)) continue;

    // ---- text too small to read ------------------------------------------
    // The decision this encodes, made once rather than re-argued 926 times:
    //
    //   Type below 12px is acceptable for the metadata voice and only for it.
    //
    // The --text-meta token (0.6875rem = 11px) is what .tech-label and
    // .eyebrow set: short, uppercase, letterspaced labels naming the thing
    // beside them ("DIFFICULTY", "72 LESSONS"). --text-micro (0.625rem) is dense
    // tabular chrome where a digit column has to fit. Those are labels, read
    // in a glance next to what they label; uppercase and 0.14em of tracking
    // is what makes them legible at that size, and it is also what makes them
    // unusable for anything longer. WCAG sets no minimum size — 1.4.4 asks
    // that text survive a 200% resize, which the a11y harness checks
    // separately, and this ramp is in rem so it does.
    //
    // What is not acceptable is *running text* under 12px: a sentence in
    // sentence case, at default tracking, that a reader has to read rather
    // than glance at. So that is what this reports. Reporting the design
    // system's own metadata voice on every element that uses it correctly is
    // noise, and noise is how a real 10px paragraph gets missed.
    const size = parseFloat(cs.fontSize);
    const tracked = parseFloat(cs.letterSpacing) >= 1;
    const shouty = cs.textTransform === 'uppercase';
    const runningText = text.length > 40 && !(tracked && shouty);
    if (size < 12 && runningText) {
      tinyText.push({ sel: describe(el), size: +size.toFixed(1), text: text.slice(0, 45) });
    }

    if (!supported(cs.color)) continue;
    const layers = bgLayers(el);
    const bg = composite(layers);
    // Text with alpha (this design uses it) composites over its own
    // background, so paint it as one more layer rather than blending in JS.
    const fgc = composite([...layers, cs.color]);
    const l1 = lum(fgc), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const required = large ? 3 : 4.5;
    if (ratio < required) {
      lowContrast.push({
        sel: describe(el),
        ratio: +ratio.toFixed(2),
        required,
        size: +size.toFixed(1),
        color: cs.color,
        text: text.slice(0, 45),
      });
    }
  }

  return {
    vw,
    scrollW: document.documentElement.scrollWidth,
    horizontalScroll: document.documentElement.scrollWidth > vw + 1,
    overflow: overflow.map(({ el, ...rest }) => rest).slice(0, 15),
    smallTargets: smallTargets.slice(0, 15).map(({ el, rect, ...rest }) => rest),
    smallTargetCount: smallTargets.length,
    buriedTargets: buriedTargets.slice(0, 10),
    tinyText: tinyText.slice(0, 10),
    lowContrast: lowContrast.slice(0, 15),
    lowContrastCount: lowContrast.length,
  };
})()`;

async function main() {
  const chrome = await launchChrome();
  const findings = [];
  let blockers = 0;

  try {
    for (const width of WIDTHS) {
      const page = await Page.open(chrome.port, { width, height: 900, mobile: width < 768 });
      for (const route of ROUTES) {
        let probe;
        try {
          const { timedOut, skeleton } = await page.goto(`${BASE}${route}`);
          if (skeleton !== "cleared") {
            // Still showing `loading.tsx`. A skeleton is a handful of empty
            // boxes: no overflow, no contrast failures, no console errors. It
            // reports clean on everything, which is exactly why an unmeasured
            // route has to announce itself.
            findings.push({
              width,
              route,
              level: "BLOCKER",
              kind: "unmeasured-skeleton",
              detail: `the loading skeleton was still on screen after the settle (${skeleton}); every finding for this route is about the skeleton, not the page`,
            });
            blockers++;
          }
          if (timedOut) {
            // Surfaced rather than swallowed: everything below is about to be
            // measured on a page that never fired `load`.
            findings.push({
              width,
              route,
              level: "BLOCKER",
              kind: "load-timeout",
              detail: "the load event never fired within 45s; every finding for this route was measured on a half-rendered page",
            });
            blockers++;
          }
          probe = await page.eval(PROBE);
        } catch (err) {
          findings.push({ width, route, level: "BLOCKER", kind: "render", detail: String(err.message ?? err) });
          blockers++;
          continue;
        }

        const errors = [
          ...page.pageErrors,
          ...page.consoleMessages.filter((m) => m.type === "error").map((m) => m.text),
        ]          // Dev-server noise, not site errors. The HMR one in particular
          // fires when another process saves a file mid-run, which during a
          // sprint is most of the time.
          .filter(
            (text) =>
              !/favicon|Download the React DevTools|Router action dispatched before initialization|hmrRefresh/i.test(
                text
              )
          );

        for (const detail of errors) {
          findings.push({ width, route, level: "BLOCKER", kind: "console", detail });
          blockers++;
        }
        if (probe.horizontalScroll) {
          findings.push({
            width,
            route,
            level: "BLOCKER",
            kind: "page-scrolls-sideways",
            detail: `scrollWidth ${probe.scrollW} > viewport ${probe.vw}`,
          });
          blockers++;
        }
        for (const o of probe.overflow) {
          findings.push({
            width,
            route,
            level: "BLOCKER",
            kind: "overflow",
            detail: `${o.sel} spans ${o.left}..${o.right} | ${JSON.stringify(o.text)}`,
          });
          blockers++;
        }
        for (const c of probe.lowContrast) {
          findings.push({
            width,
            route,
            level: "BLOCKER",
            kind: "contrast",
            detail: `${c.sel} ${c.ratio}:1 (needs ${c.required}) at ${c.size}px ${c.color} | ${JSON.stringify(c.text)}`,
          });
          blockers++;
        }
        for (const t of probe.tinyText) {
          findings.push({ width, route, level: "WARN", kind: "tiny-text", detail: `${t.sel} ${t.size}px | ${JSON.stringify(t.text)}` });
        }
        // A control sitting under a stretched click overlay cannot be
        // clicked at all, at any width, so this is not gated on a phone
        // viewport and is not a warning.
        for (const t of probe.buriedTargets ?? []) {
          findings.push({
            width,
            route,
            level: "BLOCKER",
            kind: "buried-target",
            detail: `${t.sel} ${JSON.stringify(t.text)} sits under the stretched hit area of ${t.under}`,
          });
          blockers++;
        }
        if (width < 768) {
          for (const t of probe.smallTargets) {
            findings.push({
              width,
              route,
              level: "WARN",
              kind: "tap-target",
              detail:
                `${t.sel} ${t.w}x${t.h}${t.via ? ` (measured on its ${t.via} hit area)` : ""}` +
                `, ${t.clearance >= 0 ? `${t.clearance}px to the nearest other target` : "no other target nearby"}` +
                ` | ${JSON.stringify(t.text)}`,
            });
          }
        }
      }
      await page.close();
      process.stderr.write(`  width ${width} done\n`);
    }
  } finally {
    await chrome.close();
  }

  const byKind = new Map();
  for (const f of findings) {
    const key = `${f.level}/${f.kind}`;
    if (!byKind.has(key)) byKind.set(key, []);
    byKind.get(key).push(f);
  }

  console.log(`\n=== responsive audit: ${ROUTES.length} routes x ${WIDTHS.length} widths ===\n`);
  for (const [key, list] of [...byKind.entries()].sort()) {
    console.log(`${key}  (${list.length})`);
    for (const f of list) console.log(`   ${String(f.width).padStart(4)}px  ${f.route}\n         ${f.detail}`);
    console.log("");
  }
  if (findings.length === 0) console.log("no findings");
  console.log(`blockers: ${blockers}`);
  process.exit(blockers > 0 ? 1 : 0);
}

// Only when run as a program. `DEFAULT_ROUTES` is imported by
// `src/lib/design/__tests__/routeInventory.test.ts` and by `a11y.mjs`, and an
// unguarded top-level `main()` would launch headless Chrome and then call
// `process.exit` from inside the vitest worker that imported the list.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
