import Link from "next/link";
import { SectionTitle, TechLabel, TechValue } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { CourseProgressBadge } from "@/components/curriculum/CourseProgressBadge";
import { LessonCompletionMark } from "@/components/curriculum/LessonCompletionMark";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { firstAuthoredLessonSlug } from "./readiness";
import { getCourse } from "@/lib/content/curriculum";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * Apex course index
 * ============================================================
 * Every other pillar page renders its five-ish courses through the shared
 * `CourseTimeline` + `CourseList` (a horizontal progress rail over a stack
 * of cards). The brief asks Apex not to use that pattern at all — a
 * research-index feel instead: a numbered table of contents, dense module
 * listings with dotted leaders, hairline rules doing the separating work
 * cards normally do.
 *
 * It still has to expose everything `CourseList`/`CourseTimeline` do —
 * title, description, difficulty, hours, prerequisites, the module list
 * linking to lessons, and completion state — so completion is read from
 * exactly the same components those use (`CourseProgressBadge`,
 * `LessonCompletionMark`), imported rather than reimplemented, so there is
 * only ever one definition of "what counts as complete."
 *
 * Difficulty renders through the shared `DifficultyMark` tick ladder (the
 * same filled/hollow four-tick + text encoding `CourseList`/`CourseTimeline`
 * use) rather than bare text, so "Advanced" reads identically everywhere on
 * the site instead of being its own unlabeled convention here.
 *
 * The course title and each "Requires" entry route through `getCourseHref`
 * (`src/components/curriculum/courseHref.ts`) — the single place that
 * decides where a course link goes, now `/courses/<slug>` for every course
 * on the site — with a real authored-lesson fallback rather than a
 * hardcoded path.
 *
 * ------------------------------------------------------------
 * Click targets — the whole row, not just the title
 * ------------------------------------------------------------
 * Same technique and same reasoning as `CourseList` (see its header comment
 * for the full CSS 2.1 Appendix E paint-order argument): an entry here has
 * two kinds of real destination — the course, and each of its lessons — so
 * it cannot be one big `<a>` without nesting links, which is invalid HTML.
 * Instead the course title is a real `<a>` whose `::after` is stretched over
 * the whole `<li>` (`relative isolate`), and every block of genuinely
 * readable text — the description, the "Requires" line, the stats, the
 * module rows — carries `relative z-10`, so it stays selectable and the
 * links inside it reach their own destinations rather than the course.
 * There is deliberately no separate "View course →" affordance; the row is
 * the way in.
 *
 * One subtlety specific to this list, which `CourseList` doesn't have: a
 * `Reveal` sits between the `<li>` and the title link. A transformed element
 * is a containing block for absolutely-positioned descendants, so if that
 * wrapper held a transform the stretched `::after` would size to the wrapper
 * instead of the row. It doesn't in any steady state — globals.css §11 sets
 * `transform: none` on `[data-reveal][data-revealed="true"]` and again,
 * `!important`, under `prefers-reduced-motion` — so the overlay resolves
 * against the `relative` `<li>`. Do not add a transform to that wrapper.
 */

/* `firstAuthoredLessonSlug` lives in ./readiness now — one definition shared
   by /apex and /mastery instead of a copy per component. */

/**
 * A compact structural diagram: which Apex courses are independent threads,
 * and which one converges all of them into a single capstone. Computed from
 * real prerequisite data (a course is "the synthesis" if more than one of
 * its prerequisites is itself an Apex course) rather than hardcoded slugs,
 * so it can't silently go stale if the curriculum changes. Decorative at
 * every width — the numbered index below is the authoritative, fully
 * accessible version of the same information (each entry's own "Requires"
 * line), so this is presented as pure enhancement with an `sr-only` summary
 * standing in for it for assistive tech regardless of width. Below `lg`
 * there isn't room for the four-column converge-diagram, so a stacked
 * variant (threads top to bottom, funnelling into one capstone row) carries
 * the same shape at `sm`/`md` widths instead of disappearing — a sighted
 * reader on a phone gets a real diagram, not just the `sr-only` fallback.
 */
function ApexStructure({ courses }: { courses: Course[] }) {
  const synthesis = courses.find(
    (course) =>
      course.prerequisites.filter((slug) => getCourse(slug)?.pillar === "apex").length > 1
  );
  const threads = synthesis ? courses.filter((course) => course.slug !== synthesis.slug) : [];
  if (!synthesis || threads.length < 2) return null;

  return (
    <div className="mb-14">
      <p className="sr-only">
        Structure: {threads.map((thread) => thread.title).join(", ")} are independent
        research threads within Apex; {synthesis.title} is the course that requires all of
        them, converging the track into a single closing capstone.
      </p>

      {/* Stacked convergence — sm/md, and the fallback below lg on larger
          screens too. Same information as the desktop diagram, read top to
          bottom instead of left to right: no horizontal grid to overflow at
          320px. */}
      <div aria-hidden="true" data-decorative="" className="lg:hidden">
        <div className="space-y-2">
          {threads.map((thread) => (
            <div
              key={thread.slug}
              className="rounded-(--radius-tight) border border-border px-3 py-2.5 text-center"
            >
              <TechLabel className="leading-snug">{thread.title}</TechLabel>
            </div>
          ))}
        </div>
        <div className="relative mx-auto flex h-8 w-full items-center justify-center">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border-strong" />
          <span className="relative bg-surface px-2 text-subtle-foreground">↓</span>
        </div>
        <div className="rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-5 py-2.5 text-center">
          <TechLabel className="text-pillar-text">{synthesis.title}</TechLabel>
        </div>
      </div>

      {/* Four-column converge — lg and up, room for the wide layout. */}
      <div aria-hidden="true" data-decorative="" className="hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {threads.map((thread) => (
            <div
              key={thread.slug}
              className="rounded-(--radius-tight) border border-border px-3 py-2.5 text-center"
            >
              <TechLabel className="leading-snug">{thread.title}</TechLabel>
            </div>
          ))}
        </div>
        <div className="relative h-10">
          <div className="absolute left-[12.5%] right-[12.5%] top-0 border-t border-border-strong" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border-strong" />
        </div>
        <div className="mx-auto w-fit rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-5 py-2.5 text-center">
          <TechLabel className="text-pillar-text">{synthesis.title}</TechLabel>
        </div>
      </div>
    </div>
  );
}

export function ApexCourseIndex({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  return (
    <div>
      <ApexStructure courses={courses} />

      {/* `-mx-3` against each row's `px-3`: the row's hover wash gets real
          padding around its text without the text itself shifting out of
          alignment with the rest of the section, and every hairline (this
          list's own border-y and the divide between rows) stays the same
          width as the wash. 12px is well inside `Container`'s 16px gutter,
          so nothing overflows at 320px. */}
      <ol className="-mx-3 divide-y divide-border border-y border-border">
        {courses.map((course, index) => {
          const lessonByModule = new Map(
            lessons
              .filter((lesson) => lesson.course === course.slug)
              .map((lesson) => [lesson.module, lesson])
          );
          const totalModules = course.modules.length;
          const authoredCount = course.modules.filter((module) =>
            lessonByModule.has(module.slug)
          ).length;
          const isContentComplete = totalModules > 0 && authoredCount === totalModules;
          const authoredSlugs = course.modules
            .map((module) => lessonByModule.get(module.slug)?.slug)
            .filter((slug): slug is string => Boolean(slug));
          const prerequisiteCourses = course.prerequisites
            .map((slug) => getCourse(slug))
            .filter((c): c is Course => Boolean(c));
          const n = String(index + 1).padStart(2, "0");

          return (
            <li
              key={course.slug}
              id={`course-${course.slug}`}
              className={cn(
                "relative isolate scroll-mt-24 px-3 py-9 transition-colors duration-(--dur-fast) ease-instrument sm:py-11",
                // `pillar`, not `pillar-accent`: the ramp is exposed to
                // Tailwind as `pillar`/`pillar-edge`/`pillar-wash`
                // (globals.css §"Pillar ramp"), and `pillar-accent` is not a
                // registered color — it would compile to nothing and the
                // whole-row hover affordance would silently not exist.
                "has-[a[data-course-link]:hover]:bg-pillar-wash",
                "has-[a[data-course-link]:focus-visible]:bg-pillar-wash"
              )}
            >
              <Reveal as="div" delay={index * 70} className="group">
                <div className="grid gap-5 sm:grid-cols-[4rem_1fr] sm:gap-8">
                  <span
                    aria-hidden="true"
                    data-decorative=""
                    // Keyed to the course link specifically, not to hovering
                    // anywhere in the row: the affordance has to predict what
                    // a click at the pointer's current position would do, and
                    // a lesson row opens the lesson, not the course.
                    className="font-tech text-2xl leading-none text-subtle-foreground transition-colors duration-(--dur-fast) ease-mech group-has-[a[data-course-link]:hover]:text-pillar-text group-has-[a[data-course-link]:focus-visible]:text-pillar-text"
                  >
                    §{n}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <SectionTitle level={3} size="md">
                        <Link
                          href={getCourseHref(course.slug, authoredSlugs[0])}
                          data-course-link
                          className="underline-offset-4 transition-colors duration-(--dur-fast) ease-mech after:absolute after:inset-0 after:content-[''] hover:text-pillar-text hover:underline focus-visible:text-pillar-text"
                        >
                          {course.title}
                        </Link>
                      </SectionTitle>
                      <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <DifficultyMark difficulty={course.difficulty} />
                        <TechValue className="text-sm">{course.estimatedHours}h</TechValue>
                        <TechValue className="text-sm">
                          {authoredCount}/{totalModules}
                          {isContentComplete ? " · complete" : ""}
                        </TechValue>
                        <CourseProgressBadge lessonSlugs={authoredSlugs} />
                      </div>
                    </div>

                    <p className="relative z-10 mt-3 max-w-[46rem] text-sm leading-relaxed text-muted-foreground">
                      {course.description}
                    </p>

                    {prerequisiteCourses.length > 0 ? (
                      // `relative z-10` raises the whole line — and the links
                      // inside it, which paint in this element's own stacking
                      // context — clear of the stretched `::after`. Without
                      // it every one of them would silently navigate to *this*
                      // course. They are inline links inside a sentence, so
                      // WCAG 2.5.8's inline exception applies and inflating
                      // them to 44px would break the line.
                      <p className="relative z-10 mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-subtle-foreground">
                        <span>Requires →</span>
                        {prerequisiteCourses.map((prereq, i) => (
                          <span key={prereq.slug}>
                            <Link
                              href={getCourseHref(prereq.slug, firstAuthoredLessonSlug(prereq.slug, lessons))}
                              className="text-subtle-foreground underline-offset-2 hover:text-pillar-text hover:underline focus-visible:text-pillar-text"
                            >
                              {prereq.title}
                            </Link>
                            {i < prerequisiteCourses.length - 1 ? " ·" : ""}
                          </span>
                        ))}
                      </p>
                    ) : null}

                    <ol className="mt-5 grid gap-x-8 sm:grid-cols-2">
                      {course.modules.map((module, moduleIndex) => {
                        const lesson = lessonByModule.get(module.slug);
                        const mn = `${n}.${moduleIndex + 1}`;
                        return (
                          <li
                            key={module.slug}
                            className="relative z-10 flex items-center gap-2.5 border-b border-border/60 text-sm"
                          >
                            <span className="tech-value shrink-0 text-xs text-subtle-foreground">{mn}</span>
                            {lesson ? (
                              // A real row, not an inline link: `min-h-11`
                              // gives it the 44px target WCAG 2.5.8 asks for
                              // without changing the type size, and the row
                              // is raised out of the stretched course link's
                              // paint layer so it opens the lesson.
                              <Link
                                href={`/lessons/${lesson.slug}`}
                                className={cn(
                                  "group/row flex min-h-11 min-w-0 flex-1 items-center justify-between gap-3 py-2",
                                  "text-foreground transition-colors duration-(--dur-fast) ease-mech",
                                  "hover:text-pillar-text focus-visible:text-pillar-text"
                                )}
                              >
                                <span className="min-w-0 truncate">{module.title}</span>
                                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                                  <LessonCompletionMark slug={lesson.slug} />
                                  <span
                                    aria-hidden="true"
                                    data-decorative=""
                                    className="opacity-0 transition-opacity duration-(--dur-fast) group-hover/row:opacity-100"
                                  >
                                    →
                                  </span>
                                </span>
                              </Link>
                            ) : (
                              <span className="flex min-h-11 flex-1 items-center py-2 text-muted-foreground">
                                {module.title}
                                <span className="ml-1 text-xs text-subtle-foreground">— not yet authored</span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
