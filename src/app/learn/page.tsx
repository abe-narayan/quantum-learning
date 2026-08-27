import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
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

  // Derived from the actual prerequisite graph, not hardcoded: whichever
  // course(s) require nothing else are the curriculum's true starting
  // point(s). Currently exactly one (Mathematical Foundations) — every
  // other course traces back to it, directly or transitively — but this
  // stays honest automatically if that ever changes.
  const rootCourses = COURSES.filter((course) => course.prerequisites.length === 0);
  const rootCourse = rootCourses[0];
  const firstLesson = rootCourse
    ? lessons
        .filter((lesson) => lesson.course === rootCourse.slug)
        .find((lesson) => lesson.module === rootCourse.modules[0]?.slug)
    : undefined;

  // A second, beginner-friendly entry point alongside the prerequisite-graph
  // root above. "What Is a Qubit?" needs no math background and leads with
  // physical intuition (spinning-coin analogy, a live Bloch-sphere demo)
  // before any formalism — a genuinely different, equally valid way in for a
  // reader who wants the "why" before the "how."
  const intuitionLesson = lessons.find(
    (lesson) => lesson.slug === "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
  );

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
        <Section width="wide" tight>
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
                  <Button href={`/lessons/${intuitionLesson.slug}`} size="sm" className="mt-5">
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
                  footnote="The only course here that needs nothing else before it."
                >
                  <SectionTitle level={3} size="sm">
                    {rootCourse.title}
                  </SectionTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Every course on this platform traces back, directly or through its
                    prerequisites, to {rootCourse.title}.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {firstLesson ? (
                      <Button href={`/lessons/${firstLesson.slug}`} size="sm" variant="secondary">
                        Start with &ldquo;{firstLesson.title}&rdquo;
                      </Button>
                    ) : null}
                    <Link
                      href={getCourseHref(rootCourse.slug, firstLesson?.slug)}
                      className="text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
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
