/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MathText } from "@/components/ui/MathText";
import { KatexMath } from "@/components/ui/KatexMath";
import {
  RenderedKatexMath,
  RenderedMathText,
  RenderedScrollableMathText,
} from "@/components/problems/RenderedMathText";
import { renderDisplayMath, renderMathRuns } from "@/components/problems/renderProblemMath";
import { WIDE_MATH_CHARS } from "@/components/problems/mathRuns";
import { getAllProblems } from "@/lib/problems/registry";
import { whyWrongText } from "@/lib/problems/types";

/**
 * ============================================================
 * "Not one rendered pixel moves"
 * ============================================================
 * Problem math used to be rendered in the browser: `AnswerInput`,
 * `HintPanel` and `SolutionPanel` called `ScrollableMathText`/`KatexMath`,
 * which call `katex`, and because none of those files declares
 * `"use client"` itself they were pulled across the boundary by
 * `ProblemView` — putting the 268KB / 74.1KB-gzip KaTeX runtime in the eager
 * client bundle of all 547 problem pages. It is now rendered on the server
 * (`renderProblemMath.ts`) and injected as strings
 * (`RenderedMathText.tsx`); `src/lib/design/__tests__/clientBoundary.test.ts`
 * is what holds that boundary.
 *
 * This file holds the other half of the claim: that the swap is invisible.
 * It renders **every authored string in the whole problem corpus** — 547
 * problems' prompts, options, hints, solution steps, final answers and
 * explanations — through both paths and asserts the markup is byte-identical.
 *
 * The oracle is not a frozen copy of the old output. It is the pre-refactor
 * `ScrollableMathText` implementation, verbatim, composed over
 * `components/ui/MathText.tsx` — which is untouched and still ships, because
 * `app/courses/[slug]/page.tsx` renders learning outcomes with it. So this
 * compares the new client-side renderer against the real component the site
 * has always used, on the real content, rather than against a snapshot that
 * would go stale the day KaTeX is upgraded.
 */

const WIDE_MATH_CLASSES =
  "inline-block max-w-full overflow-x-auto align-middle focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2";

function isMath(part: string): boolean {
  return part.length > 1 && part.startsWith("$") && part.endsWith("$");
}

/** `ScrollableMathText` exactly as it was before problem math moved to the
 *  server, expressed over the still-shipping `MathText`. */
function legacyScrollableMathText(text: string, className?: string): ReactElement {
  const parts = text.split(/(\$[^$]+\$)/g).filter((part) => part.length > 0);

  if (!parts.some((part) => isMath(part) && part.length > WIDE_MATH_CHARS)) {
    return createElement(MathText, { text, className });
  }

  return createElement(
    "span",
    { className },
    parts.map((part, index) =>
      isMath(part) && part.length > WIDE_MATH_CHARS
        ? createElement(
            "span",
            { key: index, tabIndex: 0, className: WIDE_MATH_CLASSES },
            createElement(MathText, { text: part })
          )
        : createElement(MathText, { key: index, text: part })
    )
  );
}

/** Every authored string on a problem page that carries inline `$…$`, with a
 *  label naming where it came from so a failure points at the content. */
function everyAuthoredString(): { where: string; text: string }[] {
  const strings: { where: string; text: string }[] = [];
  for (const problem of getAllProblems()) {
    const slug = problem.meta.slug;
    strings.push({ where: `${slug} prompt`, text: problem.question.prompt });
    if (problem.question.type === "multiple-choice") {
      for (const option of problem.question.options) {
        strings.push({ where: `${slug} option ${option.id}`, text: option.text });
      }
    }
    problem.hints.forEach((hint, index) => {
      strings.push({ where: `${slug} hint ${index}`, text: hint.text });
    });
    problem.solution.steps.forEach((step, index) => {
      strings.push({ where: `${slug} step ${index}`, text: step.description });
    });
    strings.push({ where: `${slug} finalAnswer`, text: problem.solution.finalAnswer });
    if (problem.explanation) {
      strings.push({ where: `${slug} correctIdea`, text: problem.explanation.correctIdea });
      if (problem.explanation.whyCorrect) {
        strings.push({ where: `${slug} whyCorrect`, text: problem.explanation.whyCorrect });
      }
      (problem.explanation.whyWrong ?? []).forEach((entry, index) => {
        strings.push({ where: `${slug} whyWrong ${index}`, text: whyWrongText(entry) });
      });
    }
  }
  return strings;
}

const AUTHORED = everyAuthoredString();

describe("problem math renders identically on the server", () => {
  it("has a corpus to check (guards the guard)", () => {
    // Without this, a registry that failed to load would make every
    // comparison below vacuous.
    expect(AUTHORED.length).toBeGreaterThan(2000);
    expect(AUTHORED.filter(({ text }) => text.includes("$")).length).toBeGreaterThan(100);
  });

  it("matches MathText, string for string, across the whole corpus", () => {
    const mismatches: string[] = [];
    for (const { where, text } of AUTHORED) {
      const before = renderToStaticMarkup(createElement(MathText, { text, className: "min-w-0" }));
      const after = renderToStaticMarkup(
        createElement(RenderedMathText, { runs: renderMathRuns(text), className: "min-w-0" })
      );
      if (before !== after) mismatches.push(where);
    }

    expect(mismatches, "server-rendered problem math must be byte-identical to MathText").toEqual([]);
  });

  it("matches the pre-refactor ScrollableMathText, including the wide-run scroll boxes", () => {
    // Both branches matter: the short-run path delegates straight to
    // `MathText`, and the wide-run path adds a focusable `overflow-x-auto`
    // box per long run and an extra wrapper span around every other run.
    const mismatches: string[] = [];
    let wideCovered = 0;
    for (const { where, text } of AUTHORED) {
      for (const className of [undefined, "min-w-0 text-foreground"]) {
        const before = renderToStaticMarkup(legacyScrollableMathText(text, className));
        const after = renderToStaticMarkup(
          createElement(RenderedScrollableMathText, { runs: renderMathRuns(text), className })
        );
        if (before !== after) mismatches.push(`${where} (className=${String(className)})`);
      }
      if (hasWideRun(text)) wideCovered += 1;
    }

    // Guards the guard: the wide-run branch is the one with markup of its
    // own, and a corpus that happened to contain none of them would leave it
    // entirely unexercised above.
    expect(wideCovered).toBeGreaterThan(20);
    expect(mismatches, "the scroll-box wrapper and its tab stop must survive the move to the server").toEqual([]);
  });

  it("matches KatexMath for every display equation in the corpus", () => {
    const mismatches: string[] = [];
    let checked = 0;
    for (const problem of getAllProblems()) {
      for (const [index, step] of problem.solution.steps.entries()) {
        if (!step.latex) continue;
        checked += 1;
        const before = renderToStaticMarkup(createElement(KatexMath, { tex: step.latex, display: true }));
        const after = renderToStaticMarkup(
          createElement(RenderedKatexMath, { html: renderDisplayMath(step.latex) })
        );
        if (before !== after) mismatches.push(`${problem.meta.slug} step ${index}`);
      }
    }

    expect(checked, "no solution step carries display LaTeX — this test would be vacuous").toBeGreaterThan(20);
    expect(mismatches, "display math must keep KatexMath's markup, including the katex-math class").toEqual([]);
  });
});

/** Whether a string contains a run long enough to get its own scroll box. */
function hasWideRun(text: string): boolean {
  return text
    .split(/(\$[^$]+\$)/g)
    .some((part) => isMath(part) && part.length > WIDE_MATH_CHARS);
}
