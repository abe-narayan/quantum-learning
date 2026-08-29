/**
 * ============================================================
 * The problem system's server → client math contract
 * ============================================================
 * Problem prose is plain TypeScript data (`src/content/problems/**`), not
 * MDX, so it never passes through `src/lib/mdx/rehypeKatexHtml.mjs` — the
 * plugin that renders every lesson equation to a KaTeX HTML string at build
 * time and is the reason no lesson page ships the 268KB / 74.1KB-gzip KaTeX
 * runtime (see docs/DEPLOYMENT.md; that change also took cold build memory
 * from ~6.6GB to ~3.1GB).
 *
 * Problem pages used to pay that runtime anyway. `ProblemView` is a client
 * component, `AnswerInput`/`HintPanel`/`SolutionPanel` render authored
 * strings through `ScrollableMathText` → `MathText` → `katex`, and none of
 * those files carries a `"use client"` directive of its own — they were
 * dragged across the boundary by their importer, which is why the two
 * existing katex guard tests (which pin `mdx-components.tsx` and
 * `LessonLayout.tsx` by name) never saw it.
 *
 * This module is the fix's contract, and it deliberately holds NO reference
 * to `katex`: it defines the shape a server renderer produces
 * (`renderProblemMath.ts`, which owns the `katex` import) and a client
 * component consumes (`RenderedMathText.tsx`, which only injects strings).
 * Types and the segment split live here, on the katex-free side, so that a
 * client component importing them cannot re-open the chain even by accident
 * — not even through a type-only import that a naive import-graph walker
 * might follow.
 */

/** LaTeX source length (including the `$` delimiters) past which a run is
 *  treated as "can overflow a phone column". Chosen against the real corpus:
 *  it leaves the vast majority of inline symbols alone and catches the
 *  fraction/matrix/bra-ket chains that actually run wide. Owned here rather
 *  than in `ScrollableMathText` because the decision is now made where the
 *  math is rendered (the server), one step earlier than where it is wrapped. */
export const WIDE_MATH_CHARS = 40;

/** The inline-math delimiter split, shared by every reader of problem prose.
 *  `String.prototype.split` ignores a global regex's `lastIndex`, so a single
 *  module-level regex is safe to reuse. */
const MATH_SEGMENT = /(\$[^$]+\$)/g;

/** One authored segment of a problem string, before KaTeX sees it. */
export type MathSegment = {
  /** The authored source, `$` delimiters included when `math` is true. */
  source: string;
  math: boolean;
  /** True only for math runs long enough to need their own scroll box. */
  wide: boolean;
};

/**
 * Splits an authored string into alternating prose and inline-`$…$` segments
 * — the exact split `MathText` and the old `ScrollableMathText` each did
 * inline, hoisted to one place so the server renderer and the client renderer
 * cannot disagree about where a run begins.
 */
export function splitMathSegments(text: string): MathSegment[] {
  return text
    .split(MATH_SEGMENT)
    .filter((part) => part.length > 0)
    .map((part) => {
      const math = part.length > 1 && part.startsWith("$") && part.endsWith("$");
      return { source: part, math, wide: math && part.length > WIDE_MATH_CHARS };
    });
}

/**
 * A rendered run: either literal prose, or KaTeX's own HTML for one inline
 * equation. `wide` rides along on the math case because the decision that
 * produced it (`WIDE_MATH_CHARS` against the *LaTeX source* length) is not
 * recoverable from the rendered HTML.
 */
export type MathRun = { text: string } | { html: string; wide: boolean };

/** One authored string, rendered. */
export type MathRuns = MathRun[];

/** Narrows a run to its rendered-math case. */
export function isRenderedMath(run: MathRun): run is { html: string; wide: boolean } {
  return "html" in run;
}

/** A `WhyWrongEntry`, rendered. `optionId` is carried through so
 *  `SolutionPanel` can still resolve the option's *displayed* letter — the
 *  one thing about an entry that cannot be decided before the reader's
 *  shuffle is known. */
export type WhyWrongMath = { optionId: string | null; text: MathRuns };

/** An `Explanation`, rendered. */
export type ExplanationMath = {
  correctIdea: MathRuns;
  whyCorrect: MathRuns | null;
  whyWrong: WhyWrongMath[];
};

/** A `Solution` (plus its optional `Explanation`), rendered. `latexHtml` is
 *  display-mode KaTeX HTML — the string `KatexMath` used to compute in the
 *  browser. */
export type SolutionMath = {
  steps: { description: MathRuns; latexHtml: string | null }[];
  finalAnswer: MathRuns;
  explanation: ExplanationMath | null;
};

/** Everything on a problem page that `ProblemView`'s client subtree renders
 *  as math, rendered. The prompt is absent on purpose: `ProblemLayout` is a
 *  Server Component and renders it directly, so it never crosses the
 *  boundary. */
export type ProblemMath = {
  /** Multiple-choice option text, keyed by option **id** — never by position,
   *  because `AnswerInput` displays options in a seeded shuffle. Empty for
   *  numeric and conceptual problems. */
  options: Record<string, MathRuns>;
  /** Hint text, in authored (ladder) order. */
  hints: MathRuns[];
  solution: SolutionMath;
};
