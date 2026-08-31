import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { PillarScope } from "@/components/field/PillarScope";
import { PrerequisiteReadout } from "@/components/lessons/PrerequisiteReadout";
import {
  DISTANT_UPSTREAM_LESSONS,
  chainLessonCount,
  lessonPrerequisiteChain,
} from "@/components/apex/readiness";
import { ScrollableMathText } from "./ScrollableMathText";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import { ProblemContext } from "./ProblemContext";
import type { Problem } from "@/lib/problems/types";
import type { LessonMetaWithSlug } from "@/lib/content/types";

/** The in-page target `ProblemView` links to after a wrong answer. Exported
 *  so the caller that decides whether that link is worth offering (the route,
 *  which knows whether this problem declares any prerequisites) and the
 *  element it points at can never disagree about the id. */
export const PREREQUISITE_ANCHOR_ID = "problem-prerequisites";

/**
 * Everything about a problem page that doesn't need interactivity: the
 * breadcrumb, metadata, title, prompt, prerequisite links, and a link back
 * to the home lesson. Server-rendered, same division of labor as
 * `LessonLayout` around an MDX lesson body — `children` is the one
 * interactive piece (`ProblemView`). Sets the problem's course's pillar via
 * `PillarScope`, the same identity a student sees on the lesson this problem
 * came from.
 *
 * ============================================================
 * What is above the problem, and why so little
 * ============================================================
 * Measured in headless Chrome, this page used to open with 420px of chrome
 * above its own problem statement — a breadcrumb that wrapped to two 44px
 * rows at 375px, a badge strip, and the prerequisite readout — putting the
 * statement at y=557 of an 812px screen and the answer field off it. Three
 * of the four actions in the first screen were breadcrumbs.
 *
 * Everything above the statement now has to earn the position:
 *
 *  - **The breadcrumb stays**, because a reader who arrived from search or a
 *    shared link has no other way to find out what course this belongs to.
 *    The pillar crumb — a `<span>`, never a link — is dropped below `sm`,
 *    which is what made it two rows.
 *  - **The title stays.** It is the page.
 *  - **The metadata and the prerequisite readout collapse into one line**
 *    (`ProblemContext`), whose summary still states the difficulty, the
 *    answer type, the minutes and how many prerequisites this reader has
 *    open. Nothing is hidden that was not already a glance; the detail is one
 *    press away and the `#problem-prerequisites` route into it still works.
 *  - **The lesson backlink stays at the bottom**, where it already was: it is
 *    a way out, not orientation.
 */
export function ProblemLayout({
  problem,
  allLessons,
  children,
}: {
  problem: Problem;
  allLessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const homeLesson = problem.meta.lesson ? allLessons.find((lesson) => lesson.slug === problem.meta.lesson) : undefined;
  const prerequisites = (problem.meta.prerequisites ?? [])
    .map((slug) => allLessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));

  const course = getCourse(problem.meta.course);
  const pillar = course ? getPillar(course.pillar) : undefined;

  // The same transitive-distance readout lesson pages now carry, computed by
  // the same traversal so the two surfaces cannot disagree. A problem page has
  // exactly the property that made this worth building for lessons: it is
  // reachable directly from the catalog, from site search, from Google and
  // from a shared link, without ever passing the track page that has the
  // honest number. Before this, an Apex problem's readout said "0 / 1
  // complete" to a reader who was a hundred lessons upstream of it, which
  // understates the gap badly enough to be worse than saying nothing.
  // `undefined` below the threshold, so a reader already in range sees the
  // plain prerequisite chips and no lecture.
  const upstreamChain = lessonPrerequisiteChain(course?.slug, allLessons);
  const upstream =
    chainLessonCount(upstreamChain) >= DISTANT_UPSTREAM_LESSONS ? upstreamChain : undefined;

  return (
    <PillarScope pillar={course?.pillar}>
      {/* `tight`, the same call `/problems` and `/learn` make for the same
          reason: `--rhythm-section` is the gap between two thoughts on a page
          that has several, and it is 72px at 375px. A problem page is one
          thought and opens with it, so a full section's worth of air above the
          breadcrumb is 36px of the first screen spent on nothing. Note this
          has to be the prop, not a `className` — `Section` writes its padding
          as an inline `style`, which beats any class on the same element. */}
      <Section width="reading" tight>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/problems"
            className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
          >
            Problems
          </Link>
          {/* Hidden below `sm`. This crumb is a `<span>`, not a link: it
              navigates nowhere, and at 375px it was the item that pushed the
              row of 44px tap targets onto a second line, costing 48px directly
              above the problem. The pillar identity is still carried at every
              width by `PillarScope`'s colour on the whole page, by the course
              crumb beside it, and by the `BreadcrumbList` in the route's
              structured data, which is unchanged. */}
          {pillar ? (
            <>
              <span aria-hidden="true" className="hidden tech-label text-subtle-foreground sm:inline">
                /
              </span>
              <span className="hidden tech-label text-pillar-text sm:inline">{pillar.title}</span>
            </>
          ) : null}
          {/* The course is the crumb a reader actually needs when they landed
              here from search or a shared link: it is the page that says what
              this material is and in what order it is meant to be read. It
              was previously the one level of the hierarchy the breadcrumb
              skipped, even though `/courses/<slug>` is a real, statically
              generated route. */}
          {course ? (
            <>
              <span aria-hidden="true" className="tech-label text-subtle-foreground">
                /
              </span>
              <Link
                href={getCourseHref(course.slug)}
                className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
              >
                {course.title}
              </Link>
            </>
          ) : null}
        </nav>

        <SectionTitle level={1} size="xl" className="mt-4">
          {problem.meta.title}
        </SectionTitle>

        {/*
          "Can I attempt this yet?" — the same instrument a lesson answers it
          with, reused verbatim rather than re-implemented. The previous
          version listed prerequisite titles as a comma-separated line of
          links, which named what the problem assumes but said nothing about
          whether *this* reader already has it; a beginner arriving from the
          catalog, a search result or a shared link could only find out by
          opening each one. `PrerequisiteReadout` adds the missing half —
          per-prerequisite done/not-done (filled check vs. hollow ring, never
          color alone) plus an "N / M complete" readout — and its chips are
          already 44px tap targets. It reads client-side progress; nothing
          here gates or locks the problem, and a reader who wants to attempt
          something cold still can.

          What changed is only where it sits. As an always-open block directly
          under the title it was 72px, and the badge strip above it another
          65px, of an 812px phone screen spent before the problem. Both are
          now inside `ProblemContext`'s disclosure, whose one-line summary
          still carries the difficulty, the type, the minutes and this
          reader's outstanding prerequisite count. The `id` (so the "what does
          this build on?" route out of a wrong answer lands here) moves onto
          the `<details>`, which opens itself when that fragment targets it.
        */}
        <ProblemContext
          id={PREREQUISITE_ANCHOR_ID}
          difficulty={problem.meta.difficulty}
          problemType={problem.meta.problemType}
          estimatedMinutes={problem.meta.estimatedMinutes}
          prerequisiteSlugs={problem.meta.prerequisites ?? []}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {/* `withHint` here and nowhere else on the page: a reader who
                opened a panel to ask what "Intermediate" means should be told,
                and the hover-only `title` this otherwise carries does not
                exist on the touch devices this panel exists for. */}
            <DifficultyScale difficulty={problem.meta.difficulty} withHint />
            <TypeMark type={problem.meta.problemType} />
            <span className="tech-label">
              <span className="tech-value text-foreground">{problem.meta.estimatedMinutes}</span> min
            </span>
          </div>
          <PrerequisiteReadout
            prerequisites={prerequisites}
            upstream={upstream}
            distantAt={upstream ? DISTANT_UPSTREAM_LESSONS : undefined}
          />
        </ProblemContext>

        {/* `min-w-0` + `ScrollableMathText`: problem prompts are plain strings
            with inline `$...$`, so they never pass through the MDX pipeline and
            never meet `rehypeKatexHtml`. Without this a long bra-ket or
            matrix run pushes the whole document sideways at 320px. */}
        <div className="mt-6 min-w-0 rounded-panel border border-border border-l-4 border-l-pillar-edge bg-surface-muted/60 p-5 sm:p-6">
          <ScrollableMathText text={problem.question.prompt} className="text-lg leading-relaxed text-foreground" />
        </div>

        <div className="mt-6">{children}</div>

        {homeLesson ? (
          <>
            <FadeRule className="mt-14" />
            <div className="mt-8">
              <Link
                href={`/lessons/${homeLesson.slug}`}
                className="inline-flex min-h-11 items-center rounded-(--radius-tight) text-sm font-medium text-pillar-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
              >
                ← Back to &ldquo;{homeLesson.title}&rdquo;
              </Link>
            </div>
          </>
        ) : null}
      </Section>
    </PillarScope>
  );
}
