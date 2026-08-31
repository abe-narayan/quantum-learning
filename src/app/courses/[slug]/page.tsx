import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Instrument, FadeRule } from "@/components/ui/Panel";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { CourseProgressBadge } from "@/components/curriculum/CourseProgressBadge";
import { LessonCompletionMark } from "@/components/curriculum/LessonCompletionMark";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { TierLadder } from "@/components/pillar/TierLadder";
import { coursesReadBy } from "@/components/curriculum/prerequisiteClosure";
import { COURSES, getCoursesByPillar, getCourse, getPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { PILLAR_ORDER, pillarDepth } from "@/lib/design/pillars";
import { cn } from "@/lib/utils";
import { MathText } from "@/components/ui/MathText";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";
import { PrerequisiteStatus } from "./PrerequisiteStatus";
import { difficultySpread, spreadIsInformative, technicalRegister } from "./assumedBackground";

/**
 * ============================================================
 * /courses/[slug], the course as a real, linkable place
 * ============================================================
 * Every course in `COURSES` (src/lib/content/curriculum.ts) gets exactly one
 * of these, statically generated. Before this route existed a course had no
 * page of its own: it was only ever an expanded block inside `/learn` or a
 * pillar page, unaddressable and invisible to search. See the sprint brief
 * for the full rationale.
 *
 * The page answers two different audiences without splitting into two
 * pages: a beginner's "what is this, what do I need, where do I start" and
 * an advanced reader's "show me the full module manifest, what this unlocks,
 * and where it sits in the curriculum." Composition (typography, spacing,
 * grouping, reading column, then an asymmetric split, then a full-bleed
 * instrument) rather than a uniform grid of module cards, per
 * docs/DESIGN_SYSTEM.md §5.
 */

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * `pillarUrl()` is absolute (`https://…/mechanics`) because everything else
 * that calls it, canonicals, JSON-LD `@id`s, breadcrumb schema, requires an
 * absolute URL. This page is the one place that also needs the *navigable*
 * form, and handing that absolute URL to `<Link>` sent the visible breadcrumb
 * off-site to the placeholder domain in `structuredData.ts`. Deriving it from
 * the same function rather than repeating the pillar→path table keeps the two
 * in lockstep: a renamed track route stays correct here for free.
 */
function trackPath(pillar: Course["pillar"]): string {
  return pillarUrl(pillar).slice(BASE_URL.length);
}

export async function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};

  return buildPageMetadata({
    title: course.title,
    description: course.description,
    path: `/courses/${course.slug}`,
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const pillarInfo = getPillar(course.pillar);
  const lessons = await getAllLessonsMeta();

  // Same derivation CourseList/CourseTimeline use, kept in lockstep so this
  // page's "X/Y lessons" and completion state never disagree with the
  // pillar pages a visitor arrived from.
  const lessonByModule = new Map(
    lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => [lesson.module, lesson])
  );
  const totalModules = course.modules.length;
  const authoredModules = course.modules.filter((module) => lessonByModule.has(module.slug)).length;
  const isContentComplete = totalModules > 0 && authoredModules === totalModules;
  const authoredLessonSlugs = course.modules
    .map((module) => lessonByModule.get(module.slug)?.slug)
    .filter((s): s is string => Boolean(s));
  const firstLesson = course.modules
    .map((module) => lessonByModule.get(module.slug))
    .find((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));

  const prerequisiteCourses = course.prerequisites
    .map((prereqSlug) => getCourse(prereqSlug))
    .filter((c): c is Course => Boolean(c));
  const prerequisiteRows = prerequisiteCourses.map((prereq) => {
    const prereqLessonByModule = new Map(
      lessons.filter((lesson) => lesson.course === prereq.slug).map((lesson) => [lesson.module, lesson])
    );
    const prereqLessonSlugs = prereq.modules
      .map((module) => prereqLessonByModule.get(module.slug)?.slug)
      .filter((s): s is string => Boolean(s));
    return { course: prereq, lessonSlugs: prereqLessonSlugs };
  });

  // The reverse edge: computed from COURSES, never hardcoded, so a new
  // course that lists this one as a prerequisite shows up here automatically.
  const dependentCourses = COURSES.filter((candidate) => candidate.prerequisites.includes(course.slug));

  /**
   * ------------------------------------------------------------
   * "What now?", answered against what the reader actually has
   * ------------------------------------------------------------
   * `behind` is everything a reader standing at the end of this course has
   * necessarily read: the transitive prerequisite closure, plus this course.
   *
   * It exists because the reverse edge alone is a half-truth, and the half it
   * leaves out is the one that strands people. 24 of the graph's 32 courses
   * have at least one forward edge into a course that needs *another*
   * prerequisite the reader has not been sent to: finishing Wave Mechanics
   * points at Operators, Observables & Measurement, which also wants Quantum
   * Gates & Circuits from the Computing track; finishing Noise, Decoherence &
   * Scaling points at Rigorous Quantum Information Theory, which also wants
   * Advanced Topics in Quantum Mechanics *and* Quantum Error Correction, so
   * every single forward pointer on that page was to a course the reader
   * could not open. Naming the gap costs one clause and turns a wall into an
   * itinerary.
   */
  const behind = coursesReadBy(course.slug);

  const dependentRows = dependentCourses.map((dependent) => ({
    course: dependent,
    /** Its other prerequisites, the ones finishing this course does not supply. */
    alsoNeeds: dependent.prerequisites
      .filter((prereqSlug) => !behind.has(prereqSlug))
      .map((prereqSlug) => getCourse(prereqSlug))
      .filter((c): c is Course => Boolean(c)),
  }));

  // Courses that become startable on finishing this one, counting everything
  // it already required. The five terminal courses have no reverse edge at
  // all, and a handful more (Noise, Decoherence & Scaling; Algorithmic
  // Frontiers) have one that is blocked — this is what keeps either case from
  // ending on a page with no forward move. Suppressed whenever a dependent is
  // already startable, since then the reverse edge is the better answer and a
  // second list would just be noise.
  const dependentSlugs = new Set(dependentCourses.map((dependent) => dependent.slug));
  const nowOpen = COURSES.filter(
    (candidate) =>
      !behind.has(candidate.slug) &&
      !dependentSlugs.has(candidate.slug) &&
      candidate.prerequisites.every((prereqSlug) => behind.has(prereqSlug))
  );
  const hasStartableDependent = dependentRows.some((row) => row.alsoNeeds.length === 0);
  const showNowOpen = !hasStartableDependent && nowOpen.length > 0;

  const pillarCourses = getCoursesByPillar(course.pillar);
  const positionInPillar = pillarCourses.findIndex((c) => c.slug === course.slug);
  const trackPosition = pillarDepth(course.pillar) + 1;
  const trackTotal = PILLAR_ORDER.length;

  // Real, authored learning objectives, pulled from every lesson that is
  // actually written for this course, in module order, deduplicated. Never
  // fabricated: a course with no authored lessons yet gets an honest empty
  // state instead of an invented outcomes list.
  const outcomes: string[] = [];
  const seenOutcomes = new Set<string>();
  for (const courseModule of course.modules) {
    const lesson = lessonByModule.get(courseModule.slug);
    if (!lesson) continue;
    for (const objective of lesson.objectives) {
      if (seenOutcomes.has(objective)) continue;
      seenOutcomes.add(objective);
      outcomes.push(objective);
    }
  }
  const displayedOutcomes = outcomes.slice(0, 6);

  // The honest "what background does this actually want?" answer, derived
  // from the same authored lessons, see ./assumedBackground.ts.
  const courseLessons = course.modules
    .map((courseModule) => lessonByModule.get(courseModule.slug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));
  const register = technicalRegister(courseLessons);
  const spread = difficultySpread(courseLessons);

  const url = `${BASE_URL}/courses/${course.slug}`;
  const courseSchema = buildCourseSchema(course, url);
  // Kept in step with the visible breadcrumb below, which reads
  // Learn / <track> / <course>, a schema trail that disagrees with the
  // rendered one is the kind of mismatch search engines flag.
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Learn", url: `${BASE_URL}/learn` },
    ...(pillarInfo ? [{ name: pillarInfo.title, url: pillarUrl(course.pillar) }] : []),
    { name: course.title, url },
  ]);

  return (
    <PillarScope pillar={course.pillar}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseSchema, breadcrumbSchema]) }}
      />

      {/* -------------------------------------------------------------
          Hero, the beginner's first four questions answered in one
          reading column: what is this, how hard/long, what do I need,
          where do I start.
          ------------------------------------------------------------- */}
      {/* `tight`, not `className="pt-4 sm:pt-8"`: `Section` writes its
          vertical padding as an inline `style`, which always beats a class on
          the same element, so that override compiled fine and applied to
          nothing, the page opened with the full `--rhythm-section` (72px at
          320px, 136px on a wide desktop) where 16px was asked for. `tight` is
          the prop that actually reduces it. Same dead override as /learn's
          hero, error.tsx and not-found.tsx. */}
      <Section width="reading" tight>
        {/* `inline-flex min-h-11 items-center` on each crumb, matching
            `LessonLayout` and `ProblemLayout`: an 11px `.tech-label` link is a
            13px-tall target, and at 4px of `gap-y-1` between wrapped rows the
            24px circles WCAG 2.5.8's spacing exception asks about overlap, so
            the undersized target had no exception to fall back on. The
            painted label is unchanged; only the box around it grows. See the
            longer note at the same nav in `components/lessons/LessonLayout.tsx`. */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/learn"
            className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground"
          >
            Learn
          </Link>
          {pillarInfo ? (
            <>
              <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
                /
              </span>
              <Link
                href={trackPath(course.pillar)}
                className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground"
              >
                {pillarInfo.title}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
            /
          </span>
          <span className="tech-label text-pillar-text">{course.title}</span>
        </nav>

        {/* The h1 renders immediately, not inside a Reveal, matching every
            other pillar-scoped page's above-the-fold title. */}
        <Eyebrow className="mt-6">
          {pillarInfo?.title ?? "Course"}
          {positionInPillar >= 0 ? ` · Course ${positionInPillar + 1} of ${pillarCourses.length}` : ""}
        </Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3">
          {course.title}
        </SectionTitle>
        <Lede className="mt-5 max-w-lede">{course.description}</Lede>

        <Reveal delay={80} className="mt-(--rhythm-close) flex flex-wrap items-center gap-x-8 gap-y-4">
          <DifficultyMark difficulty={course.difficulty} />
          <Readouts
            items={[
              { label: "Length", value: course.estimatedHours, unit: "hrs" },
              // "11/11 complete" read as a progress bar that had stalled at
              // the end rather than as a finished course; the fraction is a
              // hedge against an authoring gap, and every course now has one
              // written lesson per declared module. So the fraction appears
              // only while there is a gap, matching `pillarReadoutItems`,
              // /learn and /mastery.
              isContentComplete
                ? { label: "Lessons", value: authoredModules }
                : { label: "Lessons", value: `${authoredModules}/${totalModules}` },
              { label: "Track", value: `${trackPosition}/${trackTotal}`, unit: pillarInfo?.title },
            ]}
          />
        </Reveal>

        {authoredLessonSlugs.length > 0 ? (
          <Reveal delay={120} className="mt-2">
            <CourseProgressBadge lessonSlugs={authoredLessonSlugs} />
          </Reveal>
        ) : null}

        {/* One unmistakable primary action, above every manifest and readout.
            Two lines rather than one: the first is the instruction ("Start
            the first lesson"), which is the same on every course page and so
            is scannable without reading; the second names the lesson it will
            actually open, so nobody has to click to find out where they land.
            `min-h-14` keeps it well past the 44px touch minimum even when the
            second line wraps. */}
        <Reveal delay={140} className="mt-8">
          {firstLesson ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/lessons/${firstLesson.slug}`}
                className="group inline-flex min-h-14 max-w-full flex-col justify-center rounded-panel border-2 border-pillar-edge bg-pillar-wash px-6 py-3 transition-[background-color,transform] hover:bg-pillar-wash/70 motion-safe:hover:-translate-y-0.5"
              >
                <span className="tech-label text-sm text-pillar-text">
                  Start the first lesson{" "}
                  <span aria-hidden="true" data-decorative="">
                    →
                  </span>
                </span>
                <span className="mt-1 text-xs leading-snug text-muted-foreground">
                  {firstLesson.title} · {firstLesson.estimatedMinutes} min
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-subtle-foreground">
                {prerequisiteRows.length === 0
                  ? "Nothing is required before this course."
                  : `${prerequisiteRows.length} course${prerequisiteRows.length === 1 ? "" : "s"} come${prerequisiteRows.length === 1 ? "s" : ""} before this one. See below.`}
              </p>
            </div>
          ) : (
            <p className="tech-label text-subtle-foreground">
              Lessons for this course haven&rsquo;t been published yet. Check back soon.
            </p>
          )}
        </Reveal>

        {/* The same four-rung ladder the six track pages carry, in the same
            shape, placed *below* the primary action rather than above it so it
            answers "how deep is this?" without pushing "Start the first
            lesson" further down the page.
            A course page is where most search traffic actually lands, and
            until now it reported its position on two axes the reader has no
            reference for ("Course 2 of 6", "Track 4/6") and none at all on the
            axis that decides whether they are in the right place: whether this
            is ground floor, core, the rigorous pass, or the summit. */}
        <Reveal delay={160}>
          <TierLadder pillar={course.pillar} className="mt-(--rhythm-close)" />
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------
          Prerequisites, plain, honest, and linked.
          ------------------------------------------------------------- */}
      <Section width="reading" tight>
        <FadeRule />
        <Reveal className="mt-10">
          <Eyebrow>Before you start</Eyebrow>
          <SectionTitle level={2} size="md" className="mt-2">
            What you need first
          </SectionTitle>
        </Reveal>

        {prerequisiteRows.length === 0 ? (
          <Reveal delay={60} className="mt-5">
            <Instrument label="Prerequisites">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-medium">No course comes before this one.</span> Nothing on this
                site has to be read first.
              </p>
            </Instrument>
          </Reveal>
        ) : (
          <Reveal delay={60} className="mt-5">
            <Instrument
              label="Prerequisites"
              readout={
                <span className="font-tech text-xs text-subtle-foreground">
                  {prerequisiteRows.length} course{prerequisiteRows.length === 1 ? "" : "s"}
                </span>
              }
              footnote="Resolved from this course's own prerequisites list; nothing here is asserted independently of the curriculum data."
            >
              {/* Whole-row links, like the module manifest below: the row is
                  the target, `min-h-11` guarantees the 44px minimum, and the
                  status readout inside is a plain <span>, never a nested
                  control. */}
              <ul className="divide-y divide-border">
                {prerequisiteRows.map(({ course: prereq, lessonSlugs }) => (
                  <li key={prereq.slug}>
                    <Link
                      href={`/courses/${prereq.slug}`}
                      className="-mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-(--radius-tight) px-2 py-2.5 transition-colors hover:bg-surface-muted"
                    >
                      <span className="text-sm font-medium text-foreground">{prereq.title}</span>
                      {/* Not `shrink-0`: at 200% text zoom `DifficultyMark` plus
                          `PrerequisiteStatus` refused to shrink at all and
                          measured 511px of un-shrinkable flex item against a
                          277px row (WCAG 1.4.4) — the same shape of bug the
                          "Also needs …" row below fixes with `min-w-0`, and
                          the same fix here: `min-w-0` lets the group (and, via
                          their own default `flex-shrink`, its two children)
                          actually give up width, and `flex-wrap` lets it drop
                          to its own line when the row (already `flex-wrap`)
                          has none left beside the title. */}
                      <span className="flex min-w-0 flex-wrap items-center gap-3">
                        <DifficultyMark difficulty={prereq.difficulty} />
                        <PrerequisiteStatus lessonSlugs={lessonSlugs} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Instrument>
          </Reveal>
        )}

        {/* -----------------------------------------------------------
            What the course actually assumes, derived, not asserted.
            docs/BEGINNER_REVIEW.md blocker 4: one course-level
            `difficulty` word cannot separate a gentle intuition-first
            course from a rigorous one, and (per the comment on
            `mathematical-foundations` in curriculum.ts) the value is
            deliberately "foundational" and should stay that way. So this
            does not argue with the mark, it stands beside it and shows
            the reader the evidence: the vocabulary this course's own
            lessons say they will have you working in, and the real
            per-lesson difficulty spread the single mark summarizes.
            ----------------------------------------------------------- */}
        {register.length > 0 || spreadIsInformative(spread) ? (
          <Reveal delay={90} className="mt-4">
            <Instrument
              label="What this assumes"
              footnote="Read off this course's own lesson objectives, not assigned by hand, so it changes when the lessons do."
            >
              {register.length > 0 ? (
                <>
                  {/* "By the end of this course", not "From the first lesson
                      on", which is what this said and which was false on the
                      one page it mattered most.

                      `technicalRegister` reads the title, description and
                      objectives of EVERY lesson in the course and joins them,
                      so the chips describe the course as a whole. The old
                      sentence made that a claim about lesson 1. On
                      /courses/qubits-and-quantum-states, the door the homepage
                      sends "I have never studied quantum physics" through,
                      four of the five chips were false of lesson 1: it lists
                      COMPLEX NUMBERS while `what-is-a-qubit` says in as many
                      words that "every calculation in this lesson works if you
                      treat alpha and beta as ordinary numbers" and that the
                      complex case is built from scratch in the next lesson,
                      and it lists READING AND WRITING PROOFS, which that
                      lesson's objectives never mention. It happened to be true
                      on /courses/mathematical-foundations, which is why it
                      survived.

                      This is the failure CLAUDE.md records for the entry bar,
                      six wordings of one claim with two of them false, reached
                      again by a sentence that is not built from `entryBar.ts`
                      and so is not covered by `entryBar.test.ts`. The wording
                      now says what the data actually supports. */}
                  <p className="text-sm leading-relaxed text-foreground">
                    {prerequisiteRows.length === 0
                      ? "“No prerequisites” is not the same as “no background.” By the end of this course you will be reading and writing in this vocabulary:"
                      : "You will be reading and writing in this vocabulary throughout:"}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {register.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border-strong px-2.5 py-1 tech-label text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {spreadIsInformative(spread) ? (
                <p
                  className={cn(
                    "text-sm leading-relaxed text-muted-foreground",
                    register.length > 0 && "mt-4 border-t border-border pt-4"
                  )}
                >
                  The mark above is one value for the whole course. Its {authoredModules} written
                  lesson{authoredModules === 1 ? "" : "s"} are{" "}
                  {spread.map((entry, i) => (
                    <span key={entry.difficulty}>
                      {i > 0 ? (i === spread.length - 1 ? " and " : ", ") : ""}
                      <span className="text-foreground">
                        {entry.count} {entry.label}
                      </span>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </Instrument>
          </Reveal>
        ) : null}
      </Section>

      {/* -------------------------------------------------------------
          Outcomes + curriculum position, an asymmetric split rather
          than two more stacked card grids.
          ------------------------------------------------------------- */}
      <Section width="wide">
        <SplitFigure
          text={
            <Reveal>
              <Eyebrow>By the end</Eyebrow>
              <SectionTitle level={2} size="md" className="mt-2">
                What you&rsquo;ll be able to do
              </SectionTitle>
              {displayedOutcomes.length > 0 ? (
                <>
                  <ol className="mt-5 space-y-2.5">
                    {displayedOutcomes.map((outcome, i) => (
                      <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                        <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* Objectives are authored with inline `$…$` LaTeX
                            ("verify $Av=\lambda v$"); rendered raw they read
                            as source code. */}
                        <MathText text={outcome} />
                      </li>
                    ))}
                  </ol>
                  {outcomes.length > displayedOutcomes.length ? (
                    <p className="mt-4 font-tech text-xs text-subtle-foreground">
                      {displayedOutcomes.length} of {outcomes.length} stated objectives. The rest
                      are on the individual lessons.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  This course&rsquo;s lessons are still being written. Objectives will appear here, drawn
                  from each lesson, as they&rsquo;re published.
                </p>
              )}
            </Reveal>
          }
          figure={
            <Reveal delay={100}>
              <Eyebrow>Curriculum position</Eyebrow>
              <SectionTitle level={2} size="md" className="mt-2">
                Where this sits in {pillarInfo?.title ?? "the curriculum"}
              </SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pillarCourses.length} course{pillarCourses.length === 1 ? "" : "s"} make up{" "}
                {pillarInfo?.title ?? "this track"}, {trackPosition === 1 ? "the first" : `track ${trackPosition}`} of{" "}
                {trackTotal} in the full curriculum.
              </p>
              <div className="mt-5">
                <CourseTimeline courses={pillarCourses} lessons={lessons} />
              </div>
            </Reveal>
          }
        />
      </Section>

      {/* -------------------------------------------------------------
          Full module manifest, the advanced reader's view.
          ------------------------------------------------------------- */}
      <Section width="wide" bleed>
        <div className="mx-auto w-full max-w-[64rem] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>The course, module by module</Eyebrow>
            <SectionTitle level={2} size="lg" className="mt-2">
              Full module list
            </SectionTitle>
          </Reveal>

          <Reveal delay={80} className="mt-6">
            <Instrument
              label={`${totalModules} module${totalModules === 1 ? "" : "s"}`}
              readout={
                <span className="font-tech text-xs text-subtle-foreground">
                  {isContentComplete
                    ? "all authored"
                    : `${authoredModules}/${totalModules} authored`}
                </span>
              }
            >
              {/* The whole row is the link, not a "View →" affordance parked
                  at the end of it: a reader who wants lesson 7 should be able
                  to hit lesson 7, not hunt for the four-character target on
                  its right edge. `min-h-11` is the 44px touch minimum, and
                  everything inside the anchor is a <span>, the difficulty
                  ticks, the completion glyph, the duration, so nothing
                  nests an interactive element inside another. Unauthored
                  modules stay as plain <div>s: nothing to click, so nothing
                  that looks clickable. */}
              <ol className="divide-y divide-border">
                {course.modules.map((module, index) => {
                  const lesson = lessonByModule.get(module.slug);
                  const number = (
                    <span className="w-6 shrink-0 font-tech text-xs text-subtle-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  );

                  return (
                    <li key={module.slug}>
                      {lesson ? (
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="group -mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-(--radius-tight) px-2 py-3 transition-colors hover:bg-surface-muted"
                        >
                          <span className="flex min-w-0 items-baseline gap-3">
                            {number}
                            <span className="text-sm text-foreground group-hover:text-pillar-text">
                              {module.title}
                            </span>
                          </span>
                          {/* `min-w-0`, not `shrink-0`: paired with `flex-wrap`
                              alone, `shrink-0` never actually lets this group
                              wrap, because a `shrink-0` item takes its
                              max-content (single-line) size regardless of
                              available room, so the wrap it declares never
                              gets a reason to engage — the group just sits at
                              its natural width and spills past the row (WCAG
                              1.4.4) at 200% text zoom instead. `min-w-0` lets
                              the outer row's own `flex-wrap` actually
                              constrain this group, which is what lets it wrap
                              internally. */}
                          <span className="flex min-w-0 flex-wrap items-center gap-3">
                            <DifficultyMark difficulty={lesson.difficulty} />
                            <span className="font-tech text-xs text-subtle-foreground">
                              {lesson.estimatedMinutes} min
                            </span>
                            <LessonCompletionMark slug={lesson.slug} />
                            <span
                              aria-hidden="true"
                              data-decorative=""
                              className="font-tech text-xs text-pillar-text opacity-60 transition-opacity group-hover:opacity-100"
                            >
                              →
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <div className="-mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 py-3">
                          <span className="flex min-w-0 items-baseline gap-3">
                            {number}
                            <span className="text-sm text-muted-foreground">
                              {module.title}
                            </span>
                          </span>
                          <span className="shrink-0 font-tech text-xs uppercase tracking-wide text-subtle-foreground">
                            Coming soon
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Instrument>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------------
          What this unlocks, the reverse edge, computed from COURSES.
          ------------------------------------------------------------- */}
      {/* No `pb-4` here: `Section` writes its vertical padding as an inline
          `style` (`--rhythm-section`), and an inline declaration beats any
          class on the same element, so the override compiled and applied to
          nothing. Removed rather than converted to a prop; the spacing below
          is what has been shipping. */}
      <Section width="reading">
        <FadeRule />
        <Reveal className="mt-10">
          <Eyebrow>Forward from here</Eyebrow>
          <SectionTitle level={2} size="md" className="mt-2">
            What this course unlocks
          </SectionTitle>
        </Reveal>

        {dependentRows.length > 0 ? (
          <Reveal delay={60} className="mt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dependentRows.length === 1
                ? "One course lists this one as a prerequisite."
                : `${dependentRows.length} courses list this one as a prerequisite.`}{" "}
              {hasStartableDependent
                ? "Anything marked ready needs nothing you have not already been sent to."
                : "None of them is reachable on this course alone; each one wants material from another line as well."}
            </p>
            <ul className="mt-4 divide-y divide-border">
              {dependentRows.map(({ course: dependent, alsoNeeds }) => (
                <li key={dependent.slug}>
                  <Link
                    href={`/courses/${dependent.slug}`}
                    className="group -mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-(--radius-tight) px-2 py-2.5 transition-colors hover:bg-surface-muted"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground group-hover:text-pillar-text">
                        {dependent.title}
                      </span>
                      {dependent.pillar !== course.pillar ? (
                        <span className="block tech-label text-subtle-foreground">
                          {getPillar(dependent.pillar)?.title ?? dependent.pillar}
                        </span>
                      ) : null}
                    </span>
                    {/* The clause that turns a pointer into an itinerary. A
                        reader who has just finished this course either can
                        start the next one or cannot, and which of the two it
                        is was previously left for them to discover by
                        clicking. Plain spans only: this row is already a
                        link. */}
                    {/* Not `shrink-0`. Two course titles joined by "and" is
                        565px of unbreakable flex item at 320px, which pushed
                        the row past the viewport and got clipped by the root's
                        `overflow-x: clip`. `min-w-0` lets it wrap instead, and
                        the row's `flex-wrap` drops it onto its own line on a
                        phone while it stays right-aligned on a wide screen. */}
                    <span className="min-w-0 text-xs text-subtle-foreground">
                      {alsoNeeds.length === 0
                        ? "Ready after this"
                        : `Also needs ${alsoNeeds.map((needed) => needed.title).join(" and ")}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal delay={60} className="mt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No later course lists {course.title} as a prerequisite. It is the end of its own line,
              which is not the end of the curriculum.
            </p>
          </Reveal>
        )}

        {/* The forward move that survives a terminal course, and the one a
            blocked reverse edge cannot supply. Both lists are the same
            computation from the same graph, so neither can name a course the
            reader is not actually able to open. */}
        {showNowOpen ? (
          <Reveal delay={100} className="mt-6">
            <Instrument
              label="Open to you next"
              footnote="Every course whose prerequisites are covered by this one and the courses it already required. Derived from the curriculum graph, not a hand-picked list."
            >
              <ul className="divide-y divide-border">
                {nowOpen.map((candidate) => (
                  <li key={candidate.slug}>
                    <Link
                      href={`/courses/${candidate.slug}`}
                      className="group -mx-2 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-(--radius-tight) px-2 py-2.5 transition-colors hover:bg-surface-muted"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground group-hover:text-pillar-text">
                          {candidate.title}
                        </span>
                        <span className="block tech-label text-subtle-foreground">
                          {getPillar(candidate.pillar)?.title ?? candidate.pillar}
                        </span>
                      </span>
                      {/* `min-w-0 flex-wrap`, not `shrink-0`: same fix as the
                          Prerequisites row above, for the same reason — a
                          rigid group beside title text that wraps is exactly
                          the shape that clips at 200% zoom. */}
                      <span className="flex min-w-0 flex-wrap items-center gap-3">
                        <DifficultyMark difficulty={candidate.difficulty} />
                        <span className="font-tech text-xs text-subtle-foreground">
                          {candidate.estimatedHours}h
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Instrument>
          </Reveal>
        ) : null}

        {/* Unconditional, and it used to fire only for a course with no
            reverse edge and nothing newly open behind it. That covered the
            dead-end case and left the common one short: a course whose
            forward edges are all blocked ends on a list of things the reader
            cannot open yet, and even a course with a clean next step has no
            answer to "what else is there?" anywhere on the page below the
            breadcrumb. Two links at the end of a course page cost one line
            and are the only sideways move it offers. */}
        <Reveal delay={100} className="mt-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The whole track is on{" "}
            <Link
              href={trackPath(course.pillar)}
              className="text-pillar-text underline decoration-border-strong underline-offset-2 hover:decoration-pillar-edge"
            >
              {pillarInfo?.title ?? "its track page"}
            </Link>
            , and every course on the site is on the{" "}
            <Link
              href="/learn"
              className="text-pillar-text underline decoration-border-strong underline-offset-2 hover:decoration-pillar-edge"
            >
              curriculum overview
            </Link>
            .
          </p>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
