import type { Problem, ProblemMeta } from "@/lib/problems/types";
import { getProblemMetaForCourse, getProblemMetaForLesson } from "@/lib/problems/metaRegistry";
import { prerenderProblemMath } from "./renderProblemMath";
import { ProblemViewClient, type NextProblem } from "./ProblemViewClient";

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
/**
 * The problem to offer after this one is solved, and where it comes from.
 *
 * Finishing a problem correctly is the best moment on the site to offer the
 * next one, and until now the success screen offered nothing at all: the
 * "Next step" block rendered only on a *wrong* answer, so a reader who got it
 * right was left on a dead end while a reader who got it wrong was handed
 * three onward links.
 *
 * The lesson's own practice list first, because that is a real sequence rather
 * than a heap: `getProblemMetaForLesson` returns it ordered easiest to
 * hardest, so "the next one" is a genuine step up on the same idea, and it is
 * the identical ordering the lesson page's `PracticeLinks` renders — a reader
 * who follows this link twice walks the list they would have seen there.
 * Falling back to the course keeps the last problem of a lesson from being a
 * dead end too, preferring a problem from a *different* lesson, since having
 * just exhausted this one the useful next move is the next topic.
 *
 * Derived here rather than passed in from the route, because this is the
 * boundary that can afford it: `ProblemView` is a Server Component (the whole
 * point of this file, see above) and `metaRegistry` is the deliberately
 * meta-only view of the corpus that imports none of the problem or quantum
 * graph. What crosses into the client is two strings. `CourseCheckpoint`
 * renders `ProblemViewClient` directly and simply passes none, which is
 * right: a checkpoint sits inside a lesson that already has its own next step.
 */
function nextProblemAfter(problem: Problem): NextProblem | undefined {
  const asLink = (meta: ProblemMeta): NextProblem => ({ slug: meta.slug, title: meta.title });

  const withinLesson = problem.meta.lesson ? getProblemMetaForLesson(problem.meta.lesson) : [];
  const lessonPosition = withinLesson.findIndex((meta) => meta.slug === problem.meta.slug);
  const nextInLesson = lessonPosition === -1 ? undefined : withinLesson[lessonPosition + 1];
  if (nextInLesson) return asLink(nextInLesson);

  const withinCourse = problem.meta.course ? getProblemMetaForCourse(problem.meta.course) : [];
  const coursePosition = withinCourse.findIndex((meta) => meta.slug === problem.meta.slug);
  if (coursePosition === -1) return undefined;
  const rest = withinCourse.slice(coursePosition + 1);
  const nextTopic = rest.find((meta) => meta.lesson !== problem.meta.lesson);
  const next = nextTopic ?? rest[0];
  return next ? asLink(next) : undefined;
}

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
      nextProblem={nextProblemAfter(problem)}
    />
  );
}
