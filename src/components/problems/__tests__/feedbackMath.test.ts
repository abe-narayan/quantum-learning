/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Feedback } from "@/components/problems/Feedback";
import { RenderedScrollableMathText } from "@/components/problems/RenderedMathText";
import { prerenderProblemMath, renderMathRuns } from "@/components/problems/renderProblemMath";
import { getAllProblems } from "@/lib/problems/registry";
import { validateAnswer } from "@/lib/problems/validators";
import type { ValidationResult } from "@/lib/problems/validators/types";
import type { Problem } from "@/lib/problems/types";

/**
 * ============================================================
 * A wrong answer must never be answered with LaTeX source
 * ============================================================
 * `Feedback` rendered `result.message` as a plain string, and 62 authored
 * feedback strings across 30 problems carry inline `$…$`. So the student who
 * had just got one of those wrong, at the moment they were most looking for
 * help, was shown:
 *
 *   Use $P(+)=\frac{1+2\operatorname{Re}(\alpha^*\beta)}{2}$ from the …
 *
 * Hints and the worked solution had rendered their math correctly since
 * problem math moved to the server; feedback was the one surface the move
 * missed. It is now rendered at build time into `ProblemMath.feedback` and
 * looked up by the authored string.
 *
 * Two halves are asserted here, and both matter:
 *
 *  1. COVERAGE, from the content model. Every authored feedback field that
 *     carries math has a prerendered entry. The walk below re-derives the set
 *     of feedback fields from `types.ts` rather than calling
 *     `renderProblemMath`'s own `authoredFeedback`, so a field the renderer
 *     forgets is a failure here rather than a shared blind spot.
 *  2. THE FALLBACK, which is load-bearing rather than defensive. Most feedback
 *     a student ever sees is composed at runtime — `validateNumeric` explains
 *     an unparseable submission, `validateConceptual` answers a framed or
 *     unpredicated one — and none of that can be in a build-time map. Those
 *     must keep rendering as plain text rather than vanishing.
 *
 * Every count below is a floor, never an equality: the corpus grows, and a
 * test that has to be edited whenever a problem is added gets edited without
 * being read. The floors exist so that a matcher which stops finding math
 * fails loudly instead of passing over an empty set.
 */

/**
 * Every authored feedback string on a problem, re-derived from the data model.
 *
 * Independent by construction from `renderProblemMath.ts`'s own accessor, and
 * that independence is the point: these two lists agreeing is the invariant.
 */
function authoredFeedbackFields(problem: Problem): { where: string; text: string }[] {
  const slug = problem.meta.slug;
  const answer = problem.answer;
  const fields: { where: string; text: string }[] = [];

  if (answer.type === "multiple-choice") {
    fields.push({ where: `${slug} defaultIncorrectFeedback`, text: answer.defaultIncorrectFeedback });
    for (const [optionId, text] of Object.entries(answer.optionFeedback ?? {})) {
      fields.push({ where: `${slug} optionFeedback[${optionId}]`, text });
    }
  } else if (answer.type === "numeric") {
    fields.push({ where: `${slug} incorrectFeedback`, text: answer.incorrectFeedback });
    (answer.nearMisses ?? []).forEach((miss, index) => {
      fields.push({ where: `${slug} nearMisses[${index}].feedback`, text: miss.feedback });
    });
  } else {
    fields.push({ where: `${slug} incorrectFeedback`, text: answer.incorrectFeedback });
    if (answer.partialFeedback) {
      fields.push({ where: `${slug} partialFeedback`, text: answer.partialFeedback });
    }
    answer.requiredConceptGroups.forEach((group, index) => {
      if (Array.isArray(group) || !group.missingFeedback) return;
      fields.push({ where: `${slug} group[${index}].missingFeedback`, text: group.missingFeedback });
    });
  }

  // The success path is an authored feedback field too, and this is the half
  // that is easy to forget: `validateAnswer` answers a *correct* submission
  // with `explanation.correctIdea` rather than repeating the word already
  // printed as the result heading. That makes `correctIdea` a message the
  // `Feedback` component renders, so it needs a prerendered entry on the 11
  // problems whose `correctIdea` carries math — or the reader who got the
  // problem RIGHT is the one shown LaTeX source, which is the same defect as
  // the original, aimed at the reader who least deserves it.
  if (problem.explanation?.correctIdea) {
    fields.push({ where: `${slug} explanation.correctIdea`, text: problem.explanation.correctIdea });
  }

  return fields;
}

/** The same delimiter pair `splitMathSegments` splits on. */
const MATH_RUN = /\$[^$]+\$/;

/** Each `$…$` run of an authored string, delimiters included — what a student
 *  was being shown verbatim, and therefore what must not survive into the
 *  rendered box. */
function mathRunSources(text: string): string[] {
  return text.match(/\$[^$]+\$/g) ?? [];
}

const PROBLEMS = getAllProblems();
const ALL_FEEDBACK = PROBLEMS.flatMap(authoredFeedbackFields);
const MATH_FEEDBACK = ALL_FEEDBACK.filter((field) => MATH_RUN.test(field.text));

function render(result: ValidationResult | null, math?: Record<string, ReturnType<typeof renderMathRuns>>): string {
  return renderToStaticMarkup(createElement(Feedback, { result, math }));
}

describe("problem feedback math", () => {
  it("has a corpus of authored feedback to check (guards the guard)", () => {
    // Without these, a registry that failed to load — or a matcher that
    // stopped recognising `$…$` — would make every assertion below vacuous:
    // an empty set satisfies "every element has a prerendered entry".
    expect(PROBLEMS.length).toBeGreaterThan(500);
    expect(ALL_FEEDBACK.length).toBeGreaterThan(1800);
    expect(MATH_FEEDBACK.length).toBeGreaterThan(40);
    expect(new Set(MATH_FEEDBACK.map((field) => field.where.split(" ")[0])).size).toBeGreaterThan(20);
  });

  it("prerenders every authored feedback string that carries math", () => {
    const missing: string[] = [];
    for (const problem of PROBLEMS) {
      const { feedback } = prerenderProblemMath(problem);
      for (const field of authoredFeedbackFields(problem)) {
        if (!MATH_RUN.test(field.text)) continue;
        if (!(field.text in feedback)) missing.push(field.where);
      }
    }

    expect(
      missing,
      "these authored feedback strings contain $…$ and have no prerendered entry, so a student who gets the problem wrong is shown LaTeX source; add the field to `authoredFeedback` in renderProblemMath.ts",
    ).toEqual([]);
  });

  it("renders each prerendered entry exactly as every other problem string is rendered", () => {
    // The map is not a second renderer. Its entries must be what
    // `renderMathRuns` produces, laid out by the same component the hint
    // ladder uses, so feedback math cannot drift from hint math.
    const mismatches: string[] = [];
    for (const problem of PROBLEMS) {
      const { feedback } = prerenderProblemMath(problem);
      for (const [message, runs] of Object.entries(feedback)) {
        const expected = renderToStaticMarkup(
          createElement(RenderedScrollableMathText, { runs: renderMathRuns(message) }),
        );
        const actual = renderToStaticMarkup(createElement(RenderedScrollableMathText, { runs }));
        if (expected !== actual) mismatches.push(`${problem.meta.slug}: ${message.slice(0, 60)}`);
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("carries only the math-bearing strings, so plain-prose feedback costs nothing", () => {
    // The map rides in every problem page's flight payload. Feedback with no
    // math renders identically through the fallback, so putting it in the map
    // would be pure weight — ~97% of the corpus's feedback, on 556 pages.
    const plainEntries: string[] = [];
    for (const problem of PROBLEMS) {
      for (const message of Object.keys(prerenderProblemMath(problem).feedback)) {
        if (!MATH_RUN.test(message)) plainEntries.push(`${problem.meta.slug}: ${message.slice(0, 60)}`);
      }
    }

    expect(
      plainEntries,
      "feedback with no $…$ belongs on the plain-text fallback path, not in the prerendered map",
    ).toEqual([]);
  });

  it("shows a student typeset math, never the LaTeX source, for every math-bearing message", () => {
    const leaks: string[] = [];
    let checked = 0;

    for (const problem of PROBLEMS) {
      const { feedback } = prerenderProblemMath(problem);
      for (const field of authoredFeedbackFields(problem)) {
        if (!MATH_RUN.test(field.text)) continue;
        checked += 1;
        const html = render({ status: "incorrect", message: field.text }, feedback);
        if (!html.includes('class="katex"')) leaks.push(`${field.where} (no katex markup)`);
        for (const source of mathRunSources(field.text)) {
          if (html.includes(source)) leaks.push(`${field.where} (raw ${source})`);
        }
      }
    }

    expect(checked).toBe(MATH_FEEDBACK.length);
    expect(
      leaks,
      "grading feedback is showing raw LaTeX at the moment a student is most looking for help",
    ).toEqual([]);
  });

  it("falls back to plain text for a message the map has never seen", () => {
    // The path every runtime-composed message takes. It has to render the
    // sentence, not swallow it and not throw.
    const runtime: ValidationResult = {
      status: "incorrect",
      message: "Enter the number on its own, without the unit.",
    };

    expect(render(runtime, {})).toContain("Enter the number on its own, without the unit.");
    // ...and with no map at all, which is how `Feedback`'s own unit tests and
    // any future caller that has only a `ValidationResult` render it.
    expect(render(runtime)).toContain("Enter the number on its own, without the unit.");
  });

  it("keeps the validators' own composed messages readable, math map or not", () => {
    // Driven through the real graders rather than asserted against a copy of
    // their strings: an unparseable numeric submission and an empty
    // multiple-choice submission are the two shapes a student most reliably
    // produces, and neither message is authored content.
    const numeric = PROBLEMS.find((problem) => problem.answer.type === "numeric");
    const multipleChoice = PROBLEMS.find((problem) => problem.answer.type === "multiple-choice");
    expect(numeric, "no numeric problem in the corpus").toBeDefined();
    expect(multipleChoice, "no multiple-choice problem in the corpus").toBeDefined();

    for (const [problem, submission] of [
      [numeric!, "abc"],
      [multipleChoice!, ""],
    ] as const) {
      const result = validateAnswer(problem, submission);
      expect(result.status).not.toBe("correct");
      expect(result.message.length).toBeGreaterThan(0);
      const html = render(result, prerenderProblemMath(problem).feedback);
      expect(html).toContain("Not quite");
      // Present, and present as prose: the fallback branch emits the string
      // itself, with no wrapper markup between the words.
      expect(html).toContain(result.message);
    }
  });

  it("renders a real wrong answer's authored feedback as math end to end", () => {
    // The two problems the audit named, pinned by slug so the fix cannot be
    // undone silently on the exact pages it was reported against.
    for (const slug of ["p-plus-for-known-amplitudes", "does-this-state-factor"]) {
      const problem = PROBLEMS.find((candidate) => candidate.meta.slug === slug);
      expect(problem, `${slug} is no longer in the corpus`).toBeDefined();

      const math = prerenderProblemMath(problem!);
      // The submission matters less than the branch it lands in: what is
      // pinned is that whatever message comes back is typeset if it has math.
      const result = validateAnswer(problem!, wrongSubmission(problem!));
      const html = render(result, math.feedback);
      if (MATH_RUN.test(result.message)) {
        expect(html, `${slug} still shows LaTeX source`).toContain('class="katex"');
        for (const source of mathRunSources(result.message)) {
          expect(html).not.toContain(source);
        }
      }
      expect(html).toContain("Not quite");
    }
  });
});

/** A submission guaranteed to be graded wrong: the first non-correct option
 *  for a multiple-choice problem, a value far outside tolerance otherwise. */
function wrongSubmission(problem: Problem): string {
  if (problem.answer.type === "multiple-choice" && problem.question.type === "multiple-choice") {
    // Hoisted: a narrowing of `problem.answer` does not survive into a
    // callback, so `correctOptionId` has to be read before the `find`.
    const correctOptionId = problem.answer.correctOptionId;
    return problem.question.options.find((option) => option.id !== correctOptionId)?.id ?? "";
  }
  if (problem.answer.type === "numeric") {
    return String(problem.answer.value + 1e6 + 1);
  }
  return "zzzz";
}
