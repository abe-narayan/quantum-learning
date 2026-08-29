import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LESSON_KEYWORD_BUDGET, extractLessonKeywords } from "../lessonKeywords";

/**
 * Two halves, and both are needed.
 *
 * The fixtures below pin the *rules* — what counts as a term, what is dropped,
 * how notation is spelled. The corpus sweep at the bottom pins the one
 * assumption the rules rest on that no fixture can check: that every real
 * lesson has a body this can find the start of. A regex that silently matches
 * nothing is the classic way an extractor "passes" while the artifact it feeds
 * goes empty.
 */

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

function lessonFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) lessonFiles(full, out);
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

/** A miniature lesson in the shape the corpus actually writes: a JS preamble,
 *  then JSX and Markdown. */
const LESSON = `import { Callout } from "@/components/mdx/Callout";

export const lessonMeta = {
  title: "Complex Numbers",
  description: "Bold claims about series.",
  objectives: ["Derive |psi> = cos(θ/2)|0>"],
};

<LessonHook eyebrow="Why this matters">
  Prose that should not be harvested wholesale.
</LessonHook>

## The power series this lesson borrows

A **power series** is a polynomial with infinitely many terms, with
$n! = 1\\cdot 2\\cdots n$ and the half-angle $\\theta/2$ appearing throughout.

A <Term id="taylor-series">power series of this kind</Term> is built from
derivatives.

<InteractiveSection title="Roots of Unity Sweep">
  <Widget />
</InteractiveSection>

\`\`\`python
from qiskit import QuantumCircuit  # not a search term
\`\`\`
`;

function terms(source: string, objectives: string[] = []): string[] {
  return extractLessonKeywords(source, objectives).split(" ").filter(Boolean);
}

describe("extractLessonKeywords", () => {
  const extracted = terms(LESSON, ["Derive |psi> = cos(θ/2)|0>"]);

  it("takes the words of a section heading", () => {
    expect(extracted).toContain("power");
    expect(extracted).toContain("series");
    expect(extracted).toContain("borrows");
  });

  it("takes `<Term>` ids, so a lesson is findable by the concept it links out to", () => {
    expect(extracted).toContain("taylor");
  });

  it("takes `title=` attributes off interactive sections", () => {
    expect(extracted).toContain("unity");
  });

  it("names notation the reader can see but cannot type", () => {
    // "factorial" appears in the prose of no lesson in the corpus. `n!`
    // appears in many. A reader who does not know the word is the one who
    // searches for it.
    expect(extracted).toContain("factorial");
  });

  it("keeps a hyphenated compound whole, so `half angle` finds `half-angle`", () => {
    expect(extracted).toContain("half-angle");
  });

  it("transliterates Greek in place, so `theta/2` survives as one token", () => {
    // Padding the substitution with spaces would yield "theta" and "2", and
    // the query `theta/2` — one token, because the matcher splits on
    // whitespace only — would find nothing.
    expect(extracted.some((term) => term.includes("theta/2"))).toBe(true);
  });

  it("drops the JavaScript preamble", () => {
    expect(extracted).not.toContain("lessonmeta");
    expect(extracted).not.toContain("components/mdx/callout");
  });

  it("drops fenced code", () => {
    expect(extracted).not.toContain("qiskit");
    expect(extracted).not.toContain("quantumcircuit");
  });

  it("drops function words", () => {
    for (const word of ["the", "this", "with", "and", "that", "many"]) {
      expect(extracted, `"${word}" should not be a search term`).not.toContain(word);
    }
  });

  it("emits each term once, sorted, so the generated file diffs cleanly", () => {
    const output = extractLessonKeywords(LESSON, ["power series power series"]);
    const list = output.split(" ");
    expect(new Set(list).size).toBe(list.length);
    expect([...list].sort()).toEqual(list);
  });

  it("returns nothing for a lesson with no body at all", () => {
    expect(extractLessonKeywords("import x from \"y\";\n")).toBe("");
  });

  it("never exceeds the per-lesson budget, however long the lesson is", () => {
    // The property the whole size argument rests on: the index grows with the
    // number of lessons, not with the length of one.
    const huge = `## Heading\n\n${Array.from({ length: 4000 }, (_, i) => `**distinctterm${i}**`).join(" ")}\n`;
    expect(extractLessonKeywords(huge).length).toBeLessThanOrEqual(LESSON_KEYWORD_BUDGET);
  });

  it("keeps the most valuable terms when the budget bites", () => {
    // Objectives and headings come first in the candidate order precisely so
    // that truncation eats the hyphenated-compound tail instead.
    const crowded = `## Polar Form\n\n${Array.from({ length: 500 }, (_, i) => `filler-word-${i}`).join(" ")}\n`;
    const kept = terms(crowded, ["Derive Euler's formula"]);
    expect(kept).toContain("euler's");
    expect(kept).toContain("polar");
  });
});

describe("the real lesson corpus", () => {
  const files = lessonFiles(LESSONS_ROOT);

  it("has lessons to check (guards the guard)", () => {
    expect(files.length).toBeGreaterThan(200);
  });

  it("produces a non-empty term set for every lesson", () => {
    // The failure mode this exists for: `bodyOf` looks for the first Markdown
    // heading or capitalised JSX element to find where a lesson's JavaScript
    // preamble ends. Every lesson has one today. A lesson that ever opens some
    // other way would silently index nothing, and the search index would
    // quietly lose a page rather than fail.
    const empty: string[] = [];
    for (const file of files) {
      if (extractLessonKeywords(readFileSync(file, "utf8")) === "") {
        empty.push(path.relative(LESSONS_ROOT, file));
      }
    }
    expect(
      empty,
      "these lessons yielded no search terms — check bodyOf() in lessonKeywords.ts against how they open",
    ).toEqual([]);
  });

  it("never leaks an import specifier or a JSX attribute name into the terms", () => {
    // The preamble strip and the markup strip, checked against real content
    // rather than the fixture that was written to exercise them.
    const leaks: string[] = [];
    for (const file of files) {
      for (const term of extractLessonKeywords(readFileSync(file, "utf8")).split(" ")) {
        if (term.startsWith("@/") || term.includes("=\"") || term.includes("</")) {
          leaks.push(`${path.relative(LESSONS_ROOT, file)}: ${term}`);
        }
      }
    }
    expect(leaks.slice(0, 10)).toEqual([]);
  });
});
