import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { LessonSearch } from "@/components/curriculum/LessonSearch";
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
      <Section width="reading" className="pt-4 sm:pt-8">
        <Reveal>
          <Eyebrow>Learn</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            The QuantumLearn curriculum
          </SectionTitle>
          <Lede className="mt-5 max-w-[46rem]">
            Six pillars, each building on strong high-school math and physics: quantum mechanics and
            computing from first principles, the hardware and software that make them real, and
            graduate-level mastery and research-depth work beyond that.
          </Lede>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Pillars", value: PILLARS.length },
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
          of instrument panels, each tinted to the pillar it leads into.
          ------------------------------------------------------------- */}
      {rootCourse || intuitionLesson ? (
        <Section width="wide" tight>
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

          <Reveal delay={80} className="mt-8 grid gap-5 sm:grid-cols-2">
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
                  {firstLesson ? (
                    <Button href={`/lessons/${firstLesson.slug}`} size="sm" variant="secondary" className="mt-5">
                      Start with &ldquo;{firstLesson.title}&rdquo;
                    </Button>
                  ) : null}
                </Instrument>
              </div>
            ) : null}
          </Reveal>

          <RecommendedNext lessons={lessons} />
        </Section>
      ) : null}

      {/* -------------------------------------------------------------
          The curriculum itself — search, a difficulty scan, and all six
          pillars in progression order, ending at Apex.
          ------------------------------------------------------------- */}
      <Section width="wide">
        <Reveal>
          <LessonSearch lessons={lessons}>
            <CurriculumExplorer lessons={lessons} />
          </LessonSearch>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
