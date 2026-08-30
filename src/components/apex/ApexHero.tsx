import { FullBleed, Section } from "@/components/ui/Section";
import { Eyebrow, Lede, TechLabel, Readouts } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { ReadinessReadout } from "./ReadinessReadout";
import { TierLadder } from "@/components/pillar/TierLadder";
import { Button } from "@/components/ui/Button";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { directPrerequisites, firstAuthoredLessonSlug, prerequisiteChain } from "./readiness";
import { getCourse } from "@/lib/content/curriculum";
import { PILLAR_ORDER, pillarDepth } from "@/lib/design/pillars";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * Apex hero, the threshold
 * ============================================================
 * Every other track page opens with the same three-part sequence, `Eyebrow`,
 * `SectionTitle` as the h1, then a `Lede` standfirst paragraph. Apex is the
 * terminal level of the curriculum, and the brief calls for the top of this
 * page to read as *crossing a boundary*, not as another instance of that
 * template.
 *
 * The composition borrows the anatomy of a physics preprint's title block:
 * a running head (site + position in the curriculum), an oversized display
 * title, a standfirst, then a two-column "prerequisites assumed" /
 * "manuscript metadata" block below a hairline rule, exactly what a paper
 * puts above its abstract. Nothing here is invented copy: the prerequisite
 * list and every number in the readouts are derived from `curriculum.ts` at
 * render time, not hand-typed, so they can't drift out of sync with it.
 *
 * The prerequisite half of that block is also where the page answers the
 * reader who arrived too early, see `ReadinessReadout`, which reports which
 * of those computed prerequisites they have actually finished and names the
 * specific first course they haven't. It is a status readout, not a gate:
 * nothing on this page is locked, and an advanced reader who has the
 * background from elsewhere is never told to go take a course.
 *
 * Deliberately full-bleed and background-transparent (no opaque fill) so the
 * `frontier` regime's rising horizon (declared by `PillarScope` on the page)
 * reads straight through it.
 */

/**
 * A precise, graduate-syllabus-register statement of what Apex assumes is
 * already fluent, not a beginner-facing warning. Each phrase names a
 * specific result or formalism that a real prerequisite course's own module
 * list establishes, and is only shown if that module still exists in
 * `curriculum.ts` at render time, so this can't drift into an assertion the
 * data no longer backs.
 */
type AssumedResult = { courseSlug: string; moduleSlug: string; phrase: string };
const ASSUMED_RESULTS: AssumedResult[] = [
  {
    courseSlug: "quantum-information-theory",
    moduleSlug: "css-codes-and-the-general-stabilizer-formalism",
    phrase: "the general stabilizer formalism",
  },
  {
    courseSlug: "advanced-algorithms-and-complexity",
    moduleSlug: "bqp-and-oracle-complexity",
    phrase: "BQP and oracle separations",
  },
  {
    courseSlug: "compilation-and-hybrid-algorithms",
    moduleSlug: "quantum-compilation-and-transpilation",
    phrase: "a working transpilation pipeline",
  },
];

function assumedSecondNature(): string[] {
  return ASSUMED_RESULTS.filter((entry) =>
    getCourse(entry.courseSlug)?.modules.some((module) => module.slug === entry.moduleSlug)
  ).map((entry) => entry.phrase);
}

/** "a, b, and c", never a bare comma-joined list or a trailing Oxford-comma bug at length 2. */
function joinPhrases(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function ApexHero({ courses, lessons }: { courses: Course[]; lessons: LessonMetaWithSlug[] }) {
  const totalModules = courses.reduce((sum, course) => sum + course.modules.length, 0);
  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const position = pillarDepth("apex") + 1;
  const assumed = assumedSecondNature();
  // Both derived from the real `prerequisites` graph at render time, the
  // direct, out-of-Apex prerequisite courses for the status list, and their
  // full transitive ancestry for the "first course you haven't finished"
  // computation inside `ReadinessReadout`.
  const direct = directPrerequisites(courses, lessons);
  const chain = prerequisiteChain(courses, lessons);

  // The one course this page names as its way in: `courses[0]`, curriculum
  // order, resolved through the same `getCourseHref` /
  // `firstAuthoredLessonSlug` pair every other start control on the site uses.
  // A course with nothing authored yet yields no control at all rather than a
  // link into an empty page.
  const entryCourse = courses[0];
  const entryLessonSlug = entryCourse
    ? firstAuthoredLessonSlug(entryCourse.slug, lessons)
    : undefined;
  const entry = entryCourse
    ? {
        course: entryCourse,
        href: getCourseHref(entryCourse.slug, entryLessonSlug),
        lesson: lessons.find((lesson) => lesson.slug === entryLessonSlug),
        lessonCount: lessons.filter((lesson) => lesson.course === entryCourse.slug).length,
      }
    : undefined;

  return (
    <FullBleed className="border-b border-border-strong">
      {/* Engineering-grid texture, masked to a fade so it reads as drafting
          paper under the title block rather than a hard-edged panel, and
          kept translucent enough that the frontier field's horizon line
          stays visible through it, per the "field never competes" rule. */}
      <div
        aria-hidden="true"
        data-decorative=""
        className="pointer-events-none absolute inset-0 grid-paper opacity-[0.35] [mask-image:linear-gradient(180deg,black,transparent_82%)]"
      />

      <Section width="wide" className="relative" tight>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border pb-3">
          <TechLabel>StudyQuantum · Research Frontier</TechLabel>
          <TechLabel>
            Track {String(position).padStart(2, "0")} / {String(PILLAR_ORDER.length).padStart(2, "0")}
          </TechLabel>
        </div>

        <div className="mt-10 sm:mt-16">
          <Eyebrow>Apex · the terminal level</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-[clamp(3.75rem,13vw,9.5rem)] font-semibold leading-[0.9] tracking-tight text-foreground">
            Apex
          </h1>
          {/* The standfirst used to be the whole syllabus in one 90-word
              sentence: accurate, and unreadable in the two seconds a visitor
              actually gives the top of a page. Which meant the single most
              important fact about this route, that it is the summit and that
              it assumes everything under it, had to be *inferred* from the
              vocabulary, which is precisely the reader who cannot infer it.
              So the standfirst now states it, the ladder below draws it, and
              the syllabus keeps its full detail one paragraph down where a
              reader who wants it will read it properly. */}
          <Lede width="reading" className="mt-6">
            The summit of StudyQuantum. Five courses that begin where the
            settled answers stop, and that assume every tier beneath them is
            already fluent. Nothing here is locked: this page reports what
            you have finished, it does not gate anything.
          </Lede>

          {/* Tier 4 of 4, drawn with the identical four-rung ladder that
              /mechanics carries at tier 1. Same component, same position, so
              the difference between the ground floor and the summit is read
              off one instrument instead of guessed from tone. */}
          <TierLadder pillar="apex" className="mt-8 max-w-reading" />

          <p className="mt-8 max-w-reading text-base leading-relaxed text-muted-foreground">
            What is in it: block encodings, quantum signal processing, and the
            quantum singular value transformation (QSVT) that now unifies most
            of quantum algorithm design; the real 2D surface-code lattice, its
            decoder, and the threshold that makes fault tolerance an
            engineering target rather than a hope; QMA and the Local
            Hamiltonian problem; tensor networks and the
            classical-simulation boundary that is the actual definition of
            quantum advantage; and, finally, the skill of reading a real
            paper&rsquo;s claims against its assumptions.
          </p>
          <p className="mt-4 max-w-lede text-sm text-subtle-foreground">
            FIG. 1, background: a horizon separating a dense, ordered lattice
            of settled results below from sparse, tentatively-linked open
            problems above. It rises as you scroll this page.
          </p>
        </div>

        <FadeRule className="my-10 sm:my-14" />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <TechLabel as="p">Prerequisites assumed</TechLabel>
            {assumed.length > 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {joinPhrases(assumed)} are assumed second nature here, not
                re-derived. This is where they get used, not taught.
              </p>
            ) : null}
            {/* The same computed prerequisite list this block always carried,
                now also reporting whether the reader has actually finished
                each one and, if not, naming the specific course the
                prerequisite graph puts first. See ReadinessReadout: it is a
                status readout, not a gate, and says so. */}
            <ReadinessReadout
              className="mt-6"
              label="Status"
              pillarLabel="Apex"
              direct={direct}
              chain={chain}
            />
            <p className="mt-3 text-xs text-subtle-foreground">
              Each Apex course also lists its own specific prerequisite
              course below. Most require material from more than one
              earlier track at once.
            </p>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-10">
            <Readouts
              items={[
                { label: "Courses", value: courses.length },
                { label: "Modules", value: totalModules },
                { label: "Depth", value: totalHours, unit: "est. hours" },
                { label: "Difficulty", value: "Master" },
              ]}
            />
          </div>
        </div>

        {/* The primary action this page did not have.
            `HowItWorks` sends the already-expert reader straight here to
            "judge the site on that material", and until now the page carried
            none of the three controls every core track page shares (the
            hero-level "Start: <course> →", `PillarLessonStrip`, `PillarNext`):
            the first real lesson title lived several hundred pixels down
            inside `ApexCourseIndex`.
            Kept in this page's own preprint register rather than by importing
            the core pages' components: a rule, a running-head label, and one
            filed entry. The course is `courses[0]`, i.e. curriculum order, the
            same rule the four core track pages use for their hero CTA, so it
            is derived rather than picked. */}
        {entry ? (
          <>
            <FadeRule className="my-10 sm:my-14" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <TechLabel as="p">Begin at</TechLabel>
                <p className="mt-2 font-display text-2xl font-semibold leading-tight text-foreground">
                  {entry.course.title}
                </p>
                <p className="mt-2 max-w-lede text-sm leading-relaxed text-muted-foreground">
                  {entry.lessonCount} lessons
                  {entry.lesson ? <> &middot; opens on &ldquo;{entry.lesson.title}&rdquo;</> : null}
                  {". "}
                  First of the {courses.length} in curriculum order. What each of the others
                  requires is filed under &sect; 02 below.
                </p>
              </div>
              <Button href={entry.href} size="lg" className="shrink-0">
                Start this course →
                <span className="sr-only">: {entry.course.title}</span>
              </Button>
            </div>
          </>
        ) : null}
      </Section>
    </FullBleed>
  );
}
