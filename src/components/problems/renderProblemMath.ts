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

/** Does this authored string carry at least one complete inline run? The same
 *  delimiter pair `splitMathSegments` splits on, asked as a yes/no question so
 *  the feedback map can skip the ~97% of the corpus that is plain prose. */
const HAS_INLINE_MATH = /\$[^$]+\$/;

/**
 * Every feedback string this problem could hand back that was **authored**.
 *
 * Deliberately mirrors the return paths of `src/lib/problems/validators/*`,
 * and deliberately covers only those: `validateNumeric`'s unparseable-input
 * messages and its exact-value `note`, `validateConceptual`'s
 * framing/predication/echo feedback and the "select an option first" guards
 * are composed at runtime and are not authored content. They carry no math,
 * and `Feedback`'s plain-text fallback is what renders them.
 *
 * Both verdicts are covered, not just the failing one: since `validateAnswer`
 * answers a correct submission with `explanation.correctIdea`, the success
 * path has an authored message too.
 *
 * `__tests__/feedbackMath.test.ts` walks the corpus and fails if an authored
 * feedback field carrying `$…$` is not reachable from here, which is what
 * stops this list from going quietly stale when the data model grows a
 * fourth answer type or a second targeted-feedback slot.
 */
function authoredFeedback(problem: Problem): string[] {
  return [...authoredIncorrectFeedback(problem), ...authoredCorrectFeedback(problem)];
}

/**
 * The success path's authored message.
 *
 * `validateAnswer` answers a correct submission with the problem's
 * `explanation.correctIdea` rather than the word "Correct" a second time, so
 * that field is now a feedback string and has to be in this map like any
 * other. 11 of the 556 carry inline math; without this they would be answered
 * with raw LaTeX at the one moment the reader has earned a clean screen.
 *
 * A single-element list rather than an inlined string so the shape matches
 * `authoredIncorrectFeedback` and a second success-path source (a per-problem
 * `correctFeedback`, say) has somewhere obvious to go.
 */
function authoredCorrectFeedback(problem: Problem): string[] {
  const correctIdea = problem.explanation?.correctIdea?.trim();
  return correctIdea ? [correctIdea] : [];
}

function authoredIncorrectFeedback(problem: Problem): string[] {
  const answer = problem.answer;
  switch (answer.type) {
    case "multiple-choice":
      return [answer.defaultIncorrectFeedback, ...Object.values(answer.optionFeedback ?? {})];
    case "numeric":
      return [answer.incorrectFeedback, ...(answer.nearMisses ?? []).map((miss) => miss.feedback)];
    case "conceptual":
      return [
        answer.incorrectFeedback,
        ...(answer.partialFeedback ? [answer.partialFeedback] : []),
        ...answer.requiredConceptGroups.flatMap((group) =>
          Array.isArray(group) || !group.missingFeedback ? [] : [group.missingFeedback]
        ),
      ];
  }
}

/**
 * This problem's authored grading feedback, rendered, keyed by the authored
 * string — see `ProblemMath.feedback` for why the string is the key and why
 * the map is sparse.
 *
 * Exported so a caller holding only a `Problem` (this component's tests) can
 * build the same map the page does, the way `renderSolutionMath` already is.
 */
export function renderFeedbackMath(problem: Problem): Record<string, MathRuns> {
  const rendered: Record<string, MathRuns> = {};
  for (const message of authoredFeedback(problem)) {
    if (!HAS_INLINE_MATH.test(message)) continue;
    rendered[message] = renderMathRuns(message);
  }
  return rendered;
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
 *
 * `feedback` is the same trade at a tenth of the size, and it is sparse where
 * the others are not: only 30 of the 556 problems author feedback carrying
 * math, so 526 of them get an empty object and pay nothing. Measured on the
 * 30 that do: 907 bytes gzip on average, median 721B, max 2.0KB — 49 bytes
 * averaged across the whole corpus. Rendering it on demand was never an
 * option: it is wanted in the same frame as the wrong answer that asked for
 * it, and a `Feedback` that could render math would be a `Feedback` that
 * imports KaTeX.
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
    feedback: renderFeedbackMath(problem),
  };
}
