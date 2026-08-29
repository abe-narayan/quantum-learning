import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guard against the two ways this codebase has shipped classes that compile
 * to *nothing* — both invisible at build time, both found only by an audit:
 *
 * 1. **Tailwind v3 arbitrary-variable syntax.** `rounded-[--radius-tight]`
 *    was valid in v3; in v4 the arbitrary-variable shorthand is
 *    `rounded-(--radius-tight)` and the square-bracket form silently emits
 *    no CSS. A sweep converted every occurrence (and registered the common
 *    cases as named utilities: `rounded-panel`, `ease-instrument`, ...);
 *    this test keeps the dead form from coming back.
 *
 * 2. **`pillar-accent` used as a utility color.** The pillar ramp is exposed
 *    to Tailwind under shortened names (`--color-pillar: var(--pillar-accent)`
 *    in globals.css §"@theme inline"), so `text-pillar` works and
 *    `text-pillar-accent` compiles to nothing. Ten call sites had the dead
 *    form; all now use the registered `pillar` utilities.
 *
 * Comments are stripped before matching because several files legitimately
 * *explain* the dead forms while warning against them (e.g. FilterChips.tsx,
 * ProblemsCatalog.tsx quote `border-pillar-accent` in prose). Raw CSS
 * `var(--pillar-accent)` references are fine and deliberately not matched.
 */

const SRC = path.resolve(import.meta.dirname, "../../..");

/** This directory — the only place the dead patterns may appear, as the
 *  regexes and prose of this very file. */
const SELF_DIR = path.resolve(import.meta.dirname);

/**
 * Files temporarily exempted from the guard, as `/`-separated paths relative
 * to `src/`. The original sweep excluded a set of files owned by a parallel
 * content wave; that wave has landed and the exclusions are lifted, so this
 * list is empty — keep it that way.
 */
const ALLOWLIST: string[] = [];

/** Dead v3 arbitrary-variable syntax, e.g. `rounded-[--radius-tight]`. */
const DEAD_V3_ARBITRARY = /-\[--[a-z]/;

/** `pillar-accent` with a utility prefix (`text-`, `border-l-`, ...) but not
 *  the CSS custom property `--pillar-accent` itself: the leading `[a-z]`
 *  cannot match across the `(` or whitespace that precedes `--`. */
const DEAD_PILLAR_ACCENT_UTILITY = /[a-z][a-z-]*-pillar-accent/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.resolve(full) !== SELF_DIR) walk(full, out);
    } else if (/\.(ts|tsx|mdx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function rel(file: string): string {
  return path.relative(SRC, file).replace(/\\/g, "/");
}

/**
 * Blanks comments while preserving line numbers: block comments (the form
 * JSX brace comments also take) have their non-newline characters erased,
 * and lines that *are* line comments are erased whole.
 * Trailing `//` after code is left alone on purpose — `https://...` in a
 * string must not swallow the rest of its line.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ""))
    .split("\n")
    .map((line) => (line.trimStart().startsWith("//") ? "" : line))
    .join("\n");
}

const FILES = walk(SRC).filter((file) => !ALLOWLIST.includes(rel(file)));

function violations(pattern: RegExp): string[] {
  const out: string[] = [];
  for (const file of FILES) {
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, index) => {
      if (pattern.test(line)) out.push(`${rel(file)}:${index + 1}: ${line.trim()}`);
    });
  }
  return out;
}

describe("utility syntax that compiles to nothing", () => {
  it("contains no Tailwind v3 -[--var] arbitrary syntax (v4 wants -(--var))", () => {
    expect(violations(DEAD_V3_ARBITRARY)).toEqual([]);
  });

  it("contains no pillar-accent utility classes (the registered color is `pillar`)", () => {
    expect(violations(DEAD_PILLAR_ACCENT_UTILITY)).toEqual([]);
  });
});
