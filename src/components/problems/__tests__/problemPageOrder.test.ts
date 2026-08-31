/* eslint-disable react/no-children-prop -- same raw `createElement` harness, and the
   same exemption, as `src/components/mdx/__tests__/Term.test.ts`. `ProblemLayout`
   declares `children` as a required prop, so `createElement`'s third-argument form
   does not typecheck against it; the rule is aimed at JSX written as
   `<Foo children={x}/>`, which is not what this is. */
/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProblemLayout, PREREQUISITE_ANCHOR_ID } from "@/components/problems/ProblemLayout";
import { prerequisitePhrase } from "@/components/problems/ProblemContext";
import type { LessonMetaWithSlug } from "@/lib/content/types";
import type { NumericProblem } from "@/lib/problems/types";

/**
 * ============================================================
 * The problem statement comes first
 * ============================================================
 * The defect these pin, measured in headless Chrome at 375x812 before the
 * fix: the page opened with a two-row breadcrumb, a difficulty/type/time badge
 * strip and an always-open "Before you start · 0 / 1 complete" prerequisite
 * readout, and the problem statement itself began at y=557 of an 812px screen
 * with the answer field off it entirely. Three of the four actions in the
 * first screen were breadcrumbs.
 *
 * Pixel positions are not assertable here — jsdom does not lay out, which is
 * why `scripts/audit/responsive.mjs` exists — but the two facts that produced
 * them are, and they are the ones a future edit would undo by accident:
 *
 *   1. **Document order.** The statement must precede the answer area and
 *      must not be preceded by the metadata block. Nothing else on this page
 *      can move it below the fold once it is the first thing after the title.
 *   2. **The metadata is a closed disclosure.** A `<details>` with no `open`
 *      attribute costs one line whatever it contains; the same content as a
 *      plain `<div>` costs 161px again, silently, and no layout test would
 *      catch it because the markup would still be "correct".
 *
 * Rendered through `renderToStaticMarkup`, the same way `SolutionPanel`'s and
 * `AnswerInput`'s tests render theirs: `"use client"` is an inert string to
 * vitest, and every hook on this path has a `getServerSnapshot`, so the
 * pre-hydration voice is what comes out.
 */

const PROMPT_MARKER = "PROMPT-MARKER-THE-STATEMENT-ITSELF";

const problem: NumericProblem = {
  meta: {
    slug: "fixture-order-problem",
    title: "A fixture problem",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: [],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
  },
  question: { type: "numeric", prompt: PROMPT_MARKER, inputHint: "a decimal" },
  answer: { type: "numeric", value: 0.5, tolerance: 0.01, incorrectFeedback: "Not that." },
  hints: [],
  solution: { steps: [{ description: "One step." }], finalAnswer: "0.5" },
};

const lessons: LessonMetaWithSlug[] = [
  {
    slug: "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    title: "Bell States and Entanglement",
    course: "quantum-gates-and-circuits",
    order: 1,
    description: "",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    tags: [],
    prerequisites: [],
  } as unknown as LessonMetaWithSlug,
];

const CHILD_MARKER = "ANSWER-AREA-MARKER";

function render() {
  return renderToStaticMarkup(
    createElement(ProblemLayout, {
      problem,
      allLessons: lessons,
      children: createElement("div", null, CHILD_MARKER),
    })
  );
}

describe("the problem page's document order", () => {
  it("puts the problem statement after the title and before the answer area", () => {
    const html = render();
    const title = html.indexOf("A fixture problem");
    const statement = html.indexOf(PROMPT_MARKER);
    const answer = html.indexOf(CHILD_MARKER);

    expect(title).toBeGreaterThan(-1);
    expect(statement).toBeGreaterThan(-1);
    expect(answer).toBeGreaterThan(-1);
    expect(title).toBeLessThan(statement);
    expect(statement).toBeLessThan(answer);
  });

  it("puts nothing between the title and the statement except the collapsed metadata", () => {
    const html = render();
    const titleEnd = html.indexOf("</h1>");
    const statement = html.indexOf(PROMPT_MARKER);
    // Back up to the opening tag of the block the statement sits in, so the
    // gap is measured between two elements rather than into the middle of one.
    const statementStart = html.lastIndexOf("<div", statement);
    const between = html.slice(titleEnd + "</h1>".length, statementStart);

    // Exactly one disclosure, and everything in the gap is inside it: the gap
    // opens with `<details` and closes with `</details>`. That is the whole
    // claim — a future edit that reintroduces a block above the statement
    // (a badge strip, a "before you start" panel, a byline) necessarily lands
    // outside those two boundaries and fails here.
    expect(between.match(/<details/g) ?? []).toHaveLength(1);
    expect(between.trimStart().startsWith("<details")).toBe(true);
    expect(between.trimEnd().endsWith("</details>")).toBe(true);
  });

  it("renders the metadata as a closed disclosure, not an open block", () => {
    const html = render();
    expect(html).toContain(`<details`);
    // React omits a `false` boolean attribute entirely; an `open` disclosure
    // would serialise as `open=""`. This is the assertion that fails if
    // someone "helpfully" defaults it open again.
    expect(html).not.toMatch(/<details[^>]*\sopen/);
  });

  it("keeps the prerequisite readout reachable at the id the wrong-answer route links to", () => {
    const html = render();
    // Same constant `ProblemViewClient`'s "What this builds on" anchor is
    // built from, so the link and its target cannot drift apart.
    expect(html).toContain(`id="${PREREQUISITE_ANCHOR_ID}"`);
    expect(html).toContain("Before you start");
  });

  it("still states the difficulty, the type and the minutes without opening anything", () => {
    const html = render();
    const summary = html.slice(html.indexOf("<summary"), html.indexOf("</summary>"));
    expect(summary).toContain("Intermediate");
    expect(summary).toContain("Numeric Answer");
    expect(summary).toContain("4");
    // The pre-hydration voice: a fact about the problem, true for every
    // reader, never a claim about one whose progress has not been read yet.
    expect(summary).toContain("1 prerequisite");
    expect(summary).not.toContain("not yet complete");
  });
});

describe("prerequisitePhrase", () => {
  it("says nothing at all when there are no prerequisites", () => {
    expect(prerequisitePhrase({ total: 0, done: 0, hydrated: true })).toBeNull();
    expect(prerequisitePhrase({ total: 0, done: 0, hydrated: false })).toBeNull();
  });

  it("reports only the graph before hydration, whatever the reader has done", () => {
    expect(prerequisitePhrase({ total: 1, done: 1, hydrated: false })).toBe("1 prerequisite");
    expect(prerequisitePhrase({ total: 3, done: 2, hydrated: false })).toBe("3 prerequisites");
  });

  it("reports the reader once hydrated", () => {
    expect(prerequisitePhrase({ total: 1, done: 0, hydrated: true })).toBe(
      "1 prerequisite not yet complete"
    );
    expect(prerequisitePhrase({ total: 3, done: 1, hydrated: true })).toBe(
      "2 prerequisites not yet complete"
    );
    expect(prerequisitePhrase({ total: 1, done: 1, hydrated: true })).toBe("Prerequisite complete");
    expect(prerequisitePhrase({ total: 3, done: 3, hydrated: true })).toBe("Prerequisites complete");
  });

  it("never reports a negative outstanding count", () => {
    // `done` is counted from a progress store the component does not own, so
    // a stale or over-full set must not produce "-1 prerequisites".
    expect(prerequisitePhrase({ total: 2, done: 5, hydrated: true })).toBe("Prerequisites complete");
  });
});
