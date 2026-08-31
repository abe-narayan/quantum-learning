#!/usr/bin/env node
/**
 * The accessibility half of the rendered-page audits, sibling to
 * `responsive.mjs` and sharing its CDP client.
 *
 * WHY A SECOND HARNESS
 * --------------------
 * `responsive.mjs` answers geometry questions: does this overflow, is this
 * target 44px, is this text 4.5:1 against what is actually painted behind it.
 * Everything here is a question about *semantics and keyboard behaviour*,
 * which needs two capabilities that file does not use:
 *
 *  1. **Chrome's computed accessibility tree** (`Accessibility.getFullAXTree`).
 *     The accessible name of a control is not its `aria-label` and is not its
 *     text content; it is the output of the accname algorithm, and that
 *     algorithm has results a source read does not predict. An `aria-label`
 *     on a role-less `<div>` is discarded in full. A `<Link>` wrapping a
 *     figure, a heading and a paragraph is named by the concatenation of all
 *     three. A KaTeX formula is named by whatever text nodes the renderer
 *     left visible, which for `\alpha` is the single letter alpha and for a
 *     matrix is a run of digits with no structure. All three failures are
 *     invisible in the markup and obvious in the AX tree.
 *  2. **Real key events** (`Input.dispatchKeyEvent`). Enumerating
 *     `a[href], button, [tabindex]` in DOM order is a guess at the tab order.
 *     Pressing Tab is the tab order: it accounts for positive `tabindex`,
 *     `inert`, `display:none` set by a media query, elements a focus trap
 *     moves focus to, and overlays that mount on keypress.
 *
 * WHAT IT CHECKS
 * --------------
 *  - `tabindex` greater than zero anywhere (WCAG 2.4.3, and a maintenance
 *    hazard even where it happens to work).
 *  - Heading outline: exactly one `h1`, no skipped level.
 *  - Landmarks: every landmark named where the page has more than one of its
 *    type, since "navigation" twice in a rotor names nothing.
 *  - Naming prohibited by role: `aria-label` on an element whose role cannot
 *    carry a name, verified against the AX tree rather than assumed.
 *  - Focusable controls with no accessible name, and sets of controls that
 *    share one name while pointing at different destinations.
 *  - The skip link: reachable on the first Tab, and its target actually takes
 *    focus rather than only scrolling.
 *  - Tab walk: order, traps (focus that will not advance), and whether the
 *    focused element paints a visible indicator at all.
 *  - Reduced motion, emulated rather than read: no element may still be
 *    animating, and the canvas field must not be in the DOM.
 *  - Text-only resize to 200% (WCAG 1.4.4): no *content* may clip. A box that
 *    overflows is the cheap signal; whether a text run or a replaced element
 *    is actually outside the clip is the criterion, and the two disagree
 *    often enough that both are reported (see CLIP_PROBE).
 *
 * Usage:
 *   node scripts/audit/a11y.mjs [--routes "/a,/b"] [--width 1280]
 *                               [--theme dark|light] [--tabs 60]
 *                               [--checks keyboard,semantics,motion,resize]
 */
import { pathToFileURL } from "node:url";

import { launchChrome, Page } from "./cdp.mjs";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const has = (name) => args.includes(`--${name}`);

const BASE = (getArg("base", "http://localhost:3000") ?? "").replace(/\/+$/, "");
const WIDTH = Number(getArg("width", "1280"));
const THEME = getArg("theme", "dark");
const TABS = Number(getArg("tabs", "70"));
const CHECKS = new Set((getArg("checks", "semantics,keyboard,motion,resize") ?? "").split(","));
const VERBOSE = has("verbose");

/**
 * One route per *interaction* shape rather than per layout: the semantic and
 * keyboard checks below cost several seconds each, and the six pillar landing
 * pages differ compositionally without differing in a single control. Every
 * entry is drawn from `DEFAULT_ROUTES`, so `routeInventory.test.ts` proves
 * each one resolves to a real page — the 404 page passes an accessibility
 * audit even more convincingly than it passes a layout one.
 */
export const A11Y_ROUTES = [
  "/",
  "/learn",
  "/lessons",
  "/lessons/quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
  "/problems",
  "/problems/bell-state-outcome-probability",
  "/simulators",
  "/glossary",
  "/map",
  "/courses/quantum-gates-and-circuits",
  "/apex",
  "/about",
];

const ROUTES = (getArg("routes", A11Y_ROUTES.join(",")) ?? "").split(",");

// ---------------------------------------------------------------------------
// In-page probes
// ---------------------------------------------------------------------------

/** Shared helper source, inlined into each probe (page evals share no scope). */
const HELPERS = String.raw`
  const describe = (el) => {
    if (!el || !el.tagName) return String(el);
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return el.tagName.toLowerCase() + id + cls;
  };
  const visible = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  };
`;

/**
 * Structural semantics that are answerable from the DOM alone. Anything that
 * depends on a *computed accessible name* is left to the AX tree pass, which
 * runs in Node against `Accessibility.getFullAXTree`.
 */
const SEMANTICS_PROBE = String.raw`(() => {
  ${HELPERS}
  const findings = [];

  // ---- positive tabindex --------------------------------------------------
  for (const el of document.querySelectorAll('[tabindex]')) {
    const v = Number(el.getAttribute('tabindex'));
    if (Number.isFinite(v) && v > 0) {
      findings.push({ kind: 'positive-tabindex', detail: describe(el) + ' tabindex=' + v });
    }
  }

  // ---- heading outline ----------------------------------------------------
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((h) => visible(h) && h.getAttribute('aria-hidden') !== 'true');
  const h1s = headings.filter((h) => h.tagName === 'H1');
  if (h1s.length !== 1) {
    findings.push({
      kind: 'h1-count',
      detail: h1s.length + ' visible h1: ' + h1s.map((h) => JSON.stringify(h.textContent.trim().slice(0, 40))).join(', '),
    });
  }
  let prev = 0;
  for (const h of headings) {
    const level = Number(h.tagName[1]);
    if (prev && level > prev + 1) {
      findings.push({
        kind: 'heading-skip',
        detail: 'h' + prev + ' -> h' + level + ' at ' + JSON.stringify(h.textContent.trim().slice(0, 50)),
      });
    }
    prev = level;
  }

  // ---- naming prohibited by role -----------------------------------------
  // The accname algorithm discards aria-label / aria-labelledby on any role
  // that prohibits naming. The generic role, which is what a bare div, span
  // or p maps to, is the one that bites: the markup looks completely
  // reasonable and the label simply never reaches a screen reader.
  const NAME_PROHIBITED_TAGS = new Set([
    'div','span','p','li','ul','ol','dl','dt','dd','pre','blockquote','em','strong',
    'small','b','i','u','s','sub','sup','code','kbd','samp','var','cite','q','del',
    'ins','mark','time','br','hr','label','legend','caption','figcaption',
  ]);
  for (const el of document.querySelectorAll('[aria-label],[aria-labelledby]')) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    if (role) continue;                       // an explicit role may well accept a name
    if (!NAME_PROHIBITED_TAGS.has(tag)) continue;
    if (tag === 'li' && el.closest('[role]')) continue;
    const label = el.getAttribute('aria-label') || '';
    findings.push({
      kind: 'name-prohibited-role',
      detail: describe(el) + ' aria-label=' + JSON.stringify(label.slice(0, 60)),
      name: label,
    });
  }

  // ---- images -------------------------------------------------------------
  for (const el of document.querySelectorAll('img')) {
    if (!el.hasAttribute('alt')) findings.push({ kind: 'img-no-alt', detail: describe(el) + ' src=' + (el.getAttribute('src') || '').slice(0, 60) });
  }
  for (const el of document.querySelectorAll('svg')) {
    if (el.getAttribute('aria-hidden') === 'true') continue;
    // Any explicit role counts as a decision. It is not always 'img': the
    // homepage's drivable Bloch sphere is 'role="group"' with a described
    // label and 'tabindex="0"', which is the correct exposure for a graphic
    // you can rotate with the arrow keys and would be wrong as an image.
    if (el.getAttribute('role')) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (!visible(el)) continue;
    // An SVG with neither aria-hidden nor a role is exposed to the AX tree as
    // an unnamed graphic in some engines and as nothing in others; either way
    // nobody decided which.
    findings.push({ kind: 'svg-undeclared', detail: describe(el) });
  }

  // ---- live regions -------------------------------------------------------
  for (const el of document.querySelectorAll('[aria-live]')) {
    findings.push({
      kind: 'live-region',
      detail: describe(el) + ' aria-live=' + el.getAttribute('aria-live')
        + ' role=' + (el.getAttribute('role') || '-')
        + ' atomic=' + (el.getAttribute('aria-atomic') || '-')
        + ' | ' + JSON.stringify((el.textContent || '').trim().slice(0, 60)),
      info: true,
    });
  }

  return findings;
})()`;

/**
 * Walks the real tab order by dispatching Tab, recording where focus lands and
 * whether an indicator is painted there. Runs in Node (it has to interleave
 * key events with evaluations), so this constant is only the per-step probe.
 */
const FOCUS_PROBE = String.raw`(() => {
  ${HELPERS}
  const el = document.activeElement;
  if (!el || el === document.body) return { sel: 'body', body: true };
  // The dev server's overlay is a focusable shadow host that ships in no
  // production build. It is not part of the tab order under audit.
  if (el.tagName === 'NEXTJS-PORTAL') return { sel: 'nextjs-portal', dev: true };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  // A box-shadow string is not an indicator. Tailwind's ring utilities always
  // emit a multi-layer shadow, and the layers that are not in use are fully
  // transparent, so 'boxShadow !== none' is true on controls that paint
  // nothing. Require a layer with real alpha and a real size.
  const painted = (shadow) => {
    if (!shadow || shadow === 'none') return false;
    return shadow
      .split(/,(?![^(]*\))/)
      .some((layer) => {
        if (/rgba?\([^)]*,\s*0\s*\)/.test(layer)) return false;
        if (/\/\s*0\s*\)/.test(layer)) return false;
        const lengths = (layer.match(/-?\d*\.?\d+px/g) ?? []).map(parseFloat);
        return lengths.some((v) => Math.abs(v) > 0);
      });
  };
  // The indicator is allowed to live on an ancestor. The site's one text-input
  // recipe puts it there on purpose: the <input> is a bare transparent field
  // inside a bordered shell, and the shell carries
  // 'focus-within:border-pillar focus-within:ring-2', so the input itself has
  // 'outline: none' and no shadow while the control a reader sees is very
  // clearly focused. Checking only the focused node reported the problem
  // page's answer field as having no focus indicator at all.
  let indicator = null;
  for (let p = el, depth = 0; p && depth < 4; p = p.parentElement, depth++) {
    const s = getComputedStyle(p);
    if ((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || painted(s.boxShadow)) {
      indicator = depth === 0 ? 'self' : p.tagName.toLowerCase() + ' (ancestor)';
      break;
    }
  }
  const outlined = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const ringed = Boolean(indicator);
  return {
    indicator,
    sel: describe(el),
    tag: el.tagName.toLowerCase(),
    text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
    outlined,
    ringed,
    outline: cs.outline,
    boxShadow: ringed ? cs.boxShadow.slice(0, 70) : '',
    x: Math.round(r.left),
    y: Math.round(r.top + window.scrollY),
    w: Math.round(r.width),
    h: Math.round(r.height),
    inViewport: r.top >= -2 && r.bottom <= window.innerHeight + 2,
    // Index in document order, so focus order can be compared to source order.
    domIndex: [...document.querySelectorAll('*')].indexOf(el),
  };
})()`;

/**
 * Under `prefers-reduced-motion: reduce`, "reduced" means stopped. A duration
 * of 0.01ms is the global neutering rule doing its job; anything above a few
 * milliseconds is an animation that outran it, and a canvas rAF loop is
 * invisible to CSS entirely, so the canvas element's presence is checked
 * directly.
 */
const MOTION_PROBE = String.raw`(() => {
  ${HELPERS}
  const moving = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const dur = (s) => Math.max(0, ...String(s).split(',').map((v) => {
      v = v.trim();
      if (v.endsWith('ms')) return parseFloat(v);
      if (v.endsWith('s')) return parseFloat(v) * 1000;
      return 0;
    }));
    const anim = cs.animationName !== 'none' ? dur(cs.animationDuration) : 0;
    const trans = dur(cs.transitionDuration);
    if (anim > 5 || trans > 5) {
      moving.push({
        sel: describe(el),
        animation: cs.animationName !== 'none' ? cs.animationName + ' ' + cs.animationDuration : '',
        transition: trans > 5 ? cs.transitionProperty + ' ' + cs.transitionDuration : '',
      });
    }
  }
  const hiddenReveals = [...document.querySelectorAll('[data-reveal]')]
    .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
    .map(describe);
  return {
    moving: moving.slice(0, 20),
    movingCount: moving.length,
    hiddenReveals: hiddenReveals.slice(0, 10),
    hiddenRevealCount: hiddenReveals.length,
  };
})()`;

/**
 * Whether any canvas on the page is still repainting.
 *
 * A CSS media query cannot stop a `requestAnimationFrame` loop, so the
 * blanket `prefers-reduced-motion` block in globals.css §11 says nothing at
 * all about the field, the simulators, or any other canvas. And the presence
 * of a `<canvas>` element is not the question: `QuantumField` deliberately
 * paints exactly one static frame under reduced motion, on the grounds that a
 * still image of the physics is informative and a reader who asked for less
 * motion asked for less motion, not for less content. So the honest test is
 * whether the pixels change: hash each canvas now, wait, hash again.
 *
 * ~1.6s of waiting, because the field's phone tier runs at a 33ms frame
 * interval and several regimes evolve slowly enough that two samples 200ms
 * apart could plausibly match by accident.
 */
const CANVAS_STILLNESS_PROBE = String.raw`(async () => {
  ${HELPERS}
  const canvases = [...document.querySelectorAll('canvas')].filter(visible);
  const hash = (c) => {
    try {
      const g = c.getContext('2d');
      if (!g) return 'nocontext:' + describe(c);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let h = 2166136261;
      for (let i = 0; i < d.length; i += 4 * 13) {
        h ^= d[i] + d[i + 1] * 3 + d[i + 2] * 7 + d[i + 3] * 11;
        h = Math.imul(h, 16777619);
      }
      return String(h >>> 0);
    } catch (err) {
      return 'error:' + String(err && err.message);
    }
  };
  // Wait for the page to stop settling before deciding whether it is moving.
  // A static canvas legitimately repaints once after load: 'FieldRegimeSetter'
  // publishes the page's pillar from an effect, so 'QuantumField' re-reads its
  // colour ramp and repaints in the right hue a beat after hydration. That
  // repaint lands somewhere between one and three seconds in depending on how
  // busy the machine is, so a fixed delay cannot straddle it — a first version
  // used 900ms and reported all twelve routes as animating, every one of them
  // wrong. Poll until two consecutive samples agree instead, which is the
  // definition of settled, and which a running loop can never satisfy.
  let before = canvases.map(hash);
  let settled = false;
  for (let i = 0; i < 12 && !settled; i++) {
    await new Promise((r) => setTimeout(r, 400));
    const next = canvases.map(hash);
    settled = next.every((h, j) => h === before[j]);
    before = next;
  }
  if (!settled) {
    return canvases.map((c) => ({ sel: describe(c), changed: true, before: 'never settled', after: 'still repainting after 4.8s' }));
  }
  // Scroll between the two: scroll-linked motion is still motion, and the
  // field reads scroll through a subscription rather than a media query, so a
  // canvas that ignores time can still be driven by the wheel.
  window.scrollBy(0, 400);
  await new Promise((r) => setTimeout(r, 700));
  window.scrollBy(0, -400);
  await new Promise((r) => setTimeout(r, 700));
  const after = canvases.map(hash);
  return canvases
    .map((c, i) => ({ sel: describe(c), changed: before[i] !== after[i], before: before[i], after: after[i] }))
    .filter((entry) => entry.changed);
})()`;

/**
 * Text-only resize (WCAG 1.4.4). Doubling the root font size is the honest
 * emulation: browser zoom scales the viewport too, so a layout that is
 * entirely in `rem` survives zoom trivially and still clips when only the
 * text grows. Anything whose content is now taller than its own clipped box
 * has lost text a reader cannot get back.
 */
const CLIP_PROBE = String.raw`(() => {
  ${HELPERS}
  const clipped = [];
  // Three things clip on purpose and are not 1.4.4 failures:
  //
  //  - the visually-hidden idiom (.sr-only, and KaTeX's own .katex-mathml,
  //    which uses the same 1px-clip trick to keep MathML out of the visual
  //    render while leaving it in the accessibility tree). Their whole job is
  //    to have a 1px box around content that does not fit.
  //  - line-clamp, which is a deliberate n-line preview with an ellipsis;
  //    it truncates at every text size, so it is a content decision rather
  //    than something 200% text broke.
  //  - anything already hidden from assistive tech.
  //  - a pan/zoom surface. The concept map is a fixed-height frame onto a
  //    graph much larger than it, moved by a transform on its child; content
  //    exceeding the box is the whole feature, and it reported 1468px of
  //    content in a 560px box at every text size including 100%. The marker
  //    is specific rather than a size threshold: 'touch-action: none' (so the
  //    browser's own panning is suppressed in favour of a custom one) plus a
  //    child carrying a real transform (the pan/zoom matrix).
  const isPanSurface = (el, cs) => {
    if (cs.touchAction !== 'none') return false;
    return [...el.children].some((child) => {
      const t = getComputedStyle(child).transform;
      return t && t !== 'none';
    });
  };
  const deliberatelyClipped = (el, cs) => {
    if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') return true;
    if (isPanSurface(el, cs)) return true;
    let p = el;
    while (p) {
      const s = getComputedStyle(p);
      if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)') return true;
      if (p.getAttribute && p.getAttribute('aria-hidden') === 'true') return true;
      p = p.parentElement;
    }
    return false;
  };
  // ---- what is actually outside the clip ---------------------------------
  //
  // 'scrollHeight > clientHeight' is the cheap question and it is not the one
  // 1.4.4 asks. The success criterion is about *losing content*, and three of
  // the four things this returned on a real page were not content:
  //
  //   - a decorative glow. BlochSphereHeroExplorer paints an aria-hidden
  //     '-inset-10' radial blur behind the sphere, so it is 40px outside its
  //     own '<Instrument>' by construction, and the 'overflow-hidden' that
  //     trims it is the reason the glow reads as a lit panel rather than a
  //     halo hanging off one. Reported as 595px of box for 635px of content
  //     on both axes; the 40px was the glow, on purpose, at every text size.
  //   - a transparent hit area. PillarLessonStrip grows its footnote link to
  //     44px with the '-my-3.5 py-3.5' padding-cancelled-by-margin trick, so
  //     the link's border box is 14px taller than its line box while its
  //     text is not, and the strip's own 'py-2.5' is 10px. 4px of empty
  //     padding therefore sits outside the panel at 100% text and 8px at
  //     200%. Worth knowing (it shaves the target back to 40px) and not a
  //     1.4.4 clip: nothing readable is on those pixels.
  //   - the hero's h1, which genuinely did run a word off the page.
  //
  // So the question asked here is "is any *painted content* outside the
  // clip": the client rects of the container's own text runs, plus replaced
  // elements, measured through a Range so an element's padding never counts
  // as its content. The raw box numbers are still reported, because they are
  // what a reader of this output will re-measure; 'cause' names which of the
  // two cases it is.
  const CONTENT_TAGS = new Set(['IMG', 'CANVAS', 'VIDEO', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT', 'SVG']);

  /**
   * Advances the walker to the first node after node's whole subtree,
   * returning it, or null once the subtree is exhausted.
   *
   * This replaces two bugs that between them attributed clipped content to the
   * wrong element on nearly every route.
   *
   * The climb used to run up = up.parentNode; next = up.nextSibling while
   * up !== root, which means it could reach root itself and then take
   * **root's own next sibling**, a node entirely outside the subtree being
   * measured. The walker was then pointed there and happily carried on
   * through unrelated DOM, which is why a course card was reported as
   * clipping the footer's "StudyQuantum. All rights reserved."
   *
   * It then did walker.currentNode = next; walker.nextNode(), which returns
   * the node *after* next and so never tested next itself. A skipped
   * subtree immediately followed by a second one that also needed skipping
   * put a deliberately-hidden element straight into the measurement.
   */
  const skipSubtree = (walker, node, root) => {
    let next = null;
    for (let up = node; up && up !== root; up = up.parentNode) {
      if (up.nextSibling) { next = up.nextSibling; break; }
    }
    // Never leave the subtree, whatever the tree shape.
    if (!next || !root.contains(next)) return null;
    walker.currentNode = next;
    return next;
  };
  const contentOverflow = (root) => {
    const box = root.getBoundingClientRect();
    const cs = getComputedStyle(root);
    // The clip is the padding box, not the border box.
    const top = box.top + parseFloat(cs.borderTopWidth || 0);
    const left = box.left + parseFloat(cs.borderLeftWidth || 0);
    const right = left + root.clientWidth;
    const bottom = top + root.clientHeight;
    const range = document.createRange();
    let worst = { x: 0, y: 0, text: '' };
    const consider = (rects, label) => {
      for (const r of rects) {
        if (r.width === 0 && r.height === 0) continue;
        const overX = Math.max(left - r.left, r.right - right);
        const overY = Math.max(top - r.top, r.bottom - bottom);
        if (overX > worst.x) worst = { ...worst, x: Math.round(overX), text: label };
        if (overY > worst.y) worst = { ...worst, y: Math.round(overY), text: label };
      }
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip whole subtrees that are hidden, decorative or deliberately clipped.
        const ecs = getComputedStyle(node);
        if (
          node.getAttribute('aria-hidden') === 'true' ||
          node.hasAttribute('data-decorative') ||
          ecs.visibility === 'hidden' ||
          ecs.display === 'none' ||
          ecs.clip === 'rect(0px, 0px, 0px, 0px)' ||
          ecs.clipPath === 'inset(50%)' ||
          (ecs.webkitLineClamp && ecs.webkitLineClamp !== 'none')
        ) {
          node = skipSubtree(walker, node, root);
          continue;
        }
        // A descendant that clips or scrolls on its own account shows only
        // what fits inside its own box, so that box is what has to fit inside
        // root, and its contents are somebody else's problem (or reachable
        // by scrolling, which is not a 1.4.4 loss at all).
        //
        // Without this, text inside a legitimately scrollable region had its
        // true unclamped page position measured against the *outer* element's
        // edge. A wide equation inside .katex-display, which carries its own
        // overflow-x: auto and a keyboard tab stop, reported hundreds of
        // pixels of a "⟩" outside an ancestor panel. That number was not real,
        // and being the largest it also became worst, hiding the genuinely
        // clipped text sitting beside it.
        if (node !== root) {
          const clipsItself = (v) => v && v !== 'visible';
          if (clipsItself(ecs.overflowX) || clipsItself(ecs.overflowY)) {
            consider(
              [node.getBoundingClientRect()],
              (node.textContent || '').trim().slice(0, 45) || node.tagName.toLowerCase()
            );
            node = skipSubtree(walker, node, root);
            continue;
          }
        }
        if (CONTENT_TAGS.has(node.tagName.toUpperCase())) {
          consider([node.getBoundingClientRect()], node.tagName.toLowerCase());
        }
      } else if (node.nodeValue && node.nodeValue.trim()) {
        range.selectNodeContents(node);
        consider(range.getClientRects(), node.nodeValue.trim().slice(0, 45));
      }
      node = walker.nextNode();
    }
    return worst;
  };

  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (deliberatelyClipped(el, cs)) continue;
    const hiddenY = cs.overflowY === 'hidden' || cs.overflowY === 'clip';
    const hiddenX = cs.overflowX === 'hidden' || cs.overflowX === 'clip';
    const overY = hiddenY && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0;
    const overX = hiddenX && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0;
    if (!overY && !overX) continue;
    const lost = contentOverflow(el);
    if (overY) {
      clipped.push({
        sel: describe(el), axis: 'y', have: el.clientHeight, need: el.scrollHeight,
        lost: lost.y, cause: lost.y > 2 ? lost.text : '',
        text: (el.textContent || '').trim().slice(0, 45),
      });
    }
    if (overX) {
      clipped.push({
        sel: describe(el), axis: 'x', have: el.clientWidth, need: el.scrollWidth,
        lost: lost.x, cause: lost.x > 2 ? lost.text : '',
        text: (el.textContent || '').trim().slice(0, 45),
      });
    }
  }
  return {
    clipped: clipped.slice(0, 20),
    clippedCount: clipped.length,
    scrollW: document.documentElement.scrollWidth,
    vw: document.documentElement.clientWidth,
  };
})()`;

// ---------------------------------------------------------------------------
// Paint contrast — the ground a reader actually gets
// ---------------------------------------------------------------------------
//
// responsive.mjs composites the DOM background stack on a canvas, which is
// correct as far as it goes and cannot go far enough on this site. Two of the
// layers behind body text are not ancestors of it and never appear in that
// walk:
//
//   .atmosphere   (globals.css §10, z-index -20) — two pillar-tinted radial
//                   pools and a vertical density ramp, painted by PillarScope
//   .field-canvas (z-index -10) — the animated environment, whose pixels are
//                   whatever regimes.ts drew this frame
//
// Both are position: fixed siblings behind the whole page, so text sitting
// on the page ground is read over --depth-0 *plus both of them*, and the
// DOM-walking checker reports the ratio against --depth-0 alone.
// compositedContrast.test.ts models the atmosphere analytically and models
// the canvas not at all, because a rAF-driven canvas has no closed form.
//
// So: hide every glyph, photograph the page, and read the real pixels. What
// comes back is the exact ground the reader's eye lands on, with no model in
// the way — every layer, in paint order, at the frame that was on screen.
//
// The measurement is deliberately worst-case rather than average. A field
// regime draws bright particles on a dark ground; averaging the box behind a
// line of text would hide exactly the pixel where a glyph crosses a particle,
// which is the pixel that decides whether the line is readable.

/** Makes every glyph transparent without moving a single box. */
const HIDE_INK = String.raw`(() => {
  const s = document.createElement('style');
  s.id = '__a11y-hide-ink';
  s.textContent =
    // 'text-decoration: none', not a transparent decoration colour. The
    // colour form does not take here (Tailwind's 'decoration-*' utility
    // survives it), and the line has to go for a reason beyond stubbornness:
    // a line box includes descender space, so an 'underline-offset-2' rule
    // sits INSIDE the range rect of the text above it. Left painted, the
    // underline is sampled as though it were the ground behind the glyphs,
    // and a 12px --subtle-foreground link underlined in --border-strong
    // reports 2.38:1 against its own underline. Text is not required to
    // contrast with its own decoration.
    '*,*::before,*::after{color:transparent !important;-webkit-text-fill-color:transparent !important;text-shadow:none !important;text-decoration:none !important}' +
    'svg text,svg tspan{fill:transparent !important}' +
    // The dev server's error/route overlay is a shadow-root portal that is
    // pointer-events:none, so it paints over the bottom-left corner of every
    // page while elementFromPoint sees straight through it. The occlusion
    // filter therefore cannot exclude what it covers, and it produced two
    // confident 1.3:1 blockers against a grey that exists only in dev.
    'nextjs-portal{display:none !important}';
  document.head.appendChild(s);
})()`;

const SHOW_INK = String.raw`(() => {
  document.getElementById('__a11y-hide-ink')?.remove();
})()`;

/** Every text run currently on screen, with the box its glyphs occupy. */
const TEXT_RECTS_PROBE = String.raw`(() => {
  ${HELPERS}
  const out = [];
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
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (text.length < 3) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (!visible(el) || srOnly(el)) continue;
    const cs = getComputedStyle(el);
    if (Number(cs.opacity) === 0) continue;
    // The glyphs, not the block: a paragraph's box is mostly empty space to
    // the right of its last line, and a heading's box includes its leading.
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (!rects.length) continue;
    const inView = rects.filter((r) => r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth);
    if (!inView.length) continue;
    // Drop any run the sticky header (or the dev overlay) is painting over.
    // The screenshot shows what is on top; the glyphs underneath it are not
    // what a reader is reading, and scoring a paragraph against the brand
    // button parked on top of it is a confident, wrong blocker.
    // Nine points, not one: a line whose *middle* is clear can still have its
    // ascenders under a sticky header, and the pixels the header is painting
    // are the ones this check would otherwise score the text against. The
    // brand button in the navbar is a solid indigo, so a paragraph scrolling
    // under it reported 1.16:1 and was entirely an artefact.
    const unoccluded = inView.filter((r) => {
      const xs = [r.left + 1, (r.left + r.right) / 2, r.right - 1];
      const ys = [r.top + 1, r.top + r.height / 2, r.bottom - 1];
      for (const y of ys) {
        for (const x of xs) {
          const hit = document.elementFromPoint(x, y);
          if (!hit) return false;
          if (hit !== el && !el.contains(hit) && !hit.contains(el)) return false;
        }
      }
      return true;
    });
    if (!unoccluded.length) continue;
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    out.push({
      sel: describe(el),
      color: cs.color,
      size,
      required: size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5,
      text: text.slice(0, 45),
      rects: unoccluded.slice(0, 3).map((r) => [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]),
    });
  }
  return out.slice(0, 400);
})()`;

/**
 * Decodes the ink-free screenshot inside the page and returns, for each text
 * run, the worst contrast any pixel behind its glyphs produces.
 *
 * Decoding in the page rather than in Node is what makes this dependency-free:
 * the browser already has a PNG decoder and a compositor, and handing the
 * picture back to the tab that produced it costs one base64 round trip and no
 * image library.
 */
const SAMPLE_GROUND = String.raw`(async (png, runs) => {
  const img = new Image();
  img.src = 'data:image/png;base64,' + png;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  // The screenshot is in device pixels; the rects are in CSS pixels.
  const scale = img.naturalWidth / document.documentElement.clientWidth;

  const srgbToLin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (r, gg, b) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(gg) + 0.0722 * srgbToLin(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  // The text colour itself may be translucent, so paint it over each sampled
  // pixel rather than using it raw.
  const sw = document.createElement('canvas');
  sw.width = 1; sw.height = 1;
  const sctx = sw.getContext('2d', { willReadFrequently: true });
  const over = (color, r, gg, b) => {
    sctx.clearRect(0, 0, 1, 1);
    sctx.fillStyle = 'rgb(' + r + ',' + gg + ',' + b + ')';
    sctx.fillRect(0, 0, 1, 1);
    sctx.fillStyle = color;
    sctx.fillRect(0, 0, 1, 1);
    const d = sctx.getImageData(0, 0, 1, 1).data;
    return lum(d[0], d[1], d[2]);
  };

  const results = [];
  for (const run of runs) {
    let worst = null;
    let sampled = 0;
    let failing = 0;
    for (const [x, y, w, h] of run.rects) {
      const px = Math.max(1, Math.round(x * scale));
      const py = Math.max(1, Math.round(y * scale));
      const pw = Math.max(1, Math.round(w * scale));
      const ph = Math.max(1, Math.round(h * scale));
      if (px + pw > c.width || py + ph > c.height) continue;
      const data = g.getImageData(px, py, pw, ph).data;
      // Every pixel would be exact and far too slow on a 1280px hero; a stride
      // of 2 device px in each axis still lands inside any particle big enough
      // for an eye to notice.
      const stepX = Math.max(1, Math.floor(pw / 40));
      const stepY = Math.max(1, Math.floor(ph / 12));
      for (let j = 0; j < ph; j += stepY) {
        for (let i = 0; i < pw; i += stepX) {
          const o = (j * pw + i) * 4;
          const bl = lum(data[o], data[o + 1], data[o + 2]);
          const fl = over(run.color, data[o], data[o + 1], data[o + 2]);
          const r = ratio(fl, bl);
          sampled++;
          if (r < run.required) failing++;
          if (!worst || r < worst.ratio) {
            worst = {
              ratio: r,
              rgb: [data[o], data[o + 1], data[o + 2]],
              at: [Math.round(x + i / scale), Math.round(y + j / scale)],
            };
          }
        }
      }
    }
    if (worst && worst.ratio < run.required) {
      results.push({
        sel: run.sel,
        text: run.text,
        size: run.size,
        color: run.color,
        required: run.required,
        ratio: Math.round(worst.ratio * 100) / 100,
        bg: 'rgb(' + worst.rgb.join(',') + ')',
        at: worst.at,
        // How much of the run is affected. One stray pixel where a hairline
        // crosses a stem is a different defect from a whole line sitting in a
        // bright pool, and the fix for each is different, so the report has to
        // be able to tell them apart.
        share: Math.round((failing / sampled) * 100),
      });
    }
  }
  return results;
})`;

/**
 * One measurement pass at the current scroll position: photograph without ink,
 * then ask the page to read its own pixels.
 */
async function measurePaintContrast(page) {
  const runs = await page.eval(TEXT_RECTS_PROBE);
  if (!runs.length) return [];
  await page.eval(HIDE_INK);
  const png = await page.screenshot({ raw: true });
  await page.eval(SHOW_INK);
  return page.eval(`(${SAMPLE_GROUND})(${JSON.stringify(png)}, ${JSON.stringify(runs)})`);
}

// ---------------------------------------------------------------------------
// AX-tree analysis (runs in Node against Chrome's computed tree)
// ---------------------------------------------------------------------------

const LANDMARK_ROLES = new Set([
  "navigation",
  "region",
  "form",
  "search",
  "complementary",
  "banner",
  "contentinfo",
  "main",
]);

/** Roles a keyboard user can reach and operate, which therefore need a name. */
const NAMED_CONTROL_ROLES = new Set([
  "button",
  "link",
  "checkbox",
  "radio",
  "textbox",
  "combobox",
  "slider",
  "switch",
  "tab",
  "menuitem",
  "searchbox",
  "spinbutton",
  "listbox",
]);

function axValue(node, key) {
  const v = node?.[key];
  return v && typeof v === "object" ? v.value : v;
}

function analyzeAx(nodes) {
  const findings = [];
  const byRole = new Map();
  const linkNames = new Map();

  for (const node of nodes) {
    if (node.ignored) continue;
    const role = axValue(node, "role");
    const name = (axValue(node, "name") ?? "").toString().trim();
    if (!role) continue;

    if (LANDMARK_ROLES.has(role)) {
      if (!byRole.has(role)) byRole.set(role, []);
      byRole.get(role).push(name);
    }

    if (NAMED_CONTROL_ROLES.has(role)) {
      const disabled = node.properties?.some((p) => p.name === "disabled" && p.value?.value);
      if (!name && !disabled) {
        findings.push({
          kind: "control-no-name",
          detail: `${role} with no accessible name (nodeId ${node.nodeId})`,
        });
      }
      if (name.length > 120) {
        findings.push({
          kind: "name-is-a-paragraph",
          detail: `${role} name is ${name.length} chars: ${JSON.stringify(name.slice(0, 110))}…`,
        });
      }
      if (role === "link" && name) {
        // Keyed by name, valued by the set of destinations wearing it. Three
        // links reading "Glossary" that all go to /glossary are a header, a
        // footer and a body link, which is not ambiguous to anybody; three
        // reading "Learn more" that go to three different courses is the
        // failure this check exists for.
        const key = name.toLowerCase();
        const url = node.properties?.find((p) => p.name === "url")?.value?.value ?? "";
        if (!linkNames.has(key)) linkNames.set(key, new Set());
        linkNames.get(key).add(url);
      }
    }
  }

  for (const [role, names] of byRole) {
    if (names.length < 2) continue;
    const unnamed = names.filter((n) => !n).length;
    if (unnamed) {
      findings.push({
        kind: "landmark-unnamed",
        detail: `${names.length} ${role} landmarks, ${unnamed} unnamed (named: ${names.filter(Boolean).map((n) => JSON.stringify(n)).join(", ") || "none"})`,
      });
    }
    const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
    if (dupes.length) {
      findings.push({ kind: "landmark-duplicate-name", detail: `${role}: ${[...new Set(dupes)].map((n) => JSON.stringify(n)).join(", ")}` });
    }
  }

  for (const [name, urls] of linkNames) {
    if (urls.size >= 2 && name.length < 60) {
      findings.push({
        kind: "ambiguous-link-name",
        detail: `${urls.size} destinations share the name ${JSON.stringify(name)}: ${[...urls].map((u) => u.replace(/^https?:\/\/[^/]+/, "")).slice(0, 5).join(", ")}`,
      });
    }
  }

  return findings;
}

/** Every accessible name in the tree, for verifying a suspected dropped label. */
function allNames(nodes) {
  const set = new Set();
  for (const node of nodes) {
    const n = (axValue(node, "name") ?? "").toString().trim();
    if (n) set.add(n);
  }
  return set;
}

/** What a rendered formula is actually announced as. */
function mathNames(nodes) {
  const out = [];
  for (const node of nodes) {
    if (node.ignored) continue;
    const role = axValue(node, "role");
    if (role !== "math" && role !== "MathMLMath") continue;
    out.push((axValue(node, "name") ?? "").toString().trim());
  }
  return out;
}

// ---------------------------------------------------------------------------
// Runners
// ---------------------------------------------------------------------------

async function setTheme(page, theme) {
  // The site's own storage key, read by the no-flash script in layout.tsx.
  await page.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `try{localStorage.setItem("studyquantum:theme",${JSON.stringify(theme)})}catch(e){}`,
  });
}

async function walkTabOrder(page, limit) {
  const seq = [];
  const findings = [];
  // Start the walk at the top of the document, for real.
  //
  // `blur()` does not do it: it clears focus but leaves the browser's
  // *sequential focus navigation starting point* where it was, so the next
  // Tab resumes from the middle of the page, runs to the end, and wraps —
  // and the wrap then reads as a 4000px backwards jump to the skip link.
  // Focusing `<body>` moves the starting point, and body has to be given a
  // `tabindex` for that to be allowed at all. Removed again immediately so
  // the walk does not measure a tab stop this harness invented.
  await page.eval(`(() => {
    window.scrollTo(0, 0);
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
    document.body.removeAttribute('tabindex');
  })()`);
  let stuck = 0;
  for (let i = 0; i < limit; i++) {
    await page.pressKey("Tab");
    const info = await page.eval(FOCUS_PROBE);
    if (info && info.dev) continue;
    if (!info || info.body) {
      // Focus left the document (browser chrome). One is the natural wrap;
      // repeated is a page with almost nothing focusable.
      seq.push({ sel: "(document)", body: true });
      continue;
    }
    const prev = seq[seq.length - 1];
    // Identity includes the accessible text, not just the selector and the
    // box. The concept map re-centres its viewport on whichever node takes
    // focus, deliberately, so 30 different nodes report the same class list
    // at the same coordinates and a position-only comparison calls the whole
    // graph a focus trap.
    if (prev && prev.sel === info.sel && prev.text === info.text && prev.x === info.x && prev.y === info.y) {
      stuck++;
      if (stuck >= 2) {
        findings.push({ kind: "focus-trap", detail: `Tab does not advance past ${info.sel} ${JSON.stringify(info.text)}` });
        break;
      }
    } else {
      stuck = 0;
    }
    if (!info.outlined && !info.ringed) {
      findings.push({
        kind: "no-focus-indicator",
        detail: `${info.sel} ${JSON.stringify(info.text)} — outline:${info.outline}, no painted ring on it or any of its four nearest ancestors`,
      });
    }
    seq.push(info);
    // A wrap back to the first element means the order is exhausted.
    if (seq.length > 2 && info.sel === seq[0].sel && info.text === seq[0].text && info.y === seq[0].y) break;
  }

  // Focus order vs. visual order: a backwards jump of more than a viewport is
  // the reader being thrown across the page.
  //
  // The final wrap is not one of those. When Tab runs off the end of the
  // document it goes back to the first control, which on every page here is
  // the skip link at y=8 — a legitimate 4000px "jump back" that was reported
  // on three routes before this line existed.
  // Truncate at the wrap. Tab running off the end of the document returns to
  // the first control, which on every page here is the skip link at y=8, and
  // that read as a 4000px backwards leap on three routes. Comparing against
  // `real[0]` is not enough, because `blur()` does not reset the browser's
  // sequential-focus starting point: the walk can begin in the middle of the
  // page and wrap to something it never recorded as first. A destination that
  // has already been visited is the general form of the same thing, and a
  // correct tab order never revisits.
  const real = [];
  const seen = new Set();
  for (const stop of seq) {
    if (stop.body) continue;
    const key = `${stop.sel}|${stop.text}|${stop.y}`;
    if (seen.has(key)) break;
    seen.add(key);
    real.push(stop);
  }

  for (let i = 1; i < real.length; i++) {
    const a = real[i - 1];
    const b = real[i];
    if (b.y < a.y - 400) {
      findings.push({
        kind: "focus-order-jump",
        detail: `${a.sel} (y=${a.y}) -> ${b.sel} (y=${b.y}) jumps back ${a.y - b.y}px`,
      });
    }
  }
  return { seq: real, findings };
}

/**
 * Every overlay the chrome can open, driven from the keyboard end to end.
 *
 * The contract `docs/DESIGN_SYSTEM.md` §9 states, and that `Navbar`'s
 * `TracksDropdown` is held up as the reference implementation of: a
 * disclosure closes on Escape, and focus goes back to the control that opened
 * it rather than to `<body>`, which restarts the tab order at the top of the
 * document and is a keyboard dead end.
 *
 * Driven with real key events rather than `el.click()`, because half of what
 * is being tested is what the browser does with a keypress: Enter on a
 * focused `<button>` is a click, Escape has to reach a document-level
 * listener, and focus restoration only means anything if focus was somewhere
 * real to begin with.
 */
async function auditOverlays(page, route) {
  const findings = [];
  const check = async (name, selector) => {
    await page.goto(`${BASE}${route}`);
    const found = await page.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      // The chrome hides the hamburger above lg and the tracks dropdown below
      // it, so at any one width two of these three triggers are in the DOM
      // and not on the screen. A hidden control is not a broken control.
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null;
      el.focus();
      return {
        expanded: el.getAttribute('aria-expanded'),
        controls: el.getAttribute('aria-controls'),
        focused: document.activeElement === el,
      };
    })()`);
    if (!found) return; // not present at this width or on this route
    if (!found.focused) {
      findings.push({ level: "BLOCKER", kind: "overlay-trigger-not-focusable", detail: `${name}: ${selector}` });
      return;
    }

    await page.pressKey("Enter");
    await new Promise((r) => setTimeout(r, 250));
    const opened = await page.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const controls = el && el.getAttribute('aria-controls');
      return {
        expanded: el && el.getAttribute('aria-expanded'),
        panelPresent: controls ? Boolean(document.getElementById(controls)) : null,
        activeInPanel: (() => {
          const panel = controls && document.getElementById(controls);
          return panel ? panel.contains(document.activeElement) : null;
        })(),
        dialogs: [...document.querySelectorAll('[role="dialog"]')].filter((d) => d.offsetParent !== null || getComputedStyle(d).position === 'fixed').length,
      };
    })()`);
    if (opened.expanded !== "true" && opened.dialogs === 0) {
      findings.push({ level: "BLOCKER", kind: "overlay-did-not-open", detail: `${name}: Enter on the trigger left aria-expanded=${opened.expanded}` });
      return;
    }
    if (opened.panelPresent === false) {
      findings.push({
        level: "BLOCKER",
        kind: "overlay-aria-controls-dangling",
        detail: `${name}: aria-controls names an id that is not in the document while open`,
      });
    }

    await page.pressKey("Escape");
    await new Promise((r) => setTimeout(r, 250));
    const closed = await page.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      return {
        expanded: el && el.getAttribute('aria-expanded'),
        dialogs: [...document.querySelectorAll('[role="dialog"]')].length,
        activeIsTrigger: document.activeElement === el,
        active: document.activeElement ? (document.activeElement.tagName + (document.activeElement.id ? '#' + document.activeElement.id : '')) : 'none',
      };
    })()`);
    if (closed.expanded === "true" || closed.dialogs > 0) {
      findings.push({ level: "BLOCKER", kind: "escape-does-not-close", detail: `${name}: still open after Escape (expanded=${closed.expanded}, dialogs=${closed.dialogs})` });
      return;
    }
    if (!closed.activeIsTrigger) {
      findings.push({
        level: "BLOCKER",
        kind: "focus-not-restored",
        detail: `${name}: after Escape focus is on ${closed.active}, not the trigger that opened it`,
      });
    }
  };

  await check("search overlay", '[aria-haspopup="dialog"]');
  await check("navbar tracks dropdown", 'button[aria-controls="tracks-dropdown-panel"], header nav button[aria-expanded]');
  await check("navbar mobile menu", '[aria-label="Open menu"], [aria-label="Close menu"]');
  return findings;
}

async function auditRoute(page, route, report) {
  const add = (level, kind, detail) => report.push({ route, level, kind, detail });

  const { timedOut, skeleton } = await page.goto(`${BASE}${route}`);
  if (timedOut) {
    // Same reasoning as `responsive.mjs`: a route that never fired `load` is
    // still measured, and a half-rendered page reports clean.
    add("BLOCKER", "load-timeout", "the load event never fired within 45s; findings below were measured on a half-rendered page");
  }
  if (skeleton !== "cleared") {
    // The route is still showing its `loading.tsx`. Every check below would
    // then be measuring the skeleton, which has no headings, no landmarks and
    // almost no controls, so it reports *clean* on everything except heading
    // count. Saying so is the whole point: an unmeasured route must never look
    // like a passing one.
    add(
      "BLOCKER",
      "unmeasured-skeleton",
      `the loading skeleton was still on screen after the settle (${skeleton}); every finding for this route is about the skeleton, not the page`
    );
  }

  if (CHECKS.has("semantics")) {
    const dom = await page.eval(SEMANTICS_PROBE);
    const nodes = await page.axTree();
    const names = allNames(nodes);

    for (const f of dom) {
      if (f.kind === "live-region") {
        if (VERBOSE) add("INFO", f.kind, f.detail);
        continue;
      }
      if (f.kind === "name-prohibited-role") {
        // Verified, not assumed: if the label made it into the AX tree the
        // browser kept it and this is a false positive.
        if (names.has(f.name.trim())) continue;
        add("BLOCKER", f.kind, f.detail + " — label absent from the AX tree");
        continue;
      }
      add(f.kind === "svg-undeclared" ? "WARN" : "BLOCKER", f.kind, f.detail);
    }

    for (const f of analyzeAx(nodes)) {
      add(f.kind === "ambiguous-link-name" || f.kind === "landmark-duplicate-name" ? "WARN" : "BLOCKER", f.kind, f.detail);
    }

    const math = mathNames(nodes);
    if (math.length && VERBOSE) {
      add("INFO", "math-names", `${math.length} math nodes; first: ${math.slice(0, 3).map((m) => JSON.stringify(m)).join(" | ")}`);
    }
  }

  if (CHECKS.has("keyboard")) {
    // Skip link: first Tab must reach it, Enter must move real focus.
    await page.eval(`window.scrollTo(0,0)`);
    await page.pressKey("Tab");
    const first = await page.eval(FOCUS_PROBE);
    if (!/skip/i.test(first?.text ?? "")) {
      add("BLOCKER", "skip-link-not-first", `first Tab landed on ${first?.sel} ${JSON.stringify(first?.text ?? "")}`);
    } else {
      if (!first.inViewport || first.w === 0) {
        add("BLOCKER", "skip-link-invisible", `focused skip link is not visible (${first.w}x${first.h} at y=${first.y})`);
      }
      await page.pressKey("Enter");
      const landed = await page.eval(`(() => { const el = document.activeElement; return el ? (el.id || el.tagName.toLowerCase()) : 'none'; })()`);
      if (landed !== "main-content") {
        add("BLOCKER", "skip-link-target", `after Enter, focus is on ${JSON.stringify(landed)} rather than #main-content`);
      }
    }

    const { seq, findings } = await walkTabOrder(page, TABS);
    for (const f of findings) add(f.kind === "no-focus-indicator" ? "BLOCKER" : "WARN", f.kind, f.detail);
    if (VERBOSE) add("INFO", "tab-order", `${seq.length} stops: ${seq.slice(0, 12).map((s) => s.sel).join(" > ")}`);
  }

  if (CHECKS.has("overlay")) {
    for (const f of await auditOverlays(page, route)) add(f.level, f.kind, f.detail);
  }

  if (CHECKS.has("motion")) {
    await page.emulateMedia([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(`${BASE}${route}`);
    const m = await page.eval(MOTION_PROBE);
    for (const el of m.moving) {
      add("BLOCKER", "motion-not-stopped", `${el.sel} ${el.animation} ${el.transition}`.trim());
    }
    for (const c of await page.eval(CANVAS_STILLNESS_PROBE)) {
      add("BLOCKER", "canvas-still-animating", `${c.sel} repaints under prefers-reduced-motion: reduce (${c.before} -> ${c.after})`);
    }
    if (m.hiddenRevealCount) {
      add("BLOCKER", "reveal-hidden-under-reduced-motion", `${m.hiddenRevealCount}: ${m.hiddenReveals.join(", ")}`);
    }
    await page.emulateMedia([]);
  }

  if (CHECKS.has("paint")) {
    await page.goto(`${BASE}${route}`);
    // Four scroll positions rather than one: the atmosphere and the canvas are
    // both `position: fixed`, so the ground under a given paragraph changes
    // completely as the page moves under them. The top of the page is also the
    // least representative sample there is — it is where the pillar glow pool
    // is densest and where the least content sits.
    const height = await page.eval(`document.documentElement.scrollHeight - window.innerHeight`);
    for (const fraction of [0, 0.3, 0.6, 0.9]) {
      const y = Math.round(Math.max(0, height) * fraction);
      await page.eval(`window.scrollTo(0, ${y})`);
      await new Promise((r) => setTimeout(r, 350));
      for (const f of await measurePaintContrast(page)) {
        add(
          "BLOCKER",
          "paint-contrast",
          `${f.sel} ${f.ratio}:1 (needs ${f.required}) on ${f.share}% of the run — ${f.size}px ${f.color} on ${f.bg} at viewport ${f.at.join(",")}, scrollY ${y} | ${JSON.stringify(f.text)}`
        );
      }
    }
  }

  if (CHECKS.has("resize")) {
    await page.goto(`${BASE}${route}`);
    await page.eval(`(() => {
      const s = document.createElement('style');
      s.id = '__a11y-text-resize';
      s.textContent = ':root{font-size:32px !important}';
      document.head.appendChild(s);
    })()`);
    await new Promise((r) => setTimeout(r, 500));
    const c = await page.eval(CLIP_PROBE);
    for (const el of c.clipped) {
      const box = `${el.sel} ${el.axis}: ${el.have}px box for ${el.need}px content`;
      if (el.lost > 2) {
        add(
          "BLOCKER",
          "clipped-at-200pct-text",
          `${box} — ${el.lost}px of ${JSON.stringify(el.cause)} is outside the clip`
        );
      } else {
        // The box overflows and nothing readable is on the overflowing pixels:
        // a decorative layer or a transparent hit area. Printed, not blocking.
        add(
          "INFO",
          "clipped-decoration-at-200pct-text",
          `${box}, but no text or replaced element is outside the clip | ${JSON.stringify(el.text)}`
        );
      }
    }
    if (c.scrollW > c.vw + 1) {
      add("BLOCKER", "sideways-scroll-at-200pct-text", `scrollWidth ${c.scrollW} > ${c.vw}`);
    }
  }
}

async function main() {
  const chrome = await launchChrome({ port: 9334 });
  const report = [];
  try {
    const page = await Page.open(chrome.port, { width: WIDTH, height: 900, mobile: WIDTH < 768 });
    await setTheme(page, THEME);
    for (const route of ROUTES) {
      try {
        await auditRoute(page, route, report);
      } catch (err) {
        report.push({ route, level: "BLOCKER", kind: "harness", detail: String(err.message ?? err) });
      }
      process.stderr.write(`  ${route} done\n`);
    }
    await page.close();
  } finally {
    await chrome.close();
  }

  const byKind = new Map();
  for (const f of report) {
    const key = `${f.level}/${f.kind}`;
    if (!byKind.has(key)) byKind.set(key, []);
    byKind.get(key).push(f);
  }
  console.log(`\n=== a11y audit: ${ROUTES.length} routes @ ${WIDTH}px, ${THEME} theme, checks=${[...CHECKS].join("+")} ===\n`);
  for (const [key, list] of [...byKind.entries()].sort()) {
    console.log(`${key}  (${list.length})`);
    for (const f of list) console.log(`   ${f.route}\n         ${f.detail}`);
    console.log("");
  }
  const blockers = report.filter((f) => f.level === "BLOCKER").length;
  if (!report.length) console.log("no findings");
  console.log(`blockers: ${blockers}`);
  process.exit(blockers > 0 ? 1 : 0);
}

// Guarded for the same reason as `responsive.mjs`: `A11Y_ROUTES` is imported
// by `routeInventory.test.ts`, and a top-level `main()` would launch Chrome
// inside the vitest worker.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
