import Link from "next/link";
import { SectionTitle, TechLabel, TechValue } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { CourseProgressBadge } from "@/components/curriculum/CourseProgressBadge";
import { LessonCompletionMark } from "@/components/curriculum/LessonCompletionMark";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { firstAuthoredLessonSlug } from "@/components/apex/readiness";
import { getCourse } from "@/lib/content/curriculum";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/* `firstAuthoredLessonSlug` lives in `components/apex/readiness`, one
   definition shared by /apex and /mastery rather than a copy per component. */

/**
 * ============================================================
 * Mastery results index
 * ============================================================
 * Apex's brief got a bespoke `ApexCourseIndex`, a numbered research-paper
 * table of contents, instead of the generic `CourseTimeline` + `CourseList`
 * every core pillar shares. Mastery's own identity (per the sprint brief) is
 * different from Apex's: not "the frontier," but *abstract mathematical
 * structure*, operators, spectra, decompositions, symmetry, the things the
 * core curriculum used without proving. So this is not a re-skin of
 * `ApexCourseIndex`: no §-section numbering, no research-index framing, no
 * convergence diagram (Mastery's real dependency topology already gets its
 * own bespoke instrument earlier on `/mastery`, in the page file itself).
 *
 * Instead each of the five courses is presented as a *result*, roman
 * numerals (a mathematical-text convention, not a section-index one), a
 * one-line statement of the actual theorem/structure the course makes
 * rigorous, and its module list on a single ruled rail rather than
 * `ApexCourseIndex`'s two-column §-numbered grid. (The module list was a
 * flowing comma-separated line until this pass. It read well but every
 * lesson in it was a small inline tap target on a phone, on the one page
 * where every module is authored and therefore every one of them is a real
 * destination, so the lessons are now rows with a 44px target each, while
 * the roman-numeral / "Result" register that distinguishes this component
 * from Apex's index is untouched.) The "Result"
 * statements paraphrase language already present in each course's own
 * `curriculum.ts` description; nothing here is asserted independently of
 * that data, and each entry's grounding module is checked against the real
 * module list at render time so a future curriculum edit can't leave a
 * stale claim on screen (same discipline as `ApexOpenProblems`).
 *
 * Click targets follow `CourseList`'s stretched-link technique exactly (see
 * that file's header for the CSS 2.1 Appendix E paint-order argument): the
 * course title is a real `<a>` whose `::after` covers the whole `<li>`, and
 * every block of readable text, the Result statement, the "Requires" line,
 * the stats, the module rows, is raised with `relative z-10` so it stays
 * selectable and its own links reach their own destinations. No separate
 * "View course" affordance: the row is the way in. As in `ApexCourseIndex`,
 * the `Reveal` between the `<li>` and the title link must stay untransformed
 * in its settled state (globals.css §11 guarantees this) or the stretched
 * `::after` would size to that wrapper instead of the whole row.
 */

type Result = {
  /** Course slug this result belongs to, must match a real Mastery course. */
  course: string;
  /** The specific theorem or structure this course makes rigorous. */
  statement: string;
  /** A module slug (within the same course) that establishes the statement. */
  grounding: string;
};

const RESULTS: Result[] = [
  {
    course: "hilbert-space-and-spectral-theory",
    statement:
      "Every self-adjoint operator, bounded or not, admits a genuine spectral resolution. Formal Hermiticity, the definition used earlier in the curriculum, is not sufficient on its own.",
    grounding: "the-spectral-theorem-for-unbounded-operators",
  },
  {
    course: "symmetry-scattering-and-semiclassical-methods",
    statement:
      "The general Clebsch-Gordan coefficients and the Wigner-Eckart theorem replace the single worked case taught earlier, and Berry's geometric phase is derived rather than asserted.",
    grounding: "the-adiabatic-theorem-and-berry-phase",
  },
  {
    course: "quantum-information-theory",
    statement:
      "The Schmidt decomposition is proved, not just used, and the Lindblad master equation is exhibited as the actual continuous-time origin of the T1/T2 decay taken as given earlier.",
    grounding: "the-lindblad-master-equation",
  },
  {
    course: "advanced-algorithms-and-complexity",
    statement:
      "BQP gets a formal definition and a real Trotter-Suzuki error bound replaces the earlier hand-wave, en route to the reason variational-circuit gradients vanish exponentially at scale.",
    grounding: "barren-plateaus-and-variational-trainability",
  },
  {
    course: "quantum-shannon-theory",
    statement:
      "Every generalized measurement (POVM) is shown to be a projective one on a larger space, via Naimark's and Stinespring's dilation theorems, closing a gap the measurement postulate left open.",
    grounding: "stinespring-dilation-and-channel-purification",
  },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"] as const;

export function MasteryResultsIndex({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));

  return (
    // `-mx-3` against each row's `px-3`: the row's hover wash gets real
    // padding around its text without the text shifting out of alignment
    // with the rest of the section, and every hairline stays the same width
    // as the wash. 12px is well inside `Container`'s 16px gutter, so nothing
    // overflows at 320px.
    <ol className="-mx-3 divide-y divide-border border-y border-border">
      {RESULTS.map((entry, index) => {
        const course = courseBySlug.get(entry.course);
        if (!course) return null;
        const groundingExists = course.modules.some((module) => module.slug === entry.grounding);

        const lessonByModule = new Map(
          lessons
            .filter((lesson) => lesson.course === course.slug)
            .map((lesson) => [lesson.module, lesson])
        );
        const totalModules = course.modules.length;
        const authoredCount = course.modules.filter((module) => lessonByModule.has(module.slug)).length;
        const authoredSlugs = course.modules
          .map((module) => lessonByModule.get(module.slug)?.slug)
          .filter((slug): slug is string => Boolean(slug));
        const prerequisiteCourses = course.prerequisites
          .map((slug) => getCourse(slug))
          .filter((c): c is Course => Boolean(c));
        const numeral = ROMAN[index] ?? String(index + 1);

        return (
          <li
            key={course.slug}
            id={`structure-${course.slug}`}
            className={cn(
              "relative isolate scroll-mt-24 px-3 py-9 transition-colors duration-(--dur-fast) ease-instrument sm:py-11",
              // `pillar-wash`, not `pillar-accent`: the ramp is exposed to
              // Tailwind as `pillar`/`pillar-edge`/`pillar-wash`; an
              // unregistered color would compile to nothing and the
              // whole-row hover affordance would silently not exist.
              "has-[a[data-course-link]:hover]:bg-pillar-wash",
              "has-[a[data-course-link]:focus-visible]:bg-pillar-wash"
            )}
          >
            <Reveal as="div" delay={index * 70} className="grid gap-5 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <span
                aria-hidden="true"
                data-decorative=""
                className="font-display text-3xl italic leading-none text-subtle-foreground"
              >
                {numeral}
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
                    </TechValue>
                    <CourseProgressBadge lessonSlugs={authoredSlugs} />
                  </div>
                </div>

                {groundingExists ? (
                  <p className="relative z-10 mt-3 max-w-reading text-sm leading-relaxed text-foreground/90">
                    <span className="tech-label text-pillar-text">Result: </span>
                    {entry.statement}
                  </p>
                ) : (
                  <p className="relative z-10 mt-3 max-w-reading text-sm leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                )}

                {prerequisiteCourses.length > 0 ? (
                  // Raised clear of the stretched `::after` so these links go
                  // to the prerequisite rather than silently back to this
                  // course. Inline links in a sentence, so WCAG 2.5.8's
                  // inline exception applies and they stay at text size.
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

                {/* Every module, every time, a reader has to be able to see
                    the actual lesson titles here without opening the course
                    first. A single ruled rail rather than `ApexCourseIndex`'s
                    two-column §-numbered grid, so the two indexes still read
                    as different instruments; the ordinal keeps this
                    component's roman-numeral register ("III.4", not "03.4"). */}
                <div className="relative z-10 mt-4 max-w-reading">
                  <TechLabel as="p">Contents</TechLabel>
                  <ol className="mt-1.5 border-l border-border pl-3 sm:pl-4">
                    {course.modules.map((module, moduleIndex) => {
                      const lesson = lessonByModule.get(module.slug);
                      const ordinal = `${numeral}.${moduleIndex + 1}`;
                      return (
                        <li key={module.slug} className="text-sm">
                          {lesson ? (
                            <Link
                              href={`/lessons/${lesson.slug}`}
                              className={cn(
                                "group/row flex min-h-11 items-center gap-3 py-1 text-foreground",
                                "transition-colors duration-(--dur-fast) ease-mech",
                                "hover:text-pillar-text focus-visible:text-pillar-text"
                              )}
                            >
                              <span className="tech-value w-10 shrink-0 text-xs text-subtle-foreground">
                                {ordinal}
                              </span>
                              <span className="min-w-0 flex-1">{module.title}</span>
                              <LessonCompletionMark slug={lesson.slug} />
                              <span
                                aria-hidden="true"
                                data-decorative=""
                                className="shrink-0 text-xs opacity-0 transition-opacity duration-(--dur-fast) group-hover/row:opacity-100"
                              >
                                →
                              </span>
                            </Link>
                          ) : (
                            <span className="flex min-h-11 items-center gap-3 py-1 text-muted-foreground">
                              <span className="tech-value w-10 shrink-0 text-xs text-subtle-foreground">
                                {ordinal}
                              </span>
                              <span className="min-w-0 flex-1">
                                {module.title}
                                <span className="ml-1 text-xs text-subtle-foreground">
                                  (not yet authored)
                                </span>
                              </span>
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
  );
}
