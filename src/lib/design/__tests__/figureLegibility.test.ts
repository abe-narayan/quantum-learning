import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ============================================================
 * A hand-rolled SVG figure must paint legible type
 * ============================================================
 * The sibling `scrollRegions.test.ts` guards one half of this hazard: a
 * scroll container a keyboard user cannot reach. This file guards the half
 * that makes the scroll container *dead in the first place*.
 *
 * THE ARITHMETIC
 * --------------
 * An `<svg>` written with an intrinsic `width={N}` renders N CSS pixels wide,
 * so one viewBox unit is one CSS pixel and authored type paints at its face
 * value. Add `className="w-full"` and `width: 100%` beats the `width`
 * attribute: the figure now scales to its container, one unit becomes
 * (box / viewBoxWidth) pixels, and every label shrinks with it.
 *
 * The reference box for a figure in one frame is 254px — a 320px viewport,
 * less the page `Container`'s 32px of `px-4` gutters, less a figure frame's
 * `panel-inset p-4` (16px of padding and a 1px border on each side; the
 * `panel-inset` class itself supplies border, radius and fill and no padding
 * at all). It is NOT the 288px the page column measures, and a run of
 * comments in this tree got that wrong in both directions before it was
 * settled. A figure in *two* frames — every simulator, when embedded in a
 * lesson — used to be charged 34px twice and got 220px; `InteractiveSection`
 * now refunds the outer frame below `sm`, so all three covered roots are back
 * on 254px. The box stays a per-directory measurement in COVERED_ROOTS rather
 * than one constant, because the shells can diverge again and the previous
 * time they did it went unnoticed for as long as the number was assumed. So:
 *
 *     effective px = fontSize x box / viewBoxWidth   (when the svg is w-full)
 *     effective px = fontSize                        (at intrinsic width)
 *
 * Under ~9px is illegible. Seven lesson SVGs shipped `w-full` on a
 * hand-rolled figure inside an `overflow-x-auto` wrapper and painted their
 * type at 2.8px to 6.0px, and the wrapper never scrolled to compensate,
 * because a `w-full` figure by construction never overflows: it shrinks. The
 * two defects are the same defect. All seven are fixed; this file is what
 * stops the eighth.
 *
 * WHAT THIS TEST CANNOT DO, AND HOW IT COMPENSATES
 * -----------------------------------------------
 * Real rendered width depends on layout, so a lexical scan cannot settle
 * every figure by reading a class name. Four things are modelled rather than
 * given up on, because between them they cover almost every figure here:
 *
 *   - module-scope numeric constants, so `viewBox={`0 0 ${WIDTH} ${HEIGHT}`}`
 *     with `fontSize={TICK_FONT}` — how every component figure in this tree
 *     is written — resolves to real numbers.
 *   - module-scope string constants, so a gate hoisted into
 *     `const LEGEND_SVG_GATE = "hidden @min-[340px]:block";` and applied as
 *     `className={LEGEND_SVG_GATE}` reads as its literal rather than as an
 *     opaque expression.
 *   - the responsive pair this tree writes as `block … @min-[400px]:hidden`
 *     (the phone half, genuinely painted at the root's own box) beside
 *     `hidden … @min-[400px]:block` (the wide half, `display: none` until the
 *     container reaches N, so measured against N instead).
 *   - the same gate applied *inside* a figure, to a `<g>` holding a legend
 *     while the rest of the figure paints at every width. That type's
 *     narrowest painted width is the gate's, not the figure's, so it is
 *     scored separately from its ungated siblings (see `gatedRegions`).
 *
 * What is left over is handled by *demanding a measurement* rather than by
 * guessing: `className={expr}` (the classes come from a prop, so whether the
 * figure is `w-full` is the caller's choice, not this file's to read), a
 * container query in any other shape, and a viewBox or fontSize that is not a
 * resolvable number. Each such figure must carry an entry in
 * EXCUSED_UNDER_FLOOR with the measurement that settles it, exactly as
 * `scrollRegions.test.ts` does for containers it cannot prove overflow for,
 * and on the same ratchet: the list may only shrink.
 */

const SRC = path.resolve(import.meta.dirname, "../../..");

/**
 * Directories scanned, each with the narrowest real content box a figure in
 * that directory is painted in, in CSS pixels.
 *
 * THIS MAP MAY ONLY GROW. It is deliberately not "all of src": the box a
 * figure renders into depends on the shell around it, and guessing at that
 * box instead of measuring it is precisely the mistake this arithmetic exists
 * to stop. So a root is added only together with its measured width.
 *
 *   `content/lessons` and `components/visualizations` -> **254px**. A lesson
 *   figure sits in one frame: `Container px-4` gives a 288px column at a 320px
 *   viewport, and a `panel-inset p-4` / `InteractiveSection` figure frame takes
 *   2 x (16px padding + 1px border) = 34px out of it. 288 - 34 = 254.
 *
 *   `components/simulators` -> **254px**, and it used to be 220px. Every one
 *   of the 14 simulators is embedded in lessons as well as standing on the
 *   `/simulators` bench, and a lesson embed used to be framed *twice*:
 *   `InteractiveSection` is an `.instrument` with a `p-4` body, and the
 *   simulator's own `SimulatorInstrument` is a second one inside it. The
 *   de-framing selector (`has-[[data-mdx-slot=embed]_.instrument]`) switched
 *   off the outer wrapper's border *colour*, wash and shadow but not its 1px
 *   border box or its 16px of padding, so both frames were charged:
 *   288 - 34 - 34 = 220, against the 254 the bench gave the same component.
 *   That gap is what had four canvases here painting 8.0-8.8px type in every
 *   lesson while clearing the floor on the bench. `InteractiveSection` now
 *   gives the 34px back below `sm` (`border-0` on the de-framed wrapper plus
 *   `-mx-4` on the embed slot), so the embed and the bench agree at 288 - 34
 *   = 254. Verified against the served markup on the dev server for
 *   `sources-of-noise`, `the-bloch-sphere` and `building-quantum-circuits`.
 *   Above `sm` the wrapper keeps its padding on purpose: reclaiming it there
 *   would push the simulator's own body past the 672px `@min-[42rem]` split
 *   gate inside the 736px reading column. See `InteractiveSection`'s
 *   "What the de-framed wrapper still costs" comment for the full derivation.
 *
 *   Note the limit of this map, unchanged by that: each number is the *shell*
 *   box, not a per-figure one. A simulator that sinks its canvas into a
 *   further well inside its own body gets less, and the one real instance is
 *   `WavefunctionHeroExplorer`, whose `rounded-panel border p-3` gives
 *   `WavefunctionCanvas` 254 - 26 = 228px on the homepage. It does not bind:
 *   that canvas's only in-SVG type is gated `hidden @min-[340px]:block` and
 *   is therefore scored at 340px, not at the root box, in either direction.
 */
const COVERED_ROOTS: Record<string, number> = {
  "content/lessons": 254,
  "components/visualizations": 254,
  "components/simulators": 254,
};

/**
 * The default reference box, in CSS pixels: one figure frame in a lesson
 * column. 320 (viewport) - 32 (Container px-4) - 2 x (16 p-4 + 1 border) = 254.
 * Used by the fixtures below and by any figure measured outside a covered root.
 */
const NARROW_BOX = 254;

/**
 * Effective type below this many CSS pixels is not readable.
 *
 * Compared against the effective size rounded to the hundredth, which is the
 * precision every measurement note in this tree quotes. It matters: the
 * `TICK_FONT = 17` several of these figures were deliberately sized to is
 * 17 x 254/480 = 8.99583, and their own headers call that 9.00px and treat it
 * as sitting on the floor. Comparing the unrounded value would fail figures
 * that were tuned to this exact rule.
 */
const LEGIBILITY_FLOOR = 9;

/** Tailwind's named `max-w-*` scale, in CSS pixels. */
const MAX_W_SCALE: Record<string, number> = { xs: 320, sm: 384, md: 448, lg: 512, xl: 576, "2xl": 672 };

/** The narrowest width a `max-w-*` class allows, or null when it sets none. */
function maxWidthCap(className: string): number | null {
  const arbitrary = /(?<![-\w])max-w-\[(\d+)px\]/.exec(className);
  if (arbitrary) return Number(arbitrary[1]);
  const named = /(?<![-\w])max-w-(xs|sm|md|lg|xl|2xl)(?![-\w])/.exec(className);
  return named ? MAX_W_SCALE[named[1]] : null;
}

/** `w-full`, not `min-w-full` (which raises a floor and never caps a width). */
const W_FULL = /(?<![-\w])w-full(?![-\w])/;
/** Any container-query variant: the figure's visibility is width-gated. */
const CONTAINER_QUERY = /@(?:min|max)-\[/;

/**
 * The narrowest container this figure is ever painted in, from its container
 * queries, or null when it is painted at every width (so 254px applies).
 *
 * This tree writes responsive figures as a pair: a phone variant classed
 * `block … @min-[400px]:hidden`, and a wide variant classed
 * `hidden … @min-[400px]:block`. The phone half really is drawn at 254px. The
 * wide half is `display: none` until the container reaches N, so measuring it
 * at 254 would report a violation that cannot happen. Returns N for the wide
 * half and null for the phone half; anything else container-queried is left
 * undecidable rather than guessed at.
 */
function narrowestPaintedWidth(className: string): { width: number | null; decidable: boolean } {
  if (!CONTAINER_QUERY.test(className)) return { width: null, decidable: true };
  const showsAbove = /(?<![-\w])hidden(?![-\w])/.test(className) && /@min-\[(\d+)px\]:block(?![-\w])/.exec(className);
  if (showsAbove) return { width: Number(showsAbove[1]), decidable: true };
  const hidesAbove = /@min-\[(\d+)px\]:hidden(?![-\w])/.test(className);
  if (hidesAbove) return { width: null, decidable: true };
  return { width: null, decidable: false };
}

// ---------------------------------------------------------------------------
// Excused
// ---------------------------------------------------------------------------

/**
 * Figures the naive 254px arithmetic reports on but which are settled by a
 * measurement, keyed `<path relative to src/>#<0-based index of the <svg> in
 * that file>` — the same key shape `scrollRegions.test.ts` uses, so ordinary
 * edits above a figure do not invalidate its entry.
 *
 * Audited 2026-08-29. THIS LIST MAY ONLY SHRINK. An entry leaves it when the
 * figure stops needing it, never because it became inconvenient, and a new
 * figure that paints under the floor gets bigger type, not a line here.
 */
const EXCUSED_UNDER_FLOOR: Record<string, string> = {
  // `className={cn("…", isDragging ? … : …, className)}` — the caller supplies
  // the last segment, so whether this figure is `w-full` and what caps it are
  // not readable here. Measured instead: every mount passes `w-full`, and the
  // narrowest box any of them produces is the 254px stage of a lesson
  // simulator embed or of the `/simulators` bench, which now agree (the
  // `max-w-[280px]` in CompareStatesExplorer, the `max-w-sm` in NoiseExplorer
  // and the `max-w-[260px]` in RabiExplorer are all above it, so none of them
  // binds; so is the 254px the Bloch hero hands it). The axis names and poles
  // are 17 units on a 400-unit viewBox: 17 x 254/400 = 10.80px.
  "components/simulators/bloch-sphere/BlochSphereCanvas.tsx#0":
    "className comes from the caller, but every mount passes w-full and the narrowest is the 254px stage of a lesson simulator embed or the /simulators bench; 17 units on a 400-unit viewBox is 17 x 254/400 = 10.80px",
};

/**
 * The ratchet. The number of figures standing excused. It may go down and
 * never up: a new figure either clears the floor or fails, and it cannot be
 * waved through by appending an entry, because doing so trips this bound.
 *
 * 1 at the 2026-08-29 audit, and still 1 after `components/simulators` joined
 * COVERED_ROOTS: `TunnelingIntroCanvas` left the list in the same pass, because
 * the in-`<svg>` container gate that had made it unmeasurable is now modelled
 * (see `gatedRegions`) rather than excused. Re-tighten on every reduction.
 */
const EXCUSED_TOTAL_AT_AUDIT = 1;

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Blanks comments while preserving line numbers. Same rationale as `scrollRegions.test.ts`. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, " "))
    .split("\n")
    .map((line) => (line.trimStart().startsWith("//") ? "" : line))
    .join("\n");
}

/** Index of the `>` closing the opening tag at `start`, skipping quotes and braces. */
function openingTagEnd(source: string, start: number): number {
  let i = start + 1;
  let depth = 0;
  let quote: string | null = null;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0) return i;
    i++;
  }
  return -1;
}

/**
 * Evaluates an expression made only of numbers, known module constants and
 * `+ - * / ( )`. Anything else — a call, a ternary, a member access, a prop —
 * returns null and the figure becomes undecidable rather than being guessed
 * at. The substitution marks unknown identifiers with NUL so a name that
 * happens to look numeric afterwards cannot slip through.
 */
export function evalNumeric(expr: string, consts: Map<string, number>): number | null {
  const trimmed = expr.trim();
  if (!/^[\w$.\s+\-*/()]+$/.test(trimmed)) return null;
  const substituted = trimmed.replace(/[A-Za-z_$][\w$]*/g, (id) => (consts.has(id) ? String(consts.get(id)) : "\u0000"));
  if (!/^[\d.\s+\-*/()]+$/.test(substituted)) return null;
  try {
    const value = Function(`"use strict";return (${substituted});`)() as unknown;
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Module-scope `const NAME = <numeric expression>;`.
 *
 * This is what makes the guard useful on components rather than only on
 * lesson MDX: every figure in `components/visualizations` writes
 * `viewBox={`0 0 ${WIDTH} ${HEIGHT}`}` and `fontSize={TICK_FONT}`, and a scan
 * that could not follow one hop through a constant would be blind to all of
 * them. Declarations are read in order, so a constant defined from earlier
 * constants (`const PLOT_H = HEIGHT - PAD;`) resolves too.
 */
export function numericConsts(source: string): Map<string, number> {
  const out = new Map<string, number>();
  for (const m of source.matchAll(/^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::\s*number\s*)?=\s*([^;\n]+);/gm)) {
    const value = evalNumeric(m[2], out);
    if (value !== null) out.set(m[1], value);
  }
  return out;
}

/**
 * Module-scope `const NAME = "…";`.
 *
 * Only string constants, and only for `className={NAME}`. Two figures in this
 * tree hoist a gate into a constant (`const LEGEND_SVG_GATE = "hidden
 * @min-[340px]:block";`) and apply it to several groups, which without this hop
 * would read as "the classes come from an expression" and force an excuse.
 */
export function stringConsts(source: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of source.matchAll(/^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::\s*string\s*)?=\s*"([^"]*)"\s*;/gm)) {
    out.set(m[1], m[2]);
  }
  return out;
}

/**
 * The classes on one opening tag: a literal string, an identifier resolved
 * through `stringConsts`, or dynamic (an expression this scan will not guess
 * at). An absent `className` is the empty string, not dynamic.
 */
function classesOn(tag: string, strings: Map<string, string>): { className: string; dynamic: boolean } {
  const literal = /className=["']([^"']*)["']/.exec(tag);
  if (literal) return { className: literal[1], dynamic: false };
  const ident = /className=\{\s*([A-Za-z_$][\w$]*)\s*\}/.exec(tag);
  if (ident && strings.has(ident[1])) return { className: strings.get(ident[1])!, dynamic: false };
  if (/className=\{/.test(tag)) return { className: "", dynamic: true };
  return { className: "", dynamic: false };
}

/**
 * `<g className="hidden … @min-[400px]:block">…</g>` regions inside one figure,
 * as half-open index ranges into the figure body with the width each gates on.
 *
 * This is the shape that used to be unmeasurable. A figure is painted at every
 * width, so the naive reading is that its type is too — but two canvases here
 * gate only their *legend* behind a container query and substitute an HTML
 * block at a real 12px below it. Their small type therefore never paints in
 * the narrow box the root reference describes; the narrowest width it is
 * painted at is the gate's own. Nested groups are all recorded and the
 * narrowest containing gate wins, so a gate inside a gate cannot widen the box.
 *
 * `<g>` is never self-closing anywhere in this tree (asserted below), so
 * counting `<g` against `</g>` finds the matching close.
 */
function gatedRegions(body: string, strings: Map<string, string>): { start: number; end: number; width: number }[] {
  const regions: { start: number; end: number; width: number }[] = [];
  let i = 0;
  while ((i = body.indexOf("<g", i)) !== -1) {
    if (/[A-Za-z0-9]/.test(body[i + 2] ?? "")) {
      i += 2;
      continue;
    }
    const open = openingTagEnd(body, i);
    if (open === -1) break;
    const { className, dynamic } = classesOn(body.slice(i, open + 1), strings);
    const gate = dynamic ? { width: null, decidable: false } : narrowestPaintedWidth(className);
    if (gate.decidable && gate.width !== null) {
      let depth = 1;
      let j = open + 1;
      let closeAt = body.length;
      while (j < body.length) {
        const nextOpen = body.indexOf("<g", j);
        const nextClose = body.indexOf("</g>", j);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          if (!/[A-Za-z0-9]/.test(body[nextOpen + 2] ?? "")) depth++;
          j = nextOpen + 2;
          continue;
        }
        depth--;
        j = nextClose + 4;
        if (depth === 0) {
          closeAt = nextClose;
          break;
        }
      }
      regions.push({ start: open + 1, end: closeAt, width: gate.width });
    }
    i = open + 1;
  }
  return regions;
}

export type Figure = {
  /** `<path relative to src/>#<index within that file>` — the allowlist key. */
  key: string;
  file: string;
  line: number;
  wFull: boolean | null;
  viewBoxWidth: number | null;
  /** Smallest explicitly authored type size in the figure, in viewBox units. */
  minFont: number | null;
  /** Effective CSS pixels at the narrowest real box, when that is decidable. */
  effectivePx: number | null;
  /** Why the scan could not decide, or null when it could. */
  undecidable: string | null;
};

/**
 * Every `<svg>` in one file's source, in document order.
 *
 * `referenceBox` is the narrowest real box a figure in this file is painted
 * in — `COVERED_ROOTS` supplies it per directory, because a simulator sits in
 * one more frame than a lesson figure does.
 */
export function figuresIn(source: string, relPath: string, referenceBox: number = NARROW_BOX): Figure[] {
  const clean = stripComments(source);
  const consts = numericConsts(clean);
  const strings = stringConsts(clean);
  const found: Figure[] = [];
  let idx = 0;

  while ((idx = clean.indexOf("<svg", idx)) !== -1) {
    // `<svgFoo` is a different element; `<svg ` / `<svg\n` / `<svg>` are not.
    if (/[A-Za-z0-9]/.test(clean[idx + 4] ?? "")) {
      idx += 4;
      continue;
    }
    const end = openingTagEnd(clean, idx);
    if (end === -1) break;
    const tag = clean.slice(idx, end + 1);
    const close = clean.indexOf("</svg>", end);
    const body = close === -1 ? clean.slice(end) : clean.slice(end, close);

    // viewBox: a plain string, or a template literal over module constants.
    const vbRaw = /viewBox=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/.exec(tag);
    let viewBoxWidth: number | null = null;
    if (vbRaw) {
      const resolved = (vbRaw[1] ?? vbRaw[2] ?? vbRaw[3] ?? "").replace(/\$\{([^}]*)\}/g, (_, e: string) => {
        const v = evalNumeric(e, consts);
        return v === null ? "?" : String(v);
      });
      const parts = resolved.trim().split(/\s+/);
      if (parts.length === 4 && /^-?[\d.]+$/.test(parts[2])) viewBoxWidth = Number(parts[2]);
    }

    // className: a literal string, a string constant, absent, or dynamic.
    const { className, dynamic: dynamicClass } = classesOn(tag, strings);
    const wFull = dynamicClass ? null : W_FULL.test(className);

    // Explicit type sizes, in viewBox units, each with the narrowest width it
    // is painted at: the figure's own, unless an in-`<svg>` gate holds it back
    // to a wider container.
    const regions = gatedRegions(body, strings);
    const sizes: { font: number; gate: number | null }[] = [];
    let unresolvedSizes = 0;
    for (const m of body.matchAll(/fontSize=\{([^}]*)\}|fontSize="([\d.]+)"|font-size="([\d.]+)"|text-\[([\d.]+)px\]/g)) {
      let value: number | null;
      if (m[1] !== undefined) value = evalNumeric(m[1], consts);
      else value = Number(m[2] ?? m[3] ?? m[4]);
      if (value === null) {
        unresolvedSizes++;
        continue;
      }
      const at = m.index ?? 0;
      const enclosing = regions.filter((r) => at >= r.start && at < r.end).map((r) => r.width);
      sizes.push({ font: value, gate: enclosing.length ? Math.min(...enclosing) : null });
    }
    const minFont = sizes.length ? Math.min(...sizes.map((s) => s.font)) : null;

    const gate = narrowestPaintedWidth(className);
    let undecidable: string | null = null;
    if (minFont === null && unresolvedSizes === 0) {
      // No authored type at all: nothing for this guard to measure.
    } else if (dynamicClass) undecidable = "className comes from a prop, so w-full is the caller's choice";
    else if (!gate.decidable) undecidable = `a container-query variant gates this figure's visibility in a shape this scan does not model, so ${referenceBox}px may be the wrong reference box`;
    else if (unresolvedSizes > 0) undecidable = `${unresolvedSizes} fontSize value(s) are not resolvable numbers`;
    else if (wFull && viewBoxWidth === null) undecidable = "w-full, but the viewBox width is not a resolvable number";

    let effectivePx: number | null = null;
    // The size that actually paints smallest, which with an in-`<svg>` gate in
    // play is not always the smallest authored one — a 13-unit label painted at
    // every width is smaller on screen than a 20-unit one held back to 340px.
    let governingFont = minFont;
    if (undecidable === null && sizes.length > 0) {
      const cap = maxWidthCap(className);
      const base = gate.width ?? referenceBox;
      // A gate never narrows the box: it withholds the mark until the
      // container is at least that wide. A `max-w-*` cap always narrows it.
      const effectiveOf = ({ font, gate: inner }: { font: number; gate: number | null }) => {
        const box = Math.min(Math.max(base, inner ?? 0), cap ?? Number.POSITIVE_INFINITY);
        return wFull && viewBoxWidth ? (font * box) / viewBoxWidth : font;
      };
      const scored = sizes.map((s) => ({ font: s.font, px: effectiveOf(s) }));
      const worst = scored.reduce((a, b) => (b.px < a.px ? b : a));
      governingFont = worst.font;
      effectivePx = Math.round(worst.px * 100) / 100;
    }

    found.push({
      key: `${relPath}#${found.length}`,
      file: relPath,
      line: clean.slice(0, idx).split("\n").length,
      wFull,
      viewBoxWidth,
      minFont: governingFont,
      effectivePx,
      undecidable,
    });
    idx = end + 1;
  }
  return found;
}

const ALL_FIGURES: Figure[] = Object.entries(COVERED_ROOTS).flatMap(([root, box]) =>
  walk(path.join(SRC, root)).flatMap((file) =>
    figuresIn(readFileSync(file, "utf8"), path.relative(SRC, file).split(path.sep).join("/"), box)
  )
);

/** The reference box a given file was measured against, for failure messages. */
function boxFor(relFile: string): number {
  const root = Object.keys(COVERED_ROOTS).find((r) => relFile.startsWith(`${r}/`));
  return root ? COVERED_ROOTS[root] : NARROW_BOX;
}

/** Figures the scan reports on: too small, or too opaque to settle. */
const REPORTABLE = ALL_FIGURES.filter(
  (f) => f.undecidable !== null || (f.effectivePx !== null && f.effectivePx < LEGIBILITY_FLOOR)
);

// ---------------------------------------------------------------------------
// Guard the guard
// ---------------------------------------------------------------------------

describe("the figure scan itself", () => {
  it("finds the figures that exist in this tree", () => {
    // An extractor that silently stopped matching would make every other
    // assertion here pass while checking nothing.
    expect(ALL_FIGURES.length).toBeGreaterThan(50);
    expect(ALL_FIGURES.filter((f) => f.minFont !== null).length).toBeGreaterThan(30);
  });

  it("resolves a viewBox and a font size through module constants", () => {
    // Without this hop the guard would be blind to every component figure,
    // all of which write their geometry as constants.
    const source = [
      "const WIDTH = 480;",
      "const TICK = 18;",
      "export function F() {",
      "  return (",
      "    <svg viewBox={`0 0 ${WIDTH} 220`} className=\"w-full\">",
      "      <text fontSize={TICK}>x</text>",
      "    </svg>",
      "  );",
      "}",
    ].join("\n");
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.viewBoxWidth).toBe(480);
    expect(figure.minFont).toBe(18);
    // 18 x 254 / 480 = 9.525, reported to the hundredth.
    expect(figure.effectivePx).toBe(9.53);
  });

  it("follows simple arithmetic on a constant", () => {
    const source = 'const T = 18;\nconst A = <svg viewBox="0 0 480 220"><text fontSize={T - 9}>x</text></svg>;';
    expect(figuresIn(source, "fixture.tsx")[0].minFont).toBe(9);
  });

  it("scores an intrinsic-width figure at one unit per pixel", () => {
    const source = '<svg width={480} viewBox="0 0 480 220"><text fontSize={11}>x</text></svg>;';
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.wFull).toBe(false);
    expect(figure.effectivePx).toBe(11);
  });

  it("does not mistake min-w-full for w-full", () => {
    // `min-width: 100%` raises a floor; it never caps the width attribute, so
    // the figure keeps its intrinsic size and overflows into its scroll
    // wrapper as intended. Two lesson circuit diagrams rely on exactly this.
    const source = '<svg width={600} viewBox="0 0 600 200" className="min-w-full"><text fontSize={11}>x</text></svg>;';
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.wFull).toBe(false);
    expect(figure.effectivePx).toBe(11);
  });

  it("applies an arbitrary max-w cap that binds inside the reference box", () => {
    const source = '<svg viewBox="0 0 400 200" className="w-full max-w-[190px]"><text fontSize={20}>x</text></svg>;';
    // 20 x 190/400 = 9.5, not 20 x 254/400 = 12.7.
    expect(figuresIn(source, "fixture.tsx")[0].effectivePx).toBe(9.5);
  });

  it("refuses to guess at a figure whose classes come from a prop", () => {
    const source = '<svg viewBox="0 0 400 200" className={className}><text fontSize={20}>x</text></svg>;';
    expect(figuresIn(source, "fixture.tsx")[0].undecidable).toMatch(/prop/);
  });

  it("measures the wide half of a responsive pair at its own gate, not at 254px", () => {
    // `hidden … @min-[460px]:block` is display:none below a 460px container,
    // so 254 is a width it is never painted at. 13 x 460/640 = 9.34, not the
    // 5.16 the naive box would report.
    const source = '<svg viewBox="0 0 640 200" className="mx-auto hidden w-full max-w-2xl @min-[460px]:block"><text fontSize={13}>x</text></svg>;';
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.undecidable).toBeNull();
    expect(figure.effectivePx).toBe(9.34);
  });

  it("measures the phone half of a responsive pair at 254px", () => {
    const source = '<svg viewBox="0 0 320 200" className="mx-auto block w-full max-w-xs @min-[420px]:hidden"><text fontSize={12}>x</text></svg>;';
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.undecidable).toBeNull();
    expect(figure.effectivePx).toBe(9.53);
  });

  it("refuses to guess at a container query it does not model", () => {
    const source = '<svg viewBox="0 0 640 200" className="w-full @max-[300px]:opacity-50"><text fontSize={13}>x</text></svg>;';
    expect(figuresIn(source, "fixture.tsx")[0].undecidable).toMatch(/container-query/);
  });

  it("measures a figure against the reference box its root was given", () => {
    // The whole point of COVERED_ROOTS carrying a width: the same figure is
    // legible in a lesson frame and illegible in a simulator's double frame.
    const source = '<svg viewBox="0 0 520 190" className="w-full"><text fontSize={19}>0.5</text></svg>;';
    expect(figuresIn(source, "fixture.tsx", 254)[0].effectivePx).toBe(9.28);
    expect(figuresIn(source, "fixture.tsx", 220)[0].effectivePx).toBe(8.04);
  });

  it("reads a gate hoisted into a string constant", () => {
    const source = [
      'const GATE = "hidden @min-[340px]:block";',
      'const A = <svg viewBox="0 0 640 280" className="w-full">',
      "  <g className={GATE}><text fontSize={20}>legend</text></g>",
      "</svg>;",
    ].join("\n");
    const [figure] = figuresIn(source, "fixture.tsx", 220);
    expect(figure.undecidable).toBeNull();
    // Painted only at 340px and up: 20 x 340/640 = 10.63, not 20 x 220/640 = 6.88.
    expect(figure.effectivePx).toBe(10.63);
  });

  it("measures in-svg gated type at the gate, and ungated type at the figure's box", () => {
    // The shape two canvases here use: a legend held back to a wide container
    // while the rest of the figure paints at every width. The gate must not
    // rescue a label that is not behind it.
    const source = [
      'const A = <svg viewBox="0 0 640 280" className="w-full">',
      '  <text fontSize={20}>always drawn</text>',
      '  <g className="hidden @min-[340px]:block"><text fontSize={20}>legend</text></g>',
      "</svg>;",
    ].join("\n");
    const [figure] = figuresIn(source, "fixture.tsx", 254);
    // The ungated label governs: 20 x 254/640 = 7.94, not the legend's 10.63.
    expect(figure.effectivePx).toBe(7.94);
    expect(figure.minFont).toBe(20);
  });

  it("does not let a gate widen a box a max-w cap has already narrowed", () => {
    const source =
      'const A = <svg viewBox="0 0 640 280" className="w-full max-w-[300px]">' +
      '<g className="hidden @min-[340px]:block"><text fontSize={20}>legend</text></g></svg>;';
    // The cap binds at 300px however wide the container gets: 20 x 300/640 = 9.38.
    expect(figuresIn(source, "fixture.tsx", 254)[0].effectivePx).toBe(9.38);
  });

  it("closes a gated group at its own </g>, not at a later one", () => {
    const source = [
      'const A = <svg viewBox="0 0 640 280" className="w-full">',
      '  <g className="hidden @min-[340px]:block"><text fontSize={20}>legend</text></g>',
      "  <g><text fontSize={20}>tick</text></g>",
      "</svg>;",
    ].join("\n");
    // The second group is outside the gate, so it is measured at 254: 7.94.
    expect(figuresIn(source, "fixture.tsx", 254)[0].effectivePx).toBe(7.94);
  });

  it("ignores a figure with no authored type", () => {
    const source = '<svg viewBox="0 0 400 200" className={cls}><rect /></svg>;';
    const [figure] = figuresIn(source, "fixture.tsx");
    expect(figure.undecidable).toBeNull();
    expect(figure.effectivePx).toBeNull();
  });

  it("catches the shape that shipped seven times", () => {
    // A hand-rolled lesson circuit: w-full on a 600-unit viewBox with 11-unit
    // labels, inside a scroll wrapper that can never fire.
    const source = '<div className="overflow-x-auto"><svg width="600" viewBox="0 0 600 200" className="w-full"><text fontSize="11">|0⟩</text></svg></div>;';
    const [figure] = figuresIn(source, "fixture.mdx");
    expect(figure.effectivePx).toBe(4.66);
    expect(figure.effectivePx!).toBeLessThan(LEGIBILITY_FLOOR);
  });
});

// ---------------------------------------------------------------------------
// The invariant
// ---------------------------------------------------------------------------

describe("hand-rolled SVG figures", () => {
  it("paint their smallest type at 9px or more in the narrowest real column", () => {
    const failures = REPORTABLE.filter((f) => !(f.key in EXCUSED_UNDER_FLOOR)).map((f) =>
      f.undecidable !== null
        ? `src/${f.file}:${f.line} cannot be measured lexically (${f.undecidable}). ` +
          `Add "${f.key}" to EXCUSED_UNDER_FLOOR with the width it is actually painted at and the resulting effective type.`
        : `src/${f.file}:${f.line} paints ${f.minFont} viewBox units at ${f.effectivePx!.toFixed(2)}px effective ` +
          `(w-full over a ${f.viewBoxWidth}-unit viewBox in a ${boxFor(f.file)}px box), under the ${LEGIBILITY_FLOOR}px floor. ` +
          "Drop the w-full and let the figure keep its intrinsic width inside its overflow-x-auto wrapper (which then " +
          "actually scrolls, so give it tabIndex={0}), or raise the type."
    );
    expect(failures).toEqual([]);
  });

  it("keep the excused set shrinking, never growing", () => {
    const excused = Object.keys(EXCUSED_UNDER_FLOOR).length;
    expect(
      excused,
      `${excused} figures are excused, up from ${EXCUSED_TOTAL_AT_AUDIT} at the audit. ` +
        "A figure that paints under the floor gets bigger type or its intrinsic width — it does not get an allowlist entry."
    ).toBeLessThanOrEqual(EXCUSED_TOTAL_AT_AUDIT);
  });

  it("carry no excuse for a figure that no longer needs one", () => {
    const reportable = new Set(REPORTABLE.map((f) => f.key));
    const live = new Set(ALL_FIGURES.map((f) => f.key));
    const stale = Object.keys(EXCUSED_UNDER_FLOOR).flatMap((key) => {
      if (!live.has(key)) return [`${key} is excused but is no longer a figure in a covered directory — delete the entry.`];
      if (!reportable.has(key)) return [`${key} is excused but now clears the floor on its own — delete the entry.`];
      return [];
    });
    expect(stale).toEqual([]);
  });

  it("cover the directories the audit committed to", () => {
    // COVERED_ROOTS may only grow. Narrowing it would silently retire the
    // guard over whole areas while every assertion above still passed, and
    // *widening* a root's reference box would do the same one figure at a
    // time, so both the roots and their measured widths are pinned here.
    //
    // `components/simulators` was pinned at 220 and is now 254. That is a
    // widening, and it is allowed here for the one reason a widening ever is:
    // the shell itself changed, not the estimate of it. `InteractiveSection`
    // stopped charging a de-framed wrapper's border box and padding below `sm`
    // (`border-0` plus `-mx-4` on the embed slot), which is the 34px that made
    // a lesson embed narrower than the `/simulators` bench; the two now agree
    // at 288 - 34 = 254, confirmed in the dev server's served markup. Anyone
    // widening a root without a change of that kind behind it is doing the
    // thing this pin exists to stop.
    expect(COVERED_ROOTS).toMatchObject({
      "content/lessons": 254,
      "components/visualizations": 254,
      "components/simulators": 254,
    });
    for (const root of Object.keys(COVERED_ROOTS)) {
      expect(ALL_FIGURES.some((f) => f.file.startsWith(`${root}/`)), `no figures found under src/${root}`).toBe(true);
    }
  });

  it("finds no self-closing <g> anywhere it scans, which gatedRegions relies on", () => {
    // `gatedRegions` finds a group's end by counting `<g` against `</g>`. A
    // `<g … />` would break that count and silently mis-scope every gate after
    // it, so the assumption is asserted rather than trusted.
    const offenders = Object.keys(COVERED_ROOTS).flatMap((root) =>
      walk(path.join(SRC, root))
        .filter((file) => /<g\b[^>]*\/>/.test(stripComments(readFileSync(file, "utf8"))))
        .map((file) => path.relative(SRC, file).split(path.sep).join("/"))
    );
    expect(offenders).toEqual([]);
  });
});
