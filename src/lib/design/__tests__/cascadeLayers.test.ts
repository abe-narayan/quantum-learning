import { describe, expect, it } from "vitest";
import { readGlobalsCss } from "./cssTokens";

/**
 * ============================================================
 * Cascade-layer discipline
 * ============================================================
 * `@import "tailwindcss"` establishes `@layer theme, base, components,
 * utilities;`. In the CSS cascade, **unlayered rules beat every layered rule**,
 * regardless of specificity or source order. So a bare `.foo { color: x }` in
 * this stylesheet outranks every Tailwind utility — including one deliberately
 * composed with it in the same `class` attribute.
 *
 * That is not theoretical. It shipped: `.tech-label` set `color` unlayered
 * while ~20 call sites wrote `class="tech-label text-subtle-foreground"` or
 * `"tech-label text-pillar-text"`, and `.panel` set `border` unlayered while
 * `DefinitionBox`/`TheoremBox` wrote `class="panel border-l-2
 * border-l-pillar-edge"`. Every one of those overrides silently did nothing,
 * and the markup read exactly right, so review could not catch it.
 *
 * This test pins the fix. Any *new* class rule added to globals.css must
 * either sit inside a layer, or be added to `INTENTIONALLY_UNLAYERED` below
 * with a reason — which forces the author to make the call consciously
 * instead of inheriting the wrong default.
 */

const GLOBALS_CSS = readGlobalsCss();

/**
 * Class rules that must stay unlayered, and why. Each of these is *policy that
 * should win*, not a default that should yield to a utility.
 */
const INTENTIONALLY_UNLAYERED: Record<string, string> = {
  // Must beat KaTeX's own stylesheet, which is imported unlayered.
  "katex-display": "overrides KaTeX's unlayered CSS",
  // Must beat @tailwindcss/typography's own generated rules.
  prose: "overrides the typography plugin's --tw-prose-* system",
  // The reveal system's hidden/shown states are load-bearing for
  // accessibility (see the noscript fallback in layout.tsx); a stray
  // `opacity-*` utility must not be able to strand content invisible.
  "field-breathe": "ambient animation, reduced-motion gated",
  "trace-sweep": "ambient animation, reduced-motion gated",
  // Fixed background layers; nothing composes utilities onto them.
  atmosphere: "fixed background layer owned entirely by PillarScope",
  "field-canvas": "fixed background layer owned entirely by QuantumField",
  // Print/reduced-motion overrides are policy and must win outright.
  "not-prose": "typography escape hatch",
};

/** Strips every `@layer ... { ... }` block so what remains is unlayered. */
function unlayeredCss(css: string): string {
  let out = "";
  let index = 0;

  while (index < css.length) {
    const layerAt = css.indexOf("@layer", index);
    if (layerAt === -1) {
      out += css.slice(index);
      break;
    }

    const brace = css.indexOf("{", layerAt);
    const semicolon = css.indexOf(";", layerAt);
    // `@layer a, b, c;` — a declaration, not a block. Nothing to strip.
    if (semicolon !== -1 && (brace === -1 || semicolon < brace)) {
      out += css.slice(index, semicolon + 1);
      index = semicolon + 1;
      continue;
    }
    if (brace === -1) {
      out += css.slice(index);
      break;
    }

    out += css.slice(index, layerAt);

    let depth = 0;
    let cursor = brace;
    for (; cursor < css.length; cursor += 1) {
      if (css[cursor] === "{") depth += 1;
      else if (css[cursor] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    index = cursor + 1;
  }

  return out;
}

/** Class names appearing in a top-level (non-at-rule) selector. */
function unlayeredClassNames(css: string): Set<string> {
  const names = new Set<string>();

  // Only look at selector text: the run of characters before each `{` that
  // isn't itself inside a declaration block.
  let depth = 0;
  let selectorStart = 0;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    if (char === "{") {
      if (depth === 0) {
        const selector = css.slice(selectorStart, i);
        // Skip at-rules (@media, @keyframes, @page, ...) — their contents are
        // handled by the depth counter, and `@media print` blocks are
        // deliberately unlayered policy.
        if (!selector.trimStart().startsWith("@")) {
          for (const match of selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
            names.add(match[1].replace(/\\/g, ""));
          }
        }
      }
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) selectorStart = i + 1;
      if (depth < 0) depth = 0;
    }
  }

  return names;
}

describe("cascade layers", () => {
  it("declares Tailwind's layer order (so `components` is a real layer)", () => {
    // Not literally in this file — it comes from `@import "tailwindcss"` — so
    // assert the import is present rather than the expansion.
    expect(GLOBALS_CSS).toContain('@import "tailwindcss"');
  });

  it("puts the composable component classes inside `@layer components`", () => {
    // The classes whose whole purpose is to be combined with utilities. If any
    // of these leaves the layer, every override composed with it breaks
    // silently again.
    const mustBeLayered = [
      "tech-label",
      "tech-value",
      "eyebrow",
      "panel",
      "panel-inset",
      "instrument",
      "rule-fade",
      "grid-paper",
    ];

    const unlayered = unlayeredClassNames(unlayeredCss(GLOBALS_CSS));
    const escaped = mustBeLayered.filter((name) => unlayered.has(name));

    expect(
      escaped,
      "these are composed with Tailwind utilities that must win; unlayered, they defeat them",
    ).toEqual([]);
  });

  it("has no unreviewed unlayered class rules", () => {
    const unlayered = [...unlayeredClassNames(unlayeredCss(GLOBALS_CSS))];
    const unreviewed = unlayered.filter((name) => !(name in INTENTIONALLY_UNLAYERED));

    expect(
      unreviewed,
      "add to INTENTIONALLY_UNLAYERED with a reason, or move it into `@layer components`",
    ).toEqual([]);
  });
});
