import katex from "katex";
import {
  splitMathSegments,
  type ExplanationMath,
  type MathRuns,
  type ProblemMath,
  type SolutionMath,
} from "./mathRuns";
import { whyWrongText, type Explanation, type Problem, type Solution } from "@/lib/problems/types";

/**
 * ============================================================
 * The one place problem math meets KaTeX
 * ============================================================
 * The problem-side twin of `src/lib/mdx/rehypeKatexHtml.mjs`: it renders each
 * equation to a KaTeX HTML **string** so the browser gets the markup and not
 * the 268KB renderer. Lessons get that from the MDX pipeline; problems are
 * plain data, so they get it from here, called from a Server Component
 * (`ProblemView`) before anything crosses the client boundary.
 *
 * **Error semantics are `MathText`/`KatexMath`'s, unchanged and deliberately
 * so.** Both rendered with `throwOnError: false, strict: false`, which means
 * malformed TeX degrades to KaTeX's own red `.katex-error` markup and a
 * problem page never fails to render because one `$…$` is wrong. That is NOT
 * what `rehypeKatexHtml` does — it renders with `throwOnError: true` first so
 * it can report a build-time `file.message` against the source position, then
 * retries leniently — and the difference is correct rather than accidental:
 * the plugin has a vfile and an authored MDX position to attach a warning to,
 * this has neither (it runs per-page during static generation, from data with
 * no position information). Raising a hard error here would turn one bad
 * character in one of 547 content files into a failed build with no location.
 * The *rendered* result of the two paths on malformed input is the same
 * lenient markup either way; only the build-time diagnostic differs.
 *
 * Every function here is pure, so it is equally correct on the server (where
 * `/problems/[slug]` calls it) and in the browser (where `CourseCheckpoint`
 * does, from inside its own already-lazy chunk).
 */

/** KaTeX options, byte-identical to what `MathText` and `KatexMath` passed.
 *  Shared so the two can never drift apart mid-corpus. */
const KATEX_OPTIONS = { throwOnError: false, strict: false } as const;

/**
 * Renders one authored string — prose with inline `$…$` — into runs.
 * Equivalent by construction to what `MathText` did in the browser: same
 * split, same KaTeX call, same options.
 */
export function renderMathRuns(text: string): MathRuns {
  return splitMathSegments(text).map((segment) =>
    segment.math
      ? {
          html: katex.renderToString(segment.source.slice(1, -1), {
            ...KATEX_OPTIONS,
            displayMode: false,
          }),
          wide: segment.wide,
        }
      : { text: segment.source }
  );
}

const DISPLAY_OPEN = '<span class="katex-display">';
const DISPLAY_OPEN_FOCUSABLE = '<span class="katex-display" tabindex="0">';

/** Renders a display-mode equation — a solution step's `latex` — to the HTML
 *  string `KatexMath` used to compute client-side.
 *
 *  The `tabindex="0"` is not decoration. `globals.css` §6 gives
 *  `.katex-display` `overflow-x: auto`, and a scroll container is focusable by
 *  default only in Firefox — so without it a keyboard-only reader sees the left
 *  edge of a wide solution equation and has no way to reach the rest (WCAG
 *  2.1.1). It has to sit on `.katex-display` itself rather than on a wrapper,
 *  because arrow keys scroll the focused element's *own* scroll container and
 *  an outer box that cannot scroll just forwards the keystroke to the document.
 *
 *  This is the **third** copy of that injection, and the duplication is forced
 *  rather than sloppy: `src/lib/mdx/rehypeKatexHtml.mjs` is a build-time `.mjs`
 *  plugin that cannot import TypeScript, and `src/components/ui/KatexMath.tsx`
 *  is `"use client"` — importing from it here would pull a client module into
 *  the server-only path whose entire purpose is keeping the 268KB KaTeX runtime
 *  out of the problem-page bundle. What keeps the three honest is that they all
 *  call the same `katex` package with `displayMode: true`, plus
 *  `__tests__/renderedMath.test.ts`, which renders every authored solution step
 *  through both this path and the live `KatexMath` component and asserts the
 *  markup matches byte for byte. That test is how this comment stops being a
 *  promise and starts being enforced.
 *
 *  No `role` and no `aria-label`, matching the other two: KaTeX already emits a
 *  MathML tree for assistive tech, and naming the container flattens the
 *  equation to that one string. */
export function renderDisplayMath(tex: string): string {
  const html = katex.renderToString(tex, { ...KATEX_OPTIONS, displayMode: true });
  return html.startsWith(DISPLAY_OPEN)
    ? DISPLAY_OPEN_FOCUSABLE + html.slice(DISPLAY_OPEN.length)
    : html;
}

function renderExplanationMath(explanation: Explanation): ExplanationMath {
  return {
    correctIdea: renderMathRuns(explanation.correctIdea),
    whyCorrect: explanation.whyCorrect ? renderMathRuns(explanation.whyCorrect) : null,
    // The `optionId` survives rendering; the letter it will be *shown* under
    // does not exist yet, because it depends on the display shuffle that
    // `SolutionPanel` derives from the problem slug.
    whyWrong: (explanation.whyWrong ?? []).map((entry) => ({
      optionId: typeof entry === "string" ? null : entry.optionId,
      text: renderMathRuns(whyWrongText(entry)),
    })),
  };
}

/** The solution half on its own, so a caller that has only a `Solution` (the
 *  panel's tests, notably) can build the same payload the page does. */
export function renderSolutionMath(solution: Solution, explanation?: Explanation): SolutionMath {
  return {
    steps: solution.steps.map((step) => ({
      description: renderMathRuns(step.description),
      latexHtml: step.latex ? renderDisplayMath(step.latex) : null,
    })),
    finalAnswer: renderMathRuns(solution.finalAnswer),
    explanation: explanation ? renderExplanationMath(explanation) : null,
  };
}

/**
 * Everything `ProblemView`'s client subtree needs to render, rendered.
 *
 * Deliberately renders the hints and the solution even though both start
 * hidden: they are the same authored strings either way, and the alternative
 * — fetching a renderer when the reader reveals one — would put a network
 * round trip inside the click that also has to move keyboard focus onto the
 * revealed content. Measured across all 547 problems, the rendered payload
 * adds ~568 bytes gzip to the average page (median 163B, max 2.8KB) against
 * the 74.1KB gzip of `katex.min.js` it removes from the eager client bundle
 * of every one of them.
 *
 * Rendering the gated content up front leaks nothing that was not already in
 * the page: `ProblemView` is handed the whole `Problem` — hints, worked
 * solution, `answer` and all — as a client-component prop, so the flight
 * payload has carried the authored text the whole time. What is gated is the
 * *reveal*, in `SolutionPanel`, and that is unchanged.
 */
export function prerenderProblemMath(problem: Problem): ProblemMath {
  const options =
    problem.question.type === "multiple-choice"
      ? Object.fromEntries(
          problem.question.options.map((option) => [option.id, renderMathRuns(option.text)])
        )
      : {};

  return {
    options,
    hints: problem.hints.map((hint) => renderMathRuns(hint.text)),
    solution: renderSolutionMath(problem.solution, problem.explanation),
  };
}
