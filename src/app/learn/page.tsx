import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { LessonSearch } from "@/components/curriculum/LessonSearch";
import { PillarLessonStrip } from "@/components/curriculum/PillarLessonStrip";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { CurriculumExplorer } from "./CurriculumExplorer";
import { RecommendedNext } from "./RecommendedNext";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Learn",
  description:
    "The QuantumLearn curriculum — Quantum Mechanics, Quantum Computing, Quantum Hardware, Quantum Software, Quantum Mastery, and Apex, from strong high-school math through graduate-level rigor.",
  path: "/learn",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Learn", url: `${BASE_URL}/learn` },
]);

export default async function LearnPage() {
  const lessons = await getAllLessonsMeta();

  // The beginner-friendly entry point. "What Is a Qubit?" needs no math
  // background and leads with physical intuition (spinning-coin analogy, a
  // live Bloch-sphere demo) before any formalism — a genuinely different,
  // equally valid way in for a reader who wants the "why" before the "how."
  const intuitionLesson = lessons.find(
    (lesson) => lesson.slug === "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
  );

  // Derived from the actual prerequisite graph, not hardcoded: whichever
  // course(s) require nothing else are the curriculum's true starting points.
  //
  // There are two of them, and this page is built around exactly that fact —
  // the fork below offers both. `Qubits & Quantum States` (the intuition
  // route) re-teaches complex numbers and Dirac notation from scratch in its
  // own modules, so no lesson in it depends on a Mathematical Foundations
  // lesson; it is a real root, not a course that merely looks like one. The
  // rigorous route is therefore "the root that is not the intuition course"
  // rather than `rootCourses[0]`, which would silently become whichever of
  // the two happens to be declared first in `curriculum.ts`.
  const rootCourses = COURSES.filter((course) => course.prerequisites.length === 0);
  const rootCourse =
    rootCourses.find((course) => course.slug !== intuitionLesson?.course) ?? rootCourses[0];
  const firstLesson = rootCourse
    ? lessons
        .filter((lesson) => lesson.course === rootCourse.slug)
        .find((lesson) => lesson.module === rootCourse.modules[0]?.slug)
    : undefined;

  // The length the hero's call to action promises, read off the lesson that
  // call actually opens rather than written down. It was a hardcoded "20
  // minutes" and was wrong for both doors of the fork below — `what-is-a-qubit`
  // is 30 and `complex-numbers-for-physics` is 40 — which made the first
  // number a new visitor is given on this page the one number that is not
  // reading from the data. `estimatedMinutes` was recalibrated corpus-wide by
  // a fitted rule and course `estimatedHours` now derives from it, so a
  // constant here is guaranteed to drift again. The beginner door is the
  // referent because the button says "New here?"; the rigorous root's first
  // lesson is the fallback for the (unauthored-content) case where there is
  // no intuition lesson to point at.
  const introMinutes = intuitionLesson?.estimatedMinutes ?? firstLesson?.estimatedMinutes;

  // How much of the curriculum actually hangs off the rigorous root, counted
  // rather than asserted. This card used to claim "every course on this
  // platform traces back … to Mathematical Foundations", which was a true
  // statement about a one-root graph and becomes false the moment there are
  // two — and it is the kind of claim that fails silently, since nothing
  // renders the graph beside it. Counting the closure keeps the sentence
  // correct whatever the prerequisite data says next.
  const dependentCourseCount = rootCourse
    ? COURSES.filter((course) => {
        if (course.slug === rootCourse.slug) return false;
        const seen = new Set<string>();
        const queue = [...course.prerequisites];
        while (queue.length > 0) {
          const slug = queue.pop()!;
          if (slug === rootCourse.slug) return true;
          if (seen.has(slug)) continue;
          seen.add(slug);
          const prerequisite = COURSES.find((candidate) => candidate.slug === slug);
          if (prerequisite) queue.push(...prerequisite.prerequisites);
        }
        return false;
      }).length
    : 0;

  const totalHours = COURSES.reduce((sum, course) => sum + course.estimatedHours, 0);

  return (
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* -------------------------------------------------------------
          Hero — no single pillar (this page surveys all six): the
          `<PillarScope regime="atlas">` above declares the neutral
          reference environment and paints the atmosphere layer, while
          individual sections below retint themselves locally with plain
          `data-pillar` wrappers. See DESIGN_SYSTEM.md §2 and §7, and
          docs/UX_REVIEW.md P1-2.
          ------------------------------------------------------------- */}
      {/* `tight` halves the vertical rhythm on this section (both edges) —
          deliberately, so the hero reads fast rather than opening the page
          with a near-empty screen. (A previous `pt-4 sm:pt-8` override here
          did nothing: Section sets padding-top via inline `style`, which
          always wins over a class on the same element, so the hero was
          silently using the *full*, un-tightened rhythm the whole time.
          `tight` is the actual fix.) */}
      <Section width="reading" tight>
        <Reveal>
          <Eyebrow>Learn</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            The QuantumLearn curriculum
          </SectionTitle>
          {/* "Tracks", not "pillars", in every reader-facing string on this
              page — the nav, the homepage and this page now agree on one word.
              `Pillar` stays the internal type/data/CSS-token name everywhere
              (`PILLARS`, `data-pillar`, `PillarScope`, …); only the prose
              changed. */}
          <Lede className="mt-5 max-w-[46rem]">
            Six tracks, each a stack of courses built on strong high-school math and physics:
            quantum mechanics and computing from first principles, the hardware and software that
            make them real, and graduate-level mastery and research-depth work beyond that.
          </Lede>
          {/* The one clear action for a newcomer, placed before the stats
              readout: a first-time visitor's question is "where do I click?",
              and the previous page shape answered it with four figures to
              parse and no button until a section down. Anchor, not lesson
              link, so the choice of entry point (the fork below) stays a
              real choice. */}
          {rootCourse || intuitionLesson ? (
            <Button href="#ways-in" size="lg" className="mt-7">
              {/* "a 30-minute lesson", not "start in 30 minutes": the number
                  is now whatever the data says, and the phrasing has to stay
                  true at 5 as well as at 40 — "start in 5 minutes" reads as a
                  countdown, not a lesson length. */}
              {introMinutes
                ? `New here? Start with a ${introMinutes}-minute lesson`
                : "New here? Start here"}
            </Button>
          ) : null}
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Tracks", value: PILLARS.length },
              { label: "Courses", value: COURSES.length },
              { label: "Lessons authored", value: lessons.length },
              { label: "Curriculum length", value: totalHours, unit: "h" },
            ]}
          />
        </Reveal>
        {/* Renders nothing for a first-time visitor — the "two ways in"
            panel below is what they see instead. */}
        <ContinueLearning />
      </Section>

      {/* -------------------------------------------------------------
          Two ways in — kept from the previous page, restyled as a pair
          of instrument panels, each tinted to the pillar it leads into,
          with a real "OR" fork marker between them so the choice reads as
          a genuine branch rather than two similar cards. `RecommendedNext`
          (a real recommendation from the prerequisite graph plus stored
          progress) renders first: for a returning reader it is the
          strongest thing in this section — heavier border, bigger heading —
          and for a first-time reader it renders nothing, so this fork is
          the first thing they see either way.
          ------------------------------------------------------------- */}
      {rootCourse || intuitionLesson || lessons.length > 0 ? (
        <Section width="wide" tight id="ways-in">
          <RecommendedNext lessons={lessons} />

          <Reveal>
            <Eyebrow>Where to start</Eyebrow>
            <SectionTitle level={2} size="md" className="mt-3">
              Two ways in, one curriculum
            </SectionTitle>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              New to quantum, or ready to build the rigorous foundation? Both are legitimate ways
              in — pick whichever matches how you learn best.
            </p>
          </Reveal>

          <Reveal delay={80} className="relative mt-8 grid gap-5 sm:grid-cols-2">
            {/* Both fork cards use the same stretched-link treatment as
                CourseList's course cards: the card's one link (its Button)
                carries an inset-0 overlay pseudo-element, anchored to the
                `.instrument` (position: relative in globals.css), so the
                whole card is clickable while the button stays the visible
                affordance and the accessible name stays the button's own
                text. `active:!scale-none` is load-bearing, not cosmetic:
                Button's pressed-state scale would turn the link into a
                containing block mid-press, snapping the overlay down to the
                button's own box between pointerdown and pointerup and
                silently swallowing any click that started elsewhere on the
                card. Secondary links inside a stretched card get
                `relative z-10` to stay clickable above the overlay, exactly
                as CourseList does. */}
            {intuitionLesson ? (
              <div data-pillar="quantum-computing">
                <Instrument
                  className="h-full"
                  label="New to quantum"
                  footnote="No math background needed — physical intuition first, formalism later."
                >
                  <SectionTitle level={3} size="sm">
                    {intuitionLesson.title}
                  </SectionTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{intuitionLesson.description}</p>
                  {/* `withHint`: the visible "no prior background needed"
                      gloss, not the hover-only tooltip — this card is
                      precisely where a beginner on a phone decides whether
                      they're allowed to start here. */}
                  <DifficultyMark difficulty={intuitionLesson.difficulty} withHint className="mt-3" />
                  <Button
                    href={`/lessons/${intuitionLesson.slug}`}
                    size="lg"
                    className="mt-5 before:absolute before:inset-0 before:content-[''] active:!scale-none"
                  >
                    Start with &ldquo;{intuitionLesson.title}&rdquo;
                  </Button>
                </Instrument>
              </div>
            ) : null}
            {/* Decorative fork marker between the two paths — a shape/label
                cue (not a color-only one) that this is a branch, not a pair
                of similar cards. Hidden below `sm`, where the grid is
                already a single stacked column and "OR" would just sit
                between two vertically stacked cards, which reads on its own
                without the chip. */}
            {intuitionLesson && rootCourse ? (
              <div
                aria-hidden="true"
                data-decorative=""
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
              >
                <span className="rounded-full border border-border-strong bg-surface px-2.5 py-1 font-tech text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">
                  Or
                </span>
              </div>
            ) : null}
            {rootCourse ? (
              <div data-pillar="quantum-mechanics">
                <Instrument
                  className="h-full"
                  label="Prefer rigor first"
                  footnote="Needs nothing before it. Derivations and proofs from the first page, not analogies."
                >
                  <SectionTitle level={3} size="sm">
                    {rootCourse.title}
                  </SectionTitle>
                  {/* The count is walked from the prerequisite graph above,
                      not written down here. Both cards in this fork are real
                      roots — neither requires anything first — so the honest
                      difference between them is not "which one is the start"
                      but how much of the curriculum each one carries, and
                      that is a number the data can answer for itself. */}
                  <p className="mt-2 text-sm text-muted-foreground">
                    The mathematics the physics is built on. {dependentCourseCount} of the{" "}
                    {COURSES.length - 1} other courses trace back to it, directly or through their
                    own prerequisites.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {firstLesson ? (
                      <Button
                        href={`/lessons/${firstLesson.slug}`}
                        size="lg"
                        variant="secondary"
                        className="before:absolute before:inset-0 before:content-[''] active:!scale-none"
                      >
                        Start with &ldquo;{firstLesson.title}&rdquo;
                      </Button>
                    ) : null}
                    <Link
                      href={getCourseHref(rootCourse.slug, firstLesson?.slug)}
                      className="relative z-10 text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
                    >
                      View the full course →
                    </Link>
                  </div>
                </Instrument>
              </div>
            ) : null}
          </Reveal>

          {/* -------------------------------------------------------------
              The third tier of the fork, and the answer to the brief's
              "lessons should not feel hidden/invisible until the user
              scrolls."

              Two recommended doors sit above; this is the whole key ring.
              It puts six *real, clickable lesson titles* on screen roughly
              one scroll in, instead of leaving the page's first lesson
              title buried in a course card's module manifest six pillar
              headers down.

              It lives inside this section rather than becoming a section of
              its own on purpose. A third full-height "how to start" block
              between the hero and the catalog would have traded one
              complaint ("where are the lessons") for a worse one ("which of
              these three things am I supposed to click"). As a compact
              instrument under an existing heading it reads as *more detail
              on the same choice*, and it costs about one card's height.

              And because its rows are the first lesson of each pillar in
              curriculum order — not a flat "latest lessons" sample — it
              restates the six-pillar progression on the way past rather
              than flattening it. See PillarLessonStrip's own header.
              ------------------------------------------------------------- */}
          <Reveal delay={140}>
            <PillarLessonStrip lessons={lessons} className="mt-10" />
          </Reveal>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------
          The curriculum itself — search, a difficulty scan, and all six
          pillars in progression order, ending at Apex. `tight` on the top
          edge so a first-time visitor (no "two ways in"/RecommendedNext
          preamble consumed much space above) reaches the first real course
          sooner rather than crossing another full section's worth of
          padding to get here.
          ------------------------------------------------------------- */}
      <Section width="wide" tight>
        <Reveal>
          <LessonSearch lessons={lessons}>
            <CurriculumExplorer lessons={lessons} />
          </LessonSearch>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
