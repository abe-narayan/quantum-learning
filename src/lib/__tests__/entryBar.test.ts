import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ENTRY_BAR,
  ENTRY_BAR_CALCULUS_SCOPE,
  ENTRY_BAR_MATH,
  ENTRY_BAR_NOT_ASSUMED,
  ENTRY_BAR_SHORT,
} from "@/lib/entryBar";

/**
 * ============================================================
 * One entry claim, and no second copy of it anywhere
 * ============================================================
 * `src/lib/entryBar.ts` documents the failure this guards: the site stated what
 * it assumes in seven places and six mutually incompatible ways, two of them
 * false, and the falsest one ("assumes no math background") sat on the screen
 * immediately after a component whose own comment explained why that wording
 * had been rejected. Consolidating the strings fixed the instance; nothing
 * stopped the next one.
 *
 * Two invariants, and they are different failures:
 *
 *   1. The exported sentences are built from the exported fragments, so a page
 *      that folds the bar into a clause of its own uses the same words. The
 *      assembly is checked rather than assumed, because a later edit that
 *      rewrites `ENTRY_BAR` as a literal would compile fine and quietly
 *      re-open the gap.
 *   2. No file states a competing version in its own words. The banned list is
 *      the historical wordings, verbatim, not a general "sounds like a
 *      prerequisite" heuristic: this test is only useful if it never has to be
 *      argued with.
 */

const SRC = path.resolve(import.meta.dirname, "../..");

/**
 * Strip comments before scanning. Every banned phrase below is *quoted* in a
 * comment somewhere on purpose — `entryBar.ts`'s own header lists all six, and
 * `curriculum.ts` and `Hero.tsx` each explain a wording they rejected — and a
 * scanner that cannot tell a rejected string from a shipped one would force
 * those explanations to be deleted, which is the opposite of the point.
 */
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "node_modules") continue;
      sourceFiles(full, found);
    } else if (/\.tsx?$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

/**
 * The six historical wordings, as they actually shipped. Two were false when
 * they shipped (`assumes no math background` and `starts from nothing` both
 * denied requirements the corpus uses by lesson two); the rest were true and
 * merely different, which is enough, because six true variants of one contract
 * is still six things to keep in step.
 */
const RETIRED_WORDINGS = [
  "assumes no math background",
  "no math background needed",
  "confident high-school algebra",
  "starts from nothing",
  "advanced high-school and early-college",
  "already have the linear algebra",
];

describe("the entry bar is assembled from one set of fragments", () => {
  it("both long forms contain every fragment", () => {
    for (const [name, sentence] of [
      ["ENTRY_BAR", ENTRY_BAR],
      ["ENTRY_BAR_SHORT", ENTRY_BAR_SHORT],
    ] as const) {
      for (const [fragmentName, fragment] of [
        ["ENTRY_BAR_MATH", ENTRY_BAR_MATH],
        ["ENTRY_BAR_CALCULUS_SCOPE", ENTRY_BAR_CALCULUS_SCOPE],
        ["ENTRY_BAR_NOT_ASSUMED", ENTRY_BAR_NOT_ASSUMED],
      ] as const) {
        expect(
          sentence.toLowerCase().includes(fragment.toLowerCase()),
          `${name} no longer contains ${fragmentName} ("${fragment}"). Both long forms must be built from the fragments so a caller that composes its own clause cannot state something they do not.`
        ).toBe(true);
      }
    }
  });

  it("states the trigonometry and calculus clauses, which are the two that were once missing", () => {
    // Not decoration. Both roots need trigonometry by their second lesson and
    // no lesson in the corpus teaches it; calculus is assumed from the second
    // physics course on and is likewise never taught. A bar that omits either
    // is false by the second sitting. See the module header.
    for (const sentence of [ENTRY_BAR, ENTRY_BAR_SHORT]) {
      expect(sentence.toLowerCase()).toContain("trigonometry");
      expect(sentence.toLowerCase()).toContain("calculus");
    }
  });

  it("contains no em dash, like every other reader-facing string", () => {
    for (const sentence of [ENTRY_BAR, ENTRY_BAR_SHORT]) {
      expect(sentence).not.toContain("—");
    }
  });
});

describe("no surface restates the entry bar in its own words", () => {
  it("none of the six retired wordings appears in shipped code", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const body = withoutComments(fs.readFileSync(file, "utf8")).toLowerCase();
      for (const wording of RETIRED_WORDINGS) {
        if (body.includes(wording)) {
          offenders.push(`${path.relative(SRC, file).replace(/\\/g, "/")}: "${wording}"`);
        }
      }
    }
    expect(
      offenders,
      `these files state the entry requirement in a wording lib/entryBar.ts retired. Import ENTRY_BAR / ENTRY_BAR_SHORT, or compose from ENTRY_BAR_MATH / ENTRY_BAR_CALCULUS_SCOPE / ENTRY_BAR_NOT_ASSUMED:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
