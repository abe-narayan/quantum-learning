import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionTitle, Lede } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { PillarScope } from "@/components/field/PillarScope";
import { COURSES, PILLARS, getCourse } from "@/lib/content/curriculum";
import type { Course, LessonMeta, LessonMetaWithSlug } from "@/lib/content/types";
import { getCourseCheckpointProblems } from "@/lib/problems/registry";
// The lazy wrapper, not `CourseCheckpoint` itself: a static import here put
// the whole ProblemView/KaTeX chain in the eager client graph of every
// lesson page, though the checkpoint renders only on a course's final
// lesson — see LazyCourseCheckpoint's doc comment.
import { LazyCourseCheckpoint } from "@/components/problems/LazyCourseCheckpoint";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { coursesReadBy } from "@/components/curriculum/prerequisiteClosure";
import { LessonCompleteToggle } from "./LessonCompleteToggle";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { TableOfContentsDesktop, TableOfContentsMobile } from "./TableOfContents";
import { LessonMetaStrip } from "./LessonMetaStrip";
import { LessonFooterNav } from "./LessonFooterNav";
import { LessonInstrumentLine } from "./LessonInstrumentLine";
import { LessonObjectives } from "./LessonObjectives";
import { PrerequisiteReadout } from "./PrerequisiteReadout";
// The graph walk `/apex` and `/mastery` already use, rooted at one course.
// Server-side by construction: it reads the curriculum registry, and only the
// flat result crosses into `PrerequisiteReadout`.
import {
  DISTANT_UPSTREAM_LESSONS,
  chainLessonCount,
  lessonPrerequisiteChain,
} from "@/components/apex/readiness";
import { RelatedCurrentQuantum } from "@/components/currentQuantum/RelatedCurrentQuantum";

/** `id` of the prose container — shared by the ToC and reading-progress bar
 * so they can each find it via `document.getElementById` after mount. */
const LESSON_PROSE_ID = "lesson-prose";

function moduleIndex(course: Course | undefined, moduleSlug: string): number {
  return course?.modules.findIndex((module) => module.slug === moduleSlug) ?? -1;
}

function sortByCourseOrder(lessons: LessonMetaWithSlug[], course: Course | undefined) {
  return [...lessons].sort((a, b) => moduleIndex(course, a.module) - moduleIndex(course, b.module));
}

/** The lesson that corresponds to a course's first module, if one has been authored. */
function firstLessonOf(targetCourse: Course, allLessons: LessonMetaWithSlug[]): LessonMetaWithSlug | undefined {
  const firstModule = targetCourse.modules[0];
  if (!firstModule) return undefined;
  return allLessons.find(
    (lesson) => lesson.course === targetCourse.slug && lesson.module === firstModule.slug,
  );
}


/**
 * ============================================================
 * A forward link the reader can actually follow
 * ============================================================
 * This used to be `COURSES.filter(c => c.prerequisites.includes(finished))`,
 * the bare reverse edge, which is a half-truth and the half it leaves out is
 * the one that strands people. 24 forward edges in the graph point at a
 * course that needs *another* prerequisite the reader has not been sent to:
 * finishing Wave Mechanics offered "Start Operators, Observables &
 * Measurement", which also wants Quantum Gates & Circuits from the Computing
 * track, so the confident-looking next step landed the reader on a course
 * telling them they were not ready. `/courses/[slug]` was fixed the same way
 * in this sprint; this mirrors it so the two surfaces cannot disagree about
 * what comes next.
 *
 * Annotated, not hidden. A reader who can see that the next course needs one
 * more thing has something useful; dropping it silently makes the curriculum
 * look smaller than it is. Startable courses sort first, so the cap of three
 * can never spend all its slots on blocked ones.
 *
 * When *no* dependent is startable, the reverse edge has no usable answer at
 * all, and the courses the closure has just opened are the better one, same
 * substitution and same suppression rule the course page uses.
 */
export function nextCoursesAfter(
  finishedCourse: Course,
  allLessons: LessonMetaWithSlug[],
): { course: Course; lesson: LessonMetaWithSlug; alsoNeeds: Course[] }[] {
  const behind = coursesReadBy(finishedCourse.slug);
  const withLesson = (candidate: Course, alsoNeeds: Course[]) => {
    const lesson = firstLessonOf(candidate, allLessons);
    return lesson ? { course: candidate, lesson, alsoNeeds } : null;
  };

  const dependents = COURSES.filter((candidate) =>
    candidate.prerequisites.includes(finishedCourse.slug),
  );
  const dependentRows = dependents
    .map((candidate) =>
      withLesson(
        candidate,
        candidate.prerequisites
          .filter((prereqSlug) => !behind.has(prereqSlug))
          .map((prereqSlug) => getCourse(prereqSlug))
          .filter((c): c is Course => Boolean(c)),
      ),
    )
    .filter((row): row is { course: Course; lesson: LessonMetaWithSlug; alsoNeeds: Course[] } =>
      Boolean(row),
    )
    .sort((a, b) => a.alsoNeeds.length - b.alsoNeeds.length);

  if (dependentRows.some((row) => row.alsoNeeds.length === 0)) return dependentRows.slice(0, 3);

  const dependentSlugs = new Set(dependents.map((candidate) => candidate.slug));
  const nowOpen = COURSES.filter(
    (candidate) =>
      !behind.has(candidate.slug) &&
      !dependentSlugs.has(candidate.slug) &&
      candidate.prerequisites.every((prereqSlug) => behind.has(prereqSlug)),
  )
    .map((candidate) => withLesson(candidate, []))
    .filter((row): row is { course: Course; lesson: LessonMetaWithSlug; alsoNeeds: Course[] } =>
      Boolean(row),
    );

  // Blocked dependents still ship when nothing is open, because "the next
  // course needs one more thing, and here is which" beats no forward link.
  return (nowOpen.length > 0 ? nowOpen : dependentRows).slice(0, 3);
}

export function LessonLayout({
  meta,
  slug,
  course,
  allLessons,
  children,
}: {
  meta: LessonMeta;
  slug: string;
  course: Course | undefined;
  /**
   * Every authored lesson site-wide. Prerequisites resolve against this
   * (so a lesson can require a lesson from a *different* course without
   * any special-casing); previous/next navigation is derived from the
   * subset that belongs to the current course, so it stays course-local.
   */
  allLessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const pillar = course ? PILLARS.find((p) => p.slug === course.pillar) : undefined;

  // Same helper CourseList/CourseTimeline use to decide a course's primary
  // click target — see courseHref.ts. Resolves to the real /courses/<slug>
  // page (live as of this pass) with a same-behavior fallback to the
  // course's first authored lesson if that route is ever pulled, so this
  // breadcrumb segment never points at a dead link either way.
  const courseHref = course
    ? getCourseHref(course.slug, firstLessonOf(course, allLessons)?.slug)
    : undefined;

  const position = moduleIndex(course, meta.module);
  const totalModules = course?.modules.length ?? 0;
  // The missing rung between the breadcrumb's course segment and the lesson
  // title — see LessonInstrumentLine's doc comment.
  const moduleTitle = position >= 0 ? course?.modules[position]?.title : undefined;

  const courseLessons = allLessons.filter((lesson) => lesson.course === course?.slug);
  const orderedLessons = sortByCourseOrder(courseLessons, course);
  const currentPos = orderedLessons.findIndex((lesson) => lesson.slug === slug);
  const prevLesson = currentPos > 0 ? orderedLessons[currentPos - 1] : null;
  const nextLesson =
    currentPos >= 0 && currentPos < orderedLessons.length - 1 ? orderedLessons[currentPos + 1] : null;

  // When this is the last lesson of its course, surface real courses that list this
  // course as a prerequisite (a genuine "what's next"), instead of silently omitting
  // the "Next" card. Falls back to a pointer back into the catalog for terminal courses
  // that nothing else builds on.
  const isLastLessonOfCourse = currentPos >= 0 && currentPos === orderedLessons.length - 1;
  const finishedCourse = isLastLessonOfCourse ? course : undefined;
  const nextCourseSuggestions = finishedCourse
    ? nextCoursesAfter(finishedCourse, allLessons)
    : [];
  const checkpointProblems = finishedCourse ? getCourseCheckpointProblems(finishedCourse.slug) : [];

  // ============================================================
  // `related` and `prerequisites` overlap, on purpose — merge, don't filter
  // ============================================================
  // 42 of the corpus's 125 `related[]` entries (across 38 of the 107 lessons
  // that author any) name a lesson that is already in the same lesson's
  // `prerequisites`. At a third of the corpus that is an authoring
  // convention, not 42 typos: an author who has just written "this lesson
  // requires X" reaches for `related` precisely because that is the only
  // field with a `note`, and the note is where they explain *what X gives
  // this lesson*. `apex/algorithmic-frontiers/quantum-signal-processing`'s
  // entry for `block-encodings-and-linear-combinations-of-unitaries` is a
  // three-clause explanation of how block encoding, QSP and QSVT compose;
  // nothing else on the page says it.
  //
  // Rendered naively that produced the same lesson twice inside one
  // disclosure panel — once as a bare title under "Requires", once with its
  // note under "Related elsewhere", where the heading is also simply false
  // for a same-course prerequisite.
  //
  // Two fixes were available. Filtering `related` against `prerequisites`
  // is one line and deletes the duplicate — along with all 42 of the
  // hand-written notes, which are the single most useful text in this
  // block and the only place any prerequisite is explained rather than
  // merely named. That trades a cosmetic duplicate for a real content loss,
  // and it loses it silently, on exactly the entries an author cared enough
  // to gloss.
  //
  // So: merge instead. A `related` entry whose slug is also a prerequisite
  // becomes that prerequisite's reason-for-being, attached to the "Requires"
  // entry; only entries that are genuinely elsewhere stay under "Related
  // elsewhere". Each lesson is now named exactly once, every note survives,
  // and the section headings become true. The lookup is by slug against the
  // already-resolved prerequisite list, so a `related` entry pointing at a
  // slug that no longer exists still falls out the same way it always did
  // (see linkIntegrity.test.ts).
  const relatedNotesBySlug = new Map((meta.related ?? []).map((entry) => [entry.slug, entry.note]));

  const prerequisites = meta.prerequisites
    .map((prereqSlug) => allLessons.find((lesson) => lesson.slug === prereqSlug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson))
    .map((lesson) => ({ lesson, note: relatedNotesBySlug.get(lesson.slug) }));

  /** Just the lessons, for the components that only need the link + title. */
  const prerequisiteLessons = prerequisites.map((entry) => entry.lesson);

  // ============================================================
  // How far away is this, really
  // ============================================================
  // `meta.prerequisites` is the immediate edge list, and rendering only that
  // told a reviewer arriving on an Apex lesson from search that they were
  // "0 / 1" from being ready when the graph put 110 lessons behind the page.
  // `/apex` never had that problem because it walks the ancestry. This is the
  // same walk, from `components/apex/readiness`, so there is one traversal on
  // the site rather than two that can drift.
  //
  // Pruned here rather than in the client leaf: a chain that is already under
  // the threshold at a standing start can never cross it once a reader's
  // completions are subtracted, so 147 of the 219 lessons ship no chain at
  // all and the other 72 ship only course titles and lesson slugs.
  const upstreamChain = lessonPrerequisiteChain(course?.slug, allLessons);
  const upstream =
    chainLessonCount(upstreamChain) >= DISTANT_UPSTREAM_LESSONS ? upstreamChain : undefined;

  // Reverse index of prerequisites, computed for free from data every lesson
  // already carries: other-course lessons that list this one as a
  // prerequisite. No authoring required, so it can be shown unconditionally
  // whenever it's non-empty.
  const resurfacesIn = allLessons.filter(
    (lesson) => lesson.prerequisites.includes(slug) && lesson.course !== meta.course,
  );

  // Hand-curated cross-links (see `related` on LessonMeta), minus the ones
  // that were folded into `prerequisites` above — those are the same lesson
  // and their notes are already being rendered there. What is left is what
  // the heading claims: lessons that are genuinely somewhere else in the
  // graph, neither required by nor requiring this one.
  const relatedElsewhere = (meta.related ?? [])
    .filter((entry) => !meta.prerequisites.includes(entry.slug))
    .map((entry) => {
      const lesson = allLessons.find((candidate) => candidate.slug === entry.slug);
      return lesson ? { lesson, note: entry.note } : null;
    })
    .filter((entry): entry is { lesson: LessonMetaWithSlug; note: string } => Boolean(entry));

  return (
    // Retints accents, focus rings, prose links, equation slabs and the
    // background field to this lesson's course's pillar — see
    // docs/DESIGN_SYSTEM.md §2. `course` (and therefore `pillar`) can be
    // undefined for a lesson with no resolvable course; PillarScope's own
    // `pillar` prop is optional for exactly this reason, and everything
    // below reads pillar-tinted tokens that fall back to the default
    // (brand-family) ramp when no `data-pillar` is set.
    <PillarScope pillar={course?.pillar}>
      <ReadingProgressBar containerId={LESSON_PROSE_ID} />
      {/* `data-difficulty` feeds the earned master-density shift in
          globals.css (tighter prose leading on master lessons only). */}
      {/* `pt-6` on a phone, not `pt-10`. 40px of empty page under a 64px
          sticky navbar, above an 11px breadcrumb label, is 16px spent on air
          in the one band this pass is trying to give back to the teaching;
          the desktop rhythm is unchanged, where there is room for it. */}
      <Container data-difficulty={meta.difficulty} className="pb-20 pt-6 sm:pt-14">
        {/* Every crumb is `inline-flex min-h-11 items-center`, which is the
            recipe `ProblemLayout`'s breadcrumb already uses and the one the
            footer's reference links use. It is not decoration.

            `.tech-label` is 11px, so a bare crumb was a 13px-tall target, and
            `gap-y-1` puts 4px between the rows this nav wraps into on a phone
            (it wraps into two at 375px on any lesson with a course). WCAG 2.2
            SC 2.5.8 lets an undersized target pass on spacing alone, but only
            if a 24px circle centred on it reaches no other target: at 13px
            tall and 4px apart those circles overlap by 15px, so the spacing
            exception is not available and this was a real AA failure on 800+
            pages, not just a miss against this codebase's stricter 44px floor.

            The painted crumb does not change — the label is the same 11px in
            the same colour — so this is the same "grow the hit area, leave the
            mark alone" move as `TOUCH_TARGET_CLASSES`, done with `min-h`
            rather than a pseudo-element because these targets stack
            vertically when they wrap and a 44px `::after` centred on each
            would have them overlapping each other instead. The cost is real
            and is the reason it is written down: the nav is 44px tall instead
            of 13, and ~92px instead of 30 on a phone where it wraps.

            The focus ring is spelled out per crumb because the global
            `:focus-visible` outline paints 2px outside the border box, and
            the border box is now 44px tall: without the tight radius the ring
            would be a full-height rectangle around a short label. */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/learn"
            className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground"
          >
            Learn
          </Link>
          {pillar ? (
            <>
              <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
                /
              </span>
              <Link
                href={`/learn#${pillar.slug}`}
                className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground"
              >
                {pillar.title}
              </Link>
            </>
          ) : null}
          {course ? (
            <>
              <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
                /
              </span>
              {/* Destination resolved via the shared getCourseHref (see
                  above) rather than a hardcoded /courses/<slug> — the same
                  single decision point CourseList/CourseTimeline use, so
                  this breadcrumb segment tracks whatever they'd resolve to
                  without duplicating the live/fallback logic here. */}
              <Link
                href={courseHref ?? "/learn"}
                className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-pillar-text transition-colors hover:text-foreground"
              >
                {course.title}
              </Link>
            </>
          ) : null}
        </nav>

        {/* ============================================================
            The pre-content stack, and the band it used to be
            ============================================================
            docs/BEGINNER_REVIEW.md's headline friction here was "five
            stacked instruments before 'Motivation'": difficulty +
            readouts, progress rule, prerequisites, objectives — each
            individually justified, together a wall between the reader and
            the first sentence of the lesson. An earlier pass collapsed the
            three blocks that all answered the *same* question ("how hard,
            how far in, how long") into one dense `LessonInstrumentLine`
            row, and stopped there, on the grounds that nothing left in the
            band was junk.

            Nothing left in it is junk, and it was still a screenful.
            Measured at 375x812 before this pass, the first teaching
            paragraph started at 905px on the entry lesson, 1163px on a
            mid-curriculum one and 1321px on an Apex lesson: on a phone, a
            reader's whole first screen of a *lesson* was chrome about the
            lesson. Two of the four blocks below therefore became one-line
            controls instead of open blocks, and the contents toggle moved
            up into this stack from its old position below it:

            - `LessonInstrumentLine` — unchanged, one row.
            - `PrerequisiteReadout` — unchanged, still fully expanded for
              every reader on every lesson. docs/BEGINNER_REVIEW.md calls it
              the single best beginner-honesty mechanism on the site, it is
              the highest-value item above the fold, and folding it would
              hide the one fact a reader arriving from search cannot afford
              to miss.
            - `LessonObjectives` — now folded for everyone rather than only
              for advanced/master readers. See its doc comment: the entry
              lesson is precisely the page where the fold pays, because it
              is the one whose lede is short enough for the teaching to
              reach the first viewport once this is a single row.
            - `TableOfContentsMobile` — same control, one line instead of
              two, and inside the stack rather than 32px below it. It is a
              *preview* of the lesson in exactly the sense the objectives
              list is, so the two read as a pair.

            What deliberately stays above the teaching: the breadcrumb (the
            only "where am I" on the page), the title, the lede, the
            instrument row, and the prerequisite readout. */}
        <div className="mt-6 max-w-reading">
          <SectionTitle level={1} size="xl">
            {meta.title}
          </SectionTitle>
          <Lede className="mt-4">{meta.description}</Lede>

          <LessonInstrumentLine
            className="mt-(--rhythm-tight)"
            difficulty={meta.difficulty}
            moduleTitle={course ? moduleTitle : undefined}
            position={course ? position : -1}
            totalModules={totalModules}
            estimatedMinutes={meta.estimatedMinutes}
          />

          {/* "Do I have what I need?" — above the fold, unmissable, but a
              single compact row rather than the old multi-column Lineage
              wall (see PrerequisiteReadout.tsx for the full reasoning and
              docs/UX_REVIEW.md P2-6 for why it can't just move back to being
              that wall). Full cross-course detail stays in LessonMetaStrip's
              disclosure below the body. It also carries the transitive
              distance readout when this lesson is far enough up the graph for
              the chip row alone to mislead — see that file's second header. */}
          <PrerequisiteReadout
            prerequisites={prerequisiteLessons}
            upstream={upstream}
            distantAt={upstream ? DISTANT_UPSTREAM_LESSONS : undefined}
          />

          {/* The two previews, as a pair. Either can be absent — a lesson
              with no `objectives`, or one with fewer than four `##` sections
              — and `space-y-3` then costs nothing, so this never leaves a
              gap where a missing control was. */}
          <div className="mt-(--rhythm-tight) space-y-3">
            <LessonObjectives objectives={meta.objectives} />
            <TableOfContentsMobile containerId={LESSON_PROSE_ID} />
          </div>
        </div>

        {/* Two-column at `lg`: prose keeps its own `max-w-reading` regardless
            of which branch of `has-[nav:empty]` is active, so this grid
            switching between one and two columns never reflows the reading
            column itself — only whether the rail's space is reserved. 46rem is
            the site's stated reading measure (docs/DESIGN_SYSTEM.md), shared
            by the pre-content stack above so the columns align. */}
        <div className="mt-(--rhythm-open) lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10 lg:has-[nav:empty]:grid-cols-1">
          <div
            id={LESSON_PROSE_ID}
            className={cn(
              // Prose colors are theme-switched entirely in globals.css, not
              // via Tailwind's `dark:` variant. The site is dark-first, so
              // the bare `.prose` block there IS the dark ramp and the
              // *light* values live under `[data-theme="light"]` /
              // `prefers-color-scheme: light`. Either direction, `dark:` is
              // the wrong tool: this app's theme is driven by the
              // `data-theme` attribute (ThemeToggle), while Tailwind v4's
              // `dark:` defaults to `@media (prefers-color-scheme: dark)`
              // with no `@custom-variant dark` redefinition anywhere in this
              // repo — so it would only ever track the OS preference and
              // invert wrongly whenever an explicit choice disagrees with it.
              "prose prose-neutral max-w-reading prose-a:text-pillar-text",
              // h2 = section-moment: display face, real weight/spacing, the
              // biggest thing in the prose body short of the page's own h1.
              "prose-h2:font-display prose-h2:mt-16 prose-h2:mb-4 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight",
              // h3 stays Geist Sans (inherits body font) but genuinely bolder
              // and more distinct from body copy than the plugin's default.
              // `text-2xl`, not `text-xl`: these sizes are absolute, and the
              // prose base is 18px (globals.css §"reading measure"), so
              // `text-xl` left an h3 at 1.11x the paragraph under it — below
              // the 1.25x it was drawn against when the base was 16px. 24px
              // restores that relationship and still sits clearly under h2
              // (30px, display face, with its own section marker).
              "prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-2xl prose-h3:font-bold prose-h3:tracking-tight",
              // h4 = small-caps-style label, not "h3 but smaller": uppercase,
              // tracking-wide, muted, small — a section label, not a heading.
              // `text-sm`, not `text-xs`, for the same absolute-vs-18px reason:
              // `text-xs` rendered a heading at 0.67x the body it heads, which
              // is small enough that the label treatment reads as damage. 14px
              // keeps the label voice and stays legible.
              "prose-h4:mt-8 prose-h4:mb-2 prose-h4:text-sm prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-wide prose-h4:text-muted-foreground"
            )}
          >
            {children}
          </div>
          <TableOfContentsDesktop containerId={LESSON_PROSE_ID} />
        </div>

        <RelatedCurrentQuantum lessonSlug={slug} />

        {/* Curriculum lineage (prerequisites / resurfaces-in / related
            elsewhere) moves below the lesson body rather than sitting
            between the title and the prose — see docs/UX_REVIEW.md P2-6 and
            the comment in LessonMetaStrip.tsx. It's a collapsed `<details>`,
            not deleted or hidden: a reader who wants it before starting can
            still scroll down and open it in one glance at the summary line,
            but it no longer taxes every reader on every lesson. */}
        <LessonMetaStrip
          currentCourseSlug={meta.course}
          prerequisites={prerequisites}
          resurfacesIn={resurfacesIn}
          relatedElsewhere={relatedElsewhere}
        />

        <FadeRule className="mt-14 max-w-reading" />

        <div className="mt-10 max-w-reading">
          <LessonCompleteToggle slug={slug} />
        </div>

        <LessonFooterNav
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          finishedCourse={finishedCourse}
          nextCourseSuggestions={nextCourseSuggestions}
          pillar={pillar}
          unlocks={resurfacesIn}
          course={course}
          courseHref={courseHref}
        />

        {finishedCourse && checkpointProblems.length > 0 ? (
          <div className="mt-10 max-w-reading">
            <LazyCourseCheckpoint courseTitle={finishedCourse.title} problems={checkpointProblems} />
          </div>
        ) : null}
      </Container>
    </PillarScope>
  );
}
