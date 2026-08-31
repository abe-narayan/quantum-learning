import { describe, expect, it } from "vitest";
import { readGlobalsCss } from "./cssTokens";

/**
 * ============================================================
 * Cascade-layer discipline
 * ============================================================
 * `@import "tailwindcss"` establishes `@layer theme, base, components,
 * utilities;`. In the CSS cascade, **unlayered rules beat every layered rule**,
 * regardless of specificity or source order. So a bare `.foo { color: x }` in
 * this stylesheet outranks every Tailwind utility, including one deliberately
 * composed with it in the same `class` attribute.
 *
 * That is not theoretical. It shipped: `.tech-label` set `color` unlayered
 * while ~20 call sites wrote `class="tech-label text-subtle-foreground"`, and
 * `.panel` set `border` unlayered while `DefinitionBox`/`TheoremBox` wrote
 * `class="panel border-l-2 border-l-pillar-edge"`. Every one of those
 * overrides silently did nothing, and the markup read exactly right, so review
 * could not catch it.
 *
 * ------------------------------------------------------------
 * Why this file was rewritten
 * ------------------------------------------------------------
 * The first version of this guard extracted `/\.([a-zA-Z_][\w-]*)/` from each
 * selector: **class names only**. Every other selector shape was invisible to
 * it, and four separate live bugs walked straight through:
 *
 *   1. `:focus-visible` unlayered, which made all 59
 *      `focus-visible:outline-none` call sites dead code.
 *   2. `h3[id$="-heading"]` unlayered, which defeated the type utilities on
 *      every section heading it matched.
 *   3. `[data-difficulty="master"] .prose`, which killed `mt-3`, `mt-2.5`,
 *      `mt-2`, `mt-1.5` and `mt-1` on nine paragraphs and lists of every
 *      master lesson, and gave `DerivationSteps`'s `<ol class="not-prose
 *      my-8">` a `1.1em` top margin instead of `2rem`.
 *   4. `[data-callout="note"|"warning"|"mistake"] > p:first-child`, setting
 *      `font-family`, `text-transform`, `font-size`, `font-weight` and
 *      `letter-spacing` out of reach of any utility.
 *
 * A fifth was invisible for a different reason: the walker treated everything
 * before a rule's `{` as its selector, so the file's *first* rule inherited
 * the leading `@import "tailwindcss"; @import "katex..."; @plugin ...;` text,
 * read as an at-rule, and was skipped. That rule is `:root`. The very first
 * rule in the stylesheet could never be checked.
 *
 * So the extractor now works on whole **rules**, not on class tokens:
 *
 *   - It reads the selector as the text after the last top-level `;`, so
 *     at-rule statements before a rule cannot swallow it.
 *   - It keys the allowlist by **normalized selector text**, so an intentional
 *     exception like `[data-reveal]` can actually be written down. Under the
 *     old class-keyed list it was not expressible at all.
 *   - It distinguishes a rule that sets only **custom properties** from one
 *     that sets a **real property**. Only the latter can beat a utility:
 *     `:root { --depth-0: ... }` is a token definition and competes with
 *     nothing, so token blocks are exempt by construction rather than by
 *     accumulating allowlist entries nobody reads.
 *   - It descends into top-level at-rules instead of skipping them wholesale.
 *     Rules inside an unlayered `@media` are unlayered too. The four media
 *     contexts that exist to *win* (print, the two reduced-motion queries, the
 *     explicit "follow my OS" light query) are named in `POLICY_AT_RULES`
 *     below with reasons; anything else, such as a responsive `@media
 *     (min-width: ...)` block, is held to the same standard as top-level CSS.
 */

const GLOBALS_CSS = readGlobalsCss();

/**
 * Unlayered rules that must stay unlayered, keyed by their exact normalized
 * selector text, each with the reason it is policy that should win rather
 * than a default that should yield to a utility.
 *
 * Only rules that set at least one **real** (non-custom) property need an
 * entry. Custom-property-only rules (the `:root` and `[data-pillar]` token
 * blocks) cannot beat a utility and are exempt automatically.
 *
 * If you move one of these into a layer, delete its entry here as well: the
 * "no stale entries" test below fails on a reason nobody can act on any more.
 */
const INTENTIONALLY_UNLAYERED: Record<string, string> = {
  // --- Theme roots -------------------------------------------------------
  ":root":
    "the dark theme's `color-scheme` and token block; `color-scheme` on the root is document policy, not a per-element default a utility should override",
  ':root[data-theme="light"]':
    "the light theme's `color-scheme` override; same reasoning as `:root`, and it must beat the dark default it follows",

  // --- Document ground ---------------------------------------------------
  // `body` and `::selection` were both listed here as "recommended for
  // `@layer base`, not yet moved". They have since been moved, so their
  // entries are gone: an allowlist entry for a rule that is no longer
  // unlayered is exactly what the stale-entry assertion below exists to
  // catch, and leaving them would have turned this guard's own record into
  // the thing it flags.
  "html, body":
    "the full-bleed overhang clip. `overflow-x: clip` on the root must not be overridable by a stray utility, because a page that loses it gains a horizontal scrollbar sitewide",

  // --- KaTeX -------------------------------------------------------------
  ".katex-display":
    "must beat `katex/dist/katex.min.css`, which is imported unlayered and would otherwise win",
  ".katex-display:focus-visible":
    "the scroll container's own focus treatment, and it must beat KaTeX's unlayered rules as above",
  "[data-math-plain] .katex-display":
    "the opt-out that strips the slab framing; it must beat the unlayered `.katex-display` rule earlier in the file, which only source order settles",

  // --- Typography plugin -------------------------------------------------
  ".prose":
    "must beat @tailwindcss/typography's own generated `font-size`/`line-height` on the prose container",
  ".prose blockquote":
    "must beat the typography plugin's blockquote rules, which are more specific than a layered override would be",
  ".prose h2::before":
    "the section marker; a pseudo-element the plugin also styles, so it must outrank the plugin's unlayered output",
  ".prose :where(code):not(:where(pre code))":
    "must beat the typography plugin's own unlayered `code` rule, which sets no wrapping behavior and left long identifiers (`optimalGroverIterations(6)`) overflowing at 320px with no scrollbar (`body` is `overflow-x: clip`)",

  // --- Scroll reveal -----------------------------------------------------
  "[data-reveal]":
    "load-bearing for accessibility: the hidden state must not be defeatable by a stray `opacity-*` utility, or content is stranded invisible. Deliberately strong enough that the noscript fallback in layout.tsx has to use `!important` to beat it",
  '[data-reveal][data-revealed="true"]':
    "the shown half of the same pair; it must outrank the hidden state above it for the same reason",

  // --- Fixed background layers ------------------------------------------
  ".trace-sweep":
    "ambient animation, reduced-motion gated and hover/focus gated; nothing composes utilities onto it",
  ".atmosphere": "fixed background layer owned entirely by PillarScope",
  ".field-canvas": "fixed background layer owned entirely by QuantumField",
};

/**
 * At-rule contexts allowed to contain unlayered rules, and why. These are all
 * *policy* queries: they exist to override whatever the page would otherwise
 * do, so losing to a utility would defeat their purpose.
 *
 * A context not listed here is scanned like top-level CSS. That is the point:
 * a responsive `@media (min-width: 48rem) { .card { padding: 2rem } }` is
 * exactly as capable of silently defeating `md:p-8` as a top-level rule is,
 * and nothing about the `@media` wrapper makes it more deliberate.
 */
const POLICY_AT_RULES: Record<string, string> = {
  "@media print": "print overrides must win outright; there is no print utility layer to lose to",
  "@media (prefers-reduced-motion: reduce)":
    "the motion kill switch; a utility that reinstated an animation here would be an accessibility regression",
  "@media (prefers-reduced-motion: no-preference)":
    "the paired opt-in that re-enables the ambient sweep only when motion is welcome",
  "@media (prefers-color-scheme: light)":
    "the explicit follow-my-OS light theme; it sets `color-scheme` on the root, same reasoning as `:root`",
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
    // `@layer a, b, c;` is a declaration, not a block. Nothing to strip.
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

type CssRule = {
  /** Normalized selector text, whitespace collapsed. */
  selector: string;
  /** The at-rule preludes this rule sits inside, outermost first. */
  context: string[];
  /** Property names declared directly on this rule (not in nested blocks). */
  properties: string[];
};

/** Collapses whitespace so `html,\n  body` and `html, body` are one key. */
function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ");
}

/** Property names declared directly in a rule body, ignoring nested blocks. */
function declaredProperties(body: string): string[] {
  const properties: string[] = [];
  let depth = 0;
  let buffer = "";

  const flush = () => {
    const match = buffer.match(/^\s*([-\w]+)\s*:/);
    if (match) properties.push(match[1]);
    buffer = "";
  };

  for (let i = 0; i < body.length; i += 1) {
    const char = body[i];
    if (char === "{") {
      depth += 1;
      buffer = "";
    } else if (char === "}") {
      depth -= 1;
      buffer = "";
    } else if (depth > 0) {
      continue;
    } else if (char === ";") {
      flush();
    } else {
      buffer += char;
    }
  }
  flush();

  return properties;
}

/**
 * Every style rule in `css`, at any at-rule depth, with the at-rule chain it
 * sits under.
 *
 * The selector is the text after the last top-level `;`, which is what makes
 * the file's first rule visible: `@import "tailwindcss"; ... :root {` would
 * otherwise present `:root` as an at-rule and get skipped.
 *
 * `@keyframes`, `@font-face`, `@property` and `@counter-style` are not
 * descended into: their contents are not selectors and cannot compete with a
 * utility.
 */
function rulesIn(css: string, context: string[] = []): CssRule[] {
  const rules: CssRule[] = [];
  let depth = 0;
  let start = 0;
  let openAt = -1;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    if (char === "{") {
      if (depth === 0) openAt = i;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        const raw = css.slice(start, openAt);
        const prelude = normalize(raw.slice(raw.lastIndexOf(";") + 1));
        const body = css.slice(openAt + 1, i);

        if (prelude.startsWith("@")) {
          if (!/^@(keyframes|font-face|property|counter-style)\b/.test(prelude)) {
            rules.push(...rulesIn(body, [...context, prelude]));
          }
        } else if (prelude) {
          rules.push({ selector: prelude, context, properties: declaredProperties(body) });
        }

        start = i + 1;
      }
      if (depth < 0) depth = 0;
    }
  }

  return rules;
}

/** The allowlist key for a rule: its at-rule path plus its selector. */
function ruleKey(rule: CssRule): string {
  return [...rule.context, rule.selector].join(" > ");
}

/** True when a rule declares something a Tailwind utility could also declare. */
function setsRealProperty(rule: CssRule): boolean {
  return rule.properties.some((property) => !property.startsWith("--"));
}

/**
 * The rules this guard holds to account: unlayered, setting a real property,
 * and not inside one of the four policy media queries.
 */
function utilityDefeatingRules(css: string): CssRule[] {
  return rulesIn(unlayeredCss(css)).filter((rule) => {
    if (!setsRealProperty(rule)) return false;
    // `[].every(...)` is vacuously true, so a top-level rule (empty context)
    // must be tested for explicitly or the whole file exempts itself. That is
    // not a hypothetical: it is the first bug this rewrite shipped, and it
    // reduced the guard to reporting exactly one rule in the entire sheet.
    if (rule.context.length === 0) return true;
    return !rule.context.every((prelude) => prelude in POLICY_AT_RULES);
  });
}

/** Class names appearing in any unlayered top-level selector. */
function unlayeredClassNames(css: string): Set<string> {
  const names = new Set<string>();
  for (const rule of rulesIn(unlayeredCss(css))) {
    if (rule.context.length > 0) continue;
    for (const match of rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
      names.add(match[1].replace(/\\/g, ""));
    }
  }
  return names;
}

describe("cascade layers", () => {
  it("declares Tailwind's layer order (so `components` is a real layer)", () => {
    // Not literally in this file, it comes from `@import "tailwindcss"`, so
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

    const unlayered = unlayeredClassNames(GLOBALS_CSS);
    const escaped = mustBeLayered.filter((name) => unlayered.has(name));

    expect(
      escaped,
      "these are composed with Tailwind utilities that must win; unlayered, they defeat them",
    ).toEqual([]);
  });

  it("has no unreviewed unlayered rule that can defeat a utility", () => {
    const unreviewed = utilityDefeatingRules(GLOBALS_CSS)
      .map(ruleKey)
      .filter((key) => !(key in INTENTIONALLY_UNLAYERED));

    expect(
      [...new Set(unreviewed)],
      "each of these outranks every Tailwind utility on the elements it matches. Move it into `@layer base`/`@layer components`, or add it to INTENTIONALLY_UNLAYERED with the reason it must win",
    ).toEqual([]);
  });

  it("has no stale INTENTIONALLY_UNLAYERED entries", () => {
    // An allowlist that outlives the rules it excuses stops being a record of
    // decisions and becomes noise, and the next reader cannot tell which
    // entries are still load-bearing.
    const present = new Set(utilityDefeatingRules(GLOBALS_CSS).map(ruleKey));
    const stale = Object.keys(INTENTIONALLY_UNLAYERED).filter((key) => !present.has(key));

    expect(
      stale,
      "these selectors are no longer unlayered (or no longer set a real property). Delete their entries",
    ).toEqual([]);
  });

  it("uses no CSS nesting, which this extractor deliberately does not follow", () => {
    // The one hole left in the walker, stated out loud rather than left to be
    // discovered. `rulesIn` treats a rule body as declarations and does not
    // descend into a nested style rule, so `body { & .foo { color: x } }`
    // would hide `.foo` from the scan. globals.css uses no nesting today
    // (zero `&` in 1780 lines), so rather than write and maintain a nesting
    // parser nothing exercises, this fails the moment the assumption stops
    // holding, and whoever introduces nesting can teach `rulesIn` about it
    // then.
    expect(GLOBALS_CSS, "add nesting support to `rulesIn` before using `&` here").not.toContain(
      "&",
    );
  });

  it("requires a real reason on every allowlist entry", () => {
    const thin = Object.entries({ ...INTENTIONALLY_UNLAYERED, ...POLICY_AT_RULES })
      .filter(([, reason]) => reason.trim().length < 20)
      .map(([key]) => key);

    expect(thin, "an allowlist entry without a reason is an allowlist entry nobody can review").toEqual(
      [],
    );
  });
});

/**
 * ------------------------------------------------------------
 * Meta-tests: does the extractor see what it claims to see?
 * ------------------------------------------------------------
 * The reason this guard failed four times was never the assertion. It was the
 * extractor: `/\.([a-zA-Z_][\w-]*)/` over a stylesheet containing all four of
 * those live bugs returns the empty set, and `expect([]).toEqual([])` passes.
 * A guard that cannot be shown to see a defect is not a guard.
 *
 * So the fixture below *is* those four bugs, plus the first-rule-in-the-file
 * case, written as CSS. Every one of them must be reported.
 */
const REGRESSION_FIXTURE = `
@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  color-scheme: dark;
  --depth-0: #05070c;
}

:focus-visible {
  outline: 2px solid var(--pillar-accent);
}

h3[id$="-heading"] {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

[data-difficulty="master"] .prose p {
  margin-top: 1.1em;
}

[data-callout="note"] > p:first-child,
[data-callout="warning"] > p:first-child {
  font-family: var(--font-mono);
  text-transform: uppercase;
}

[data-pillar="apex"] {
  --pillar-accent: #d8a657;
}

@media (min-width: 48rem) {
  .card {
    padding: 2rem;
  }
}

@media print {
  body {
    background: white;
  }
}

@layer components {
  .panel {
    border: 1px solid var(--border);
  }
}
`;

describe("cascade-layer extractor", () => {
  const found = utilityDefeatingRules(REGRESSION_FIXTURE).map(ruleKey);

  it.each([
    [":focus-visible", "a bare pseudo-class; killed 59 `focus-visible:outline-none` call sites"],
    ['h3[id$="-heading"]', "an element plus an attribute-substring selector"],
    ['[data-difficulty="master"] .prose p', "an attribute selector with a descendant combinator"],
    [
      '[data-callout="note"] > p:first-child, [data-callout="warning"] > p:first-child',
      "a comma-separated child-combinator selector list",
    ],
    [":root", "the first rule in the file, previously swallowed by the leading @import statements"],
    [
      "@media (min-width: 48rem) > .card",
      "a responsive media query, which is not one of the four policy queries",
    ],
  ])("sees %s (%s)", (selector) => {
    expect(found).toContain(selector);
  });

  it("does not report a token-only rule, which cannot beat a utility", () => {
    // `[data-pillar="apex"] { --pillar-accent: ... }` sets no real property.
    // Nothing in the utility layer is competing for it, so flagging it would
    // be pure noise, and noise is how an allowlist stops being read.
    expect(found).not.toContain('[data-pillar="apex"]');
  });

  it("does not report a layered rule", () => {
    expect(found).not.toContain(".panel");
  });

  it("does not report a rule inside a policy media query", () => {
    expect(found).not.toContain("@media print > body");
  });

  it("reports nothing else from the fixture", () => {
    // Pinned exactly, so a future widening that starts flagging token blocks
    // or layered rules fails here rather than by flooding the real assertion.
    expect(found.length).toBe(6);
  });
});
