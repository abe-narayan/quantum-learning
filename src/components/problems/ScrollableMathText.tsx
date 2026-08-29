import { renderMathRuns } from "./renderProblemMath";
import { RenderedScrollableMathText } from "./RenderedMathText";

/**
 * ============================================================
 * Inline problem math that survives a 320px viewport
 * ============================================================
 * Lesson prose gets this for free: `rehypeKatexHtml`
 * (`src/lib/mdx/rehypeKatexHtml.mjs`) renders every equation in the MDX
 * pipeline and injects `tabindex="0"` onto each `.katex-display` wrapper, so
 * the `overflow-x: auto` `globals.css` already gives it is reachable from the
 * keyboard as well as from a thumb. (That injection used to be a separate
 * `rehypeScrollableMath` plugin; it was folded into `rehypeKatexHtml` when
 * equations stopped existing as hast for a later plugin to tag.)
 *
 * Problem content does not go through MDX at all. Prompts, options, hints and
 * solution steps are plain strings carrying inline `$...$` segments — so none
 * of them ever meet that rehype plugin. KaTeX sets `white-space: nowrap`
 * inside `.katex`, and 87 of the 1,164 inline segments across
 * `src/content/problems` are over 60 LaTeX characters (the longest is 166: a
 * two-matrix product). At 320px the prompt column is roughly 240px wide, so
 * those run straight off the side of the page and take the document's
 * horizontal scrollbar with them.
 *
 * **This is the text-in, markup-out entry point, and it imports `katex`.**
 * It is therefore for *server* callers (`ProblemLayout` renders the prompt
 * with it) and for `CourseCheckpoint`, which is already inside its own lazy
 * chunk. A `"use client"` component in the eager graph of `/problems/[slug]`
 * must import `RenderedScrollableMathText` and be handed runs that
 * `renderProblemMath.ts` produced on the server instead — that is the whole
 * subject of `mathRuns.ts`, and `clientBoundary.test.ts` enforces it.
 *
 * All of the markup, the `WIDE_MATH_CHARS` gate and the a11y reasoning behind
 * it now live in `RenderedMathText.tsx`, so the two entry points cannot
 * diverge: this one only adds the KaTeX render step in front.
 */
export function ScrollableMathText({ text, className }: { text: string; className?: string }) {
  return <RenderedScrollableMathText runs={renderMathRuns(text)} className={className} />;
}
