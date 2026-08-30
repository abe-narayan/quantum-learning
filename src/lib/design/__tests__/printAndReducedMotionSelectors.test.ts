import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readGlobalsCss } from "./cssTokens";

/**
 * ============================================================
 * Print / reduced-motion selector liveness
 * ============================================================
 * globals.css §11 and §12 are cross-cutting policy that depend on
 * *structural* hooks — class names, `data-*`/`aria-*`/`role` attributes,
 * element types — set by components this file's owner does not touch.
 * Roughly twenty agents have since rewritten nearly every component those
 * selectors point at (InteractiveSection into an instrument mount with
 * `data-mdx`, Callout onto `data-callout`, PredictBeforeReveal into a real
 * `role="radiogroup"`, the navbar and footer both rebuilt, ...). A selector
 * that stops matching fails *silently*: nothing throws, no visual regression
 * test catches it (there is no printed-page screenshot in this suite), and
 * the first person to notice is a student who printed a lesson and got a
 * blank box or a missing derivation.
 *
 * This test parses the real `@media print` and
 * `@media (prefers-reduced-motion: reduce)` blocks out of globals.css,
 * extracts every selector, breaks each one down into its component
 * "hooks" (tag names, class names, ids, attribute names), and asserts every
 * hook still appears somewhere in the actual component/app source — so the
 * next component rewrite that silently drops a hook these rules depend on
 * fails a test instead of failing a printout.
 *
 * This is deliberately *not* a full CSS selector engine and does not render
 * anything: it can't tell you a selector's structure (descendant vs. child,
 * `:not()`, specificity) still produces the right nesting, only that every
 * name it references hasn't been renamed out from under it. That is the
 * exact failure mode that motivated this file (InteractiveSection's old
 * `.border-accent/30.bg-accent/5` class-string coupling would have failed
 * this test the moment the component moved to `data-mdx` attributes) and is
 * cheap enough to run on every change, unlike a real print-rendering check.
 */

// ----------------------------------------------------------------------------
// CSS block/selector extraction — same brace-depth-walking approach as
// cssTokens.ts's tokensIn() and cascadeLayers.test.ts's unlayeredCss(), so a
// selector or declaration block that itself contains braces (none currently
// do, but nested at-rules like `@page { ... }` do) doesn't truncate the walk
// early.
// ----------------------------------------------------------------------------

/** Extracts the body of the first `{ ... }` block whose opening brace follows
 *  `prelude` (e.g. `"@media print"`), matching braces by depth. */
export function extractBlock(css: string, prelude: string): string {
  const at = css.indexOf(prelude);
  if (at === -1) throw new Error(`block not found in globals.css: ${prelude}`);
  const open = css.indexOf("{", at);
  let depth = 0;
  let end = open;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return css.slice(open + 1, end);
}

/** Top-level selector groups in a CSS block — the raw text before each `{`
 *  at brace-depth 0, skipping nested at-rules (`@page { ... }` has no
 *  selector of its own to check). */
export function extractSelectorGroups(css: string): string[] {
  const groups: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "{") {
      if (depth === 0) {
        const sel = css.slice(start, i).trim();
        if (sel && !sel.startsWith("@")) groups.push(sel);
      }
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) start = i + 1;
      if (depth < 0) depth = 0;
    }
  }
  return groups;
}

/** Splits a selector group on top-level commas (depth-aware, so a comma
 *  inside `:not(a, b)` — not currently used here, but cheap to get right —
 *  doesn't split early). */
function splitSelectorList(group: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < group.length; i += 1) {
    const ch = group[i];
    if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth -= 1;
    else if (ch === "," && depth === 0) {
      parts.push(group.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(group.slice(start).trim());
  return parts.filter(Boolean);
}

/** Splits one selector into its compound (simple-selector) segments on
 *  combinators (child `>`, sibling `+`/`~`, descendant space) — but not on
 *  whitespace *inside* an attribute value (`[aria-label="On this page"]`
 *  contains three space-separated words that are not a descendant
 *  combinator). Bracket-depth-aware for that reason, mirroring
 *  `splitSelectorList` above. */
function splitCompounds(selector: string): string[] {
  const compounds: string[] = [];
  let current = "";
  let depth = 0;
  for (const ch of selector) {
    if (ch === "[") depth += 1;
    if (ch === "]") depth -= 1;
    if (depth === 0 && (ch === ">" || ch === "+" || ch === "~" || /\s/.test(ch))) {
      if (current) compounds.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) compounds.push(current);
  return compounds;
}

export type Hook = { kind: "tag" | "class" | "id" | "attr"; name: string };

/** Tokenizes one compound selector (e.g. `button[aria-pressed]`,
 *  `[data-callout="note"]`, `h3[id$="-heading"]`) into the individual hooks
 *  it depends on. Pseudo-classes/elements (`:not(...)`, `::after`,
 *  `:first-child`) and the universal selector are structural, not
 *  component-owned, and are intentionally not extracted as hooks. */
function tokenizeCompound(compound: string): Hook[] {
  const hooks: Hook[] = [];
  const re = /(^[a-zA-Z][\w-]*)|(\.(?:[\w-]|\\.)+)|(#[\w-]+)|(\[[^\]]+\])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(compound))) {
    if (match[1]) {
      hooks.push({ kind: "tag", name: match[1] });
    } else if (match[2]) {
      hooks.push({ kind: "class", name: match[2].slice(1).replace(/\\(.)/g, "$1") });
    } else if (match[3]) {
      hooks.push({ kind: "id", name: match[3].slice(1) });
    } else if (match[4]) {
      // `[data-mdx="instrument-mount"]` / `[data-decorative]` / `[id$="-heading"]`
      // — only the attribute *name* is checked (see the module doc comment
      // on why exact-value matching would false-fail on dynamic props like
      // `data-callout={type}`), so strip any operator/value/quotes.
      const inner = match[4].slice(1, -1);
      const name = inner.match(/^[\w-]+/)?.[0];
      if (name) hooks.push({ kind: "attr", name });
    }
  }
  return hooks;
}

/** All hooks referenced anywhere in a selector group (comma list). */
export function hooksIn(selectorGroup: string): Hook[] {
  return splitSelectorList(selectorGroup).flatMap((selector) =>
    splitCompounds(selector).flatMap(tokenizeCompound)
  );
}

// ----------------------------------------------------------------------------
// Component source corpus
// ----------------------------------------------------------------------------

const SRC_ROOT = path.resolve(import.meta.dirname, "../../..");

function collectSourceFiles(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectSourceFiles(full, out);
    } else if (/\.(tsx|ts|mdx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
}

/** Every non-test `.ts`/`.tsx` file under `src/components` and `src/app`, plus
 *  every `.mdx` under `src/content`, concatenated.
 *
 *  The first two roots were the original scope, on the premise that a
 *  print/motion selector keys off a *component's* rendered structure. That
 *  premise held until lesson MDX started authoring structural hooks of its own:
 *  `.answer-reveal` is a class written directly onto a `<details>` in
 *  `what-is-a-qubit.mdx`, because a reveal-after-trying disclosure is content
 *  markup and registering it in `mdx-components.tsx` would spend one of the
 *  three remaining slots in that file's documented 30-entry budget. Under the
 *  old roots that live hook read as a dead selector and failed this test.
 *
 *  Widening to MDX does not loosen the guard: its job is to catch a selector
 *  whose target was rewritten out from under it, and a hook that exists in no
 *  component *and* no lesson is still exactly as dead as before. `src/lib` stays
 *  out, since nothing there renders markup. */
function readComponentSource(): string {
  const roots = [
    path.join(SRC_ROOT, "components"),
    path.join(SRC_ROOT, "app"),
    path.join(SRC_ROOT, "content"),
  ];
  const files: string[] = [];
  for (const root of roots) collectSourceFiles(root, files);
  return files.map((f) => readFileSync(f, "utf8")).join("\n");
}

const COMPONENT_SOURCE = readComponentSource();

/**
 * Plain HTML elements that MDX/remark emit directly for ordinary Markdown
 * syntax (a bare `#### heading`, an indented code block, ...) with no
 * custom component registered for them in `src/mdx-components.tsx` — unlike
 * `table` (wrapped by `Table`) or `h1`/`h2`/`h3` (styled via `.prose`
 * selectors elsewhere, and — separately — actually written out in a few
 * components). These tags render for real, but never as literal JSX text in
 * this repo, so a source scan can never confirm or deny them; checking them
 * would only ever produce noise, not a real signal. Verified empirically
 * (see the audit that added this file): every tag referenced by §11/§12
 * *other* than these has at least one real `<tag` occurrence under
 * `src/components` or `src/app`.
 */
const MARKDOWN_ONLY_TAGS = new Set(["h4", "h5", "h6", "pre", "blockquote"]);

/** Whether a hook still shows up anywhere in the component source. Plain
 *  substring search, not an attribute-syntax match: components set these
 *  dynamically (`data-callout={type}`, `aria-pressed={isActive}`) or
 *  imperatively (`setAttribute("data-theme", theme)`), so requiring
 *  `name="value"` JSX syntax would false-fail on exactly the patterns this
 *  codebase actually uses. The trade is precision for robustness — this
 *  catches a hook being renamed/removed entirely (the failure mode that
 *  motivates this file) without false-failing on how it's currently wired
 *  up, which is not this test's concern. */
function isHookLive(hook: Hook, source: string): boolean {
  if (hook.kind === "tag") {
    if (MARKDOWN_ONLY_TAGS.has(hook.name)) return true;
    return source.includes(`<${hook.name}`);
  }
  return source.includes(hook.name);
}

// ----------------------------------------------------------------------------
// The real stylesheet
// ----------------------------------------------------------------------------

const GLOBALS_CSS = readGlobalsCss();
const PRINT_BLOCK = extractBlock(GLOBALS_CSS, "@media print");
const REDUCED_MOTION_BLOCK = extractBlock(GLOBALS_CSS, "@media (prefers-reduced-motion: reduce)");

/** Selector groups whose hooks are theme/token plumbing rather than
 *  component structure — `:root`, `[data-theme="dark"]`, `[data-pillar]` on
 *  the print reset's custom-property block. These *are* live (`data-theme`
 *  is written by ThemeToggle.tsx and the no-flash script in layout.tsx via
 *  `setAttribute`, `data-pillar` by PillarScope.tsx), and are covered by the
 *  same `isHookLive` check as everything else — nothing is exempted here,
 *  this comment just explains why they're expected to pass rather than
 *  being incidentally untestable. */

function findDeadHooks(cssBlock: string, source: string): { selector: string; hook: Hook }[] {
  const dead: { selector: string; hook: Hook }[] = [];
  for (const group of extractSelectorGroups(cssBlock)) {
    for (const hook of hooksIn(group)) {
      if (!isHookLive(hook, source)) dead.push({ selector: group, hook });
    }
  }
  return dead;
}

describe("print stylesheet selectors stay live", () => {
  it("every hook in @media print still appears in component/app source", () => {
    const dead = findDeadHooks(PRINT_BLOCK, COMPONENT_SOURCE);
    expect(
      dead.map((d) => `${d.hook.kind} "${d.hook.name}" (from selector: ${d.selector.replace(/\s+/g, " ")})`),
      "a selector in globals.css §12 references a class/attribute/tag that no longer appears anywhere " +
        "under src/components or src/app — the component it targeted was very likely rewritten out from " +
        "under it. Update the selector to the component's current structural hook (prefer data-*/aria-*/role " +
        "over class strings — see the cascade-layer note in DESIGN_SYSTEM.md for why class coupling is what " +
        "broke here before)."
    ).toEqual([]);
  });
});

describe("reduced-motion stylesheet selectors stay live", () => {
  it("every hook in @media (prefers-reduced-motion: reduce) still appears in component/app source", () => {
    const dead = findDeadHooks(REDUCED_MOTION_BLOCK, COMPONENT_SOURCE);
    expect(
      dead.map((d) => `${d.hook.kind} "${d.hook.name}" (from selector: ${d.selector.replace(/\s+/g, " ")})`)
    ).toEqual([]);
  });
});

// ----------------------------------------------------------------------------
// Self-check: prove the liveness check above can actually fail. Run against
// a synthetic selector referencing a hook that verifiably does not exist
// anywhere in this codebase's component source, rather than against the real
// stylesheet — the point is to pin the *detection mechanism*, not to predict
// a real selector going dead.
// ----------------------------------------------------------------------------
describe("selector-liveness detection (self-check)", () => {
  it("flags a class hook that does not exist anywhere in component source", () => {
    // Shaped exactly like the real historical selector this file's own audit
    // found and replaced (a class-string coupling to InteractiveSection's old
    // markup — `.border-accent/30.bg-accent/5 > .mt-4`), but with names no
    // other component could plausibly also use, so this pins the detection
    // mechanism itself rather than a coincidence: both
    // `border-accent\/30`/`bg-accent\/5` individually are, today, still used
    // by unrelated components (Badge.tsx, SuperpositionJourney.tsx,
    // WaveInterference.tsx) for their own opacity-modified accent styling —
    // a real example of why this checker only ever proves a hook's name is
    // gone *everywhere*, not that any one component still uses it.
    const fakeCss = `.qlearn-test-fake-accent\\/30.qlearn-test-fake-accent\\/5 > .mt-4 { display: none; }`;
    const dead = findDeadHooks(fakeCss, COMPONENT_SOURCE);
    const names = dead.map((d) => d.hook.name);
    expect(names).toContain("qlearn-test-fake-accent/30");
    expect(names).toContain("qlearn-test-fake-accent/5");
    // `.mt-4` is an ordinary, very-much-alive utility class — included to
    // confirm the checker doesn't just flag everything in a selector it's
    // given.
    expect(names).not.toContain("mt-4");
  });

  it("flags an attribute hook that does not exist anywhere in component source", () => {
    const fakeCss = `[data-totally-fake-print-hook-xyz="nope"] { display: none; }`;
    const dead = findDeadHooks(fakeCss, COMPONENT_SOURCE);
    expect(dead).toHaveLength(1);
    expect(dead[0].hook).toEqual({ kind: "attr", name: "data-totally-fake-print-hook-xyz" });
  });

  it("does not flag a hook that genuinely exists (no false positives)", () => {
    const fakeCss = `[data-mdx="instrument-mount"] [data-mdx-slot="embed"] { display: none; }`;
    expect(findDeadHooks(fakeCss, COMPONENT_SOURCE)).toEqual([]);
  });
});
