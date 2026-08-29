import type { Problem } from "@/lib/problems/types";
import { prerenderProblemMath } from "./renderProblemMath";
import { ProblemViewClient } from "./ProblemViewClient";

/**
 * ============================================================
 * Where a problem's math stops being LaTeX
 * ============================================================
 * A Server Component whose entire job is to render this problem's `$…$`
 * segments to KaTeX HTML and hand the strings to `ProblemViewClient`, which
 * owns all of the interactivity. Same props as before, so the route
 * (`app/problems/[slug]/page.tsx`) is unchanged and still writes
 * `<ProblemView problem={…} …/>`.
 *
 * WHY this file exists at all: `ProblemViewClient` is the `"use client"`
 * boundary for `/problems/[slug]`, and everything statically reachable below
 * a boundary is downloaded eagerly, before the reader interacts with
 * anything. `AnswerInput`, `HintPanel` and `SolutionPanel` used to render
 * authored strings through `ScrollableMathText` → `MathText` → `katex`, which
 * put the 268KB / 74.1KB-gzip KaTeX runtime in the eager bundle of all 547
 * problem pages. None of those components carries a `"use client"` directive
 * of its own — they were dragged over the boundary by their importer, which
 * is why it stayed invisible.
 *
 * The fix is the one the lesson corpus already uses and documents as
 * load-bearing in docs/DEPLOYMENT.md: render the math to HTML **strings** on
 * the server (`rehypeKatexHtml.mjs` does it for MDX at compile time;
 * `renderProblemMath.ts` does it for problem data here) and let the browser
 * inject the markup. Nothing about the rendered page changes — same KaTeX,
 * same options, same markup — the renderer simply no longer travels with it.
 *
 * `CourseCheckpoint` deliberately does NOT go through this wrapper: it is a
 * client component and cannot render a Server Component, so it calls
 * `prerenderProblemMath` itself and renders `ProblemViewClient` directly.
 * That leaves `katex` inside the checkpoint's own `LazyCourseCheckpoint`
 * chunk, exactly where it already was and off every lesson page's eager
 * graph.
 */
export function ProblemView({
  problem,
  lessonSlug,
  lessonTitle,
  prerequisiteAnchorId,
}: {
  problem: Problem;
  lessonSlug?: string;
  lessonTitle?: string;
  /** In-page id of this problem's `PrerequisiteReadout`, when the page around
   *  this view renders one. Passed straight through. */
  prerequisiteAnchorId?: string;
}) {
  return (
    <ProblemViewClient
      problem={problem}
      math={prerenderProblemMath(problem)}
      lessonSlug={lessonSlug}
      lessonTitle={lessonTitle}
      prerequisiteAnchorId={prerequisiteAnchorId}
    />
  );
}
