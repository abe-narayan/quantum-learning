import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Instrument, FadeRule } from "@/components/ui/Panel";
import { Eyebrow, SectionTitle, Lede, TechLabel, Readouts } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { MasteryResultsIndex } from "@/components/mastery/MasteryResultsIndex";
import { ReadinessReadout } from "@/components/apex/ReadinessReadout";
import {
  directPrerequisites,
  firstAuthoredLessonSlug,
  prerequisiteChain,
} from "@/components/apex/readiness";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { COURSES, PILLARS, getCoursesByPillar, getCourse, getPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { PILLAR_ORDER, pillarDepth, pillarVisual } from "@/lib/design/pillars";
import { StateVector } from "@/lib/quantum/state";
import { quantumFourierTransform } from "@/lib/quantum/qft";
import type { Course, Pillar } from "@/lib/content/types";

const PILLAR_INFO = getPillar("quantum-mastery")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Quantum Mastery",
  description: PILLAR_INFO.description,
  path: "/mastery",
});

/** Binary label for a computational basis index, e.g. toBinaryLabel(5, 3) -> "101". */
function toBinaryLabel(value: number, bits: number): string {
  return value.toString(2).padStart(bits, "0");
}

/**
 * The real |U_jk| / arg(U_jk) structure of the N-dimensional quantum Fourier
 * transform, computed by feeding each computational basis state through this
 * platform's own tested `quantumFourierTransform` (src/lib/quantum/qft.ts) —
 * not a hand-picked formula. Every entry of a QFT matrix has identical
 * magnitude 1/sqrt(N); the phase is where all of the structure lives, which
 * is exactly what the figure on this page plots.
 */
function computeQftStructure(numQubits: number) {
  const dimension = 2 ** numQubits;
  const cells = Array.from({ length: dimension }, (_, j) => {
    const transformed = quantumFourierTransform(StateVector.basis(numQubits, j));
    return transformed.amplitudes.map((amplitude, k) => ({
      j,
      k,
      magnitude: amplitude.magnitude(),
      phase: amplitude.phase(),
    }));
  });
  const flat = cells.flat();
  const magnitudes = flat.map((cell) => cell.magnitude);
  const avgMagnitude = magnitudes.reduce((sum, m) => sum + m, 0) / magnitudes.length;
  const magnitudeSpread = Math.max(...magnitudes) - Math.min(...magnitudes);
  const distinctPhases = new Set(flat.map((cell) => Math.round(cell.phase * 1e6))).size;
  return { dimension, cells, avgMagnitude, magnitudeSpread, distinctPhases };
}

export default async function MasteryPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-mastery");
  const url = pillarUrl("quantum-mastery");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Quantum Mastery", url },
  ]);

  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const totalModules = courses.reduce((sum, course) => sum + course.modules.length, 0);
  const authoredModules = courses.reduce((sum, course) => {
    const authoredSlugs = new Set(
      lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => lesson.module)
    );
    return sum + course.modules.filter((module) => authoredSlugs.has(module.slug)).length;
  }, 0);

  const trackPosition = pillarDepth("quantum-mastery") + 1;
  const trackTotal = PILLAR_ORDER.length;

  // Real dependency structure, derived entirely from the curriculum's own
  // `prerequisites` arrays — nothing below is asserted independently of that
  // data. Three edges per Mastery course: what feeds it from an earlier
  // pillar, whether another Mastery course feeds it, and which Apex courses
  // (if any) list it as a direct prerequisite in turn.
  const masteryCourseSlugs = new Set(courses.map((course) => course.slug));
  const apexCourses = COURSES.filter((course) => course.pillar === "apex");

  function pillarTitle(pillar: Pillar): string {
    return PILLARS.find((entry) => entry.slug === pillar)?.title ?? pillar;
  }

  const dependencyRows = courses.map((course) => {
    const prerequisiteCourses = course.prerequisites
      .map((slug) => getCourse(slug))
      .filter((c): c is Course => Boolean(c));
    const inbound = prerequisiteCourses.filter((c) => !masteryCourseSlugs.has(c.slug));
    const internalPrereq = prerequisiteCourses.find((c) => masteryCourseSlugs.has(c.slug));
    const outbound = apexCourses.filter((apexCourse) => apexCourse.prerequisites.includes(course.slug));
    return { course, inbound, internalPrereq, outbound };
  });

  const gatedApexSlugs = new Set(dependencyRows.flatMap((row) => row.outbound.map((c) => c.slug)));

  // The same prerequisite data the dependency structure above renders, walked
  // transitively so `ReadinessReadout` can name the specific first course a
  // reader who arrives early hasn't finished — see that component's own note
  // on why this is a status readout and not a gate.
  const directPrereqs = directPrerequisites(courses, lessons);
  const prereqChain = prerequisiteChain(courses, lessons);

  const qft = computeQftStructure(3);
  const cellSize = 20;
  const margin = 32;
  const gridExtent = qft.dimension * cellSize;
  const svgSize = margin + gridExtent + 6;

  const algorithmsCourse = getCourse("advanced-algorithms-and-complexity");
  const qftModule = algorithmsCourse?.modules.find(
    (module) => module.slug === "phase-estimation-precision-and-qft-depth"
  );

  const apexInfo = getPillar("apex");

  return (
    <PillarScope pillar="quantum-mastery">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      {/* -------------------------------------------------------------
          Hero
          ------------------------------------------------------------- */}
      {/* `tight`, not `className="pt-4 sm:pt-8"`: `Section` writes its
          vertical padding as an inline `style`, which always beats a class on
          the same element, so that override compiled fine and applied to
          nothing — the page opened with the full `--rhythm-section` (72px at
          320px, 136px on a wide desktop) where 16px was asked for. `tight` is
          the prop that actually reduces it. Same dead override as /learn's
          hero, error.tsx and not-found.tsx. */}
      <Section width="reading" tight>
        {/* The h1 renders immediately rather than inside a Reveal — an
            above-the-fold page title must not depend on JS/observer timing
            to become visible, matching Hero and ApexHero on the other two
            pillar-less/terminal pages. */}
        <Eyebrow>
          Quantum Mastery · Track {String(trackPosition).padStart(2, "0")} / {String(trackTotal).padStart(2, "0")}
        </Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-4">
          Where the notation becomes the object
        </SectionTitle>
        <Lede className="mt-5 max-w-[46rem]">{PILLAR_INFO.description}</Lede>
        <Reveal delay={60}>
          <p className="mt-4 max-w-[46rem] text-base leading-relaxed text-muted-foreground">
            Five self-contained structures, each making rigorous what the
            core curriculum used but never proved: the spectral theorem
            beyond bounded self-adjoint operators, the general
            angular-momentum coupling behind the Wigner-Eckart theorem and
            Berry&rsquo;s geometric phase, the Schmidt decomposition and the
            Lindblad master equation, a formal BQP with a real
            Trotter-Suzuki error bound, and quantum Shannon theory&rsquo;s
            POVMs, Stinespring dilation, and channel capacities.
          </p>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Courses", value: courses.length },
              { label: "Total depth", value: totalHours, unit: "hrs" },
              { label: "Lessons authored", value: `${authoredModules}/${totalModules}` },
              { label: "Level", value: "Master", unit: "graduate" },
            ]}
          />
        </Reveal>
        <Reveal delay={120}>
          <ReadinessReadout
            className="mt-8 max-w-[46rem]"
            label="Prerequisites assumed"
            pillarLabel="Quantum Mastery"
            direct={directPrereqs}
            chain={prereqChain}
          />
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------
          Curriculum position — a real dependency structure, not a card
          grid: what feeds each course, whether one Mastery course feeds
          another, and which Apex course(s) require it in turn.
          ------------------------------------------------------------- */}
      <Section width="wide">
        <Reveal>
          <Eyebrow>Curriculum position</Eyebrow>
          <SectionTitle level={2} size="lg" className="mt-3">
            Five entry points, one exit
          </SectionTitle>
          <p className="mt-3 max-w-[46rem] text-sm leading-relaxed text-muted-foreground">
            Mastery does not have a single on-ramp. Each course below opens once its own real
            prerequisites — drawn from the four core tracks — are complete, and each links forward
            to whichever Apex course actually lists it as a requirement. Nothing here is asserted
            independently of that data.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <Instrument
            label="Dependency structure"
            footnote="Prerequisite and dependent courses are read directly from each course's `prerequisites` array in the curriculum data."
          >
            <ol className="divide-y divide-border">
              {dependencyRows.map(({ course, inbound, internalPrereq, outbound }) => (
                <li
                  key={course.slug}
                  className="grid gap-4 py-5 first:pt-1 last:pb-1 lg:grid-cols-[1.1fr_auto_1.3fr_auto_1.1fr] lg:items-center"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {internalPrereq ? (
                      <Link
                        href={getCourseHref(internalPrereq.slug, firstAuthoredLessonSlug(internalPrereq.slug, lessons))}
                        className="hover:underline"
                      >
                        <Badge tone="brand">After: {internalPrereq.title}</Badge>
                      </Link>
                    ) : null}
                    {inbound.map((prereq) => (
                      <Link
                        key={prereq.slug}
                        href={getCourseHref(prereq.slug, firstAuthoredLessonSlug(prereq.slug, lessons))}
                        className="hover:underline"
                      >
                        <Badge tone="neutral">
                          {prereq.title} · {pillarTitle(prereq.pillar)}
                        </Badge>
                      </Link>
                    ))}
                    {inbound.length === 0 && !internalPrereq ? (
                      <span className="text-xs text-subtle-foreground">No core-track prerequisite</span>
                    ) : null}
                  </div>

                  <span aria-hidden="true" data-decorative="" className="hidden text-subtle-foreground lg:block">
                    →
                  </span>

                  <div>
                    <TechLabel>{course.difficulty}</TechLabel>
                    <p className="mt-1 font-display text-lg font-semibold leading-snug">
                      <Link
                        href={getCourseHref(course.slug, firstAuthoredLessonSlug(course.slug, lessons))}
                        className="text-foreground transition-colors hover:text-pillar-text focus-visible:text-pillar-text"
                      >
                        {course.title}
                      </Link>
                    </p>
                  </div>

                  <span aria-hidden="true" data-decorative="" className="hidden text-subtle-foreground lg:block">
                    →
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {outbound.map((dependent) => (
                      <Link
                        key={dependent.slug}
                        href={getCourseHref(dependent.slug, firstAuthoredLessonSlug(dependent.slug, lessons))}
                        className="hover:underline"
                      >
                        <Badge tone="accent">{dependent.title}</Badge>
                      </Link>
                    ))}
                    {outbound.length === 0 ? (
                      <span className="text-xs text-subtle-foreground">No direct Apex dependent</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Instrument>
        </Reveal>

        <Reveal delay={120} className="mt-4">
          <p className="text-sm text-muted-foreground">
            {gatedApexSlugs.size} of Apex&rsquo;s {apexCourses.length} courses list a Quantum Mastery
            course as a direct prerequisite.
          </p>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------
          The operator, computed — a real 8x8 QFT matrix, not a stylized
          approximation, echoing (and grounding) the background field's
          own "operator" regime.
          ------------------------------------------------------------- */}
      <Section width="wide">
        <SplitFigure
          reverse
          text={
            <Reveal>
              <Eyebrow>The operator, computed</Eyebrow>
              <SectionTitle level={2} size="lg" className="mt-3">
                Every entry is the same size
              </SectionTitle>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The magnitude field behind this page is a stylized Fourier-like unitary. This is the
                real thing: the {qft.dimension}-dimensional quantum Fourier transform, computed by
                running each computational basis state through this platform&rsquo;s own tested{" "}
                <code className="text-pillar-text">quantumFourierTransform</code> implementation
                rather than a formula picked for looks.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                A genuine unitary has flat magnitude — every one of the {qft.dimension * qft.dimension}{" "}
                entries below has magnitude 1/&radic;{qft.dimension}, to numerical precision. All of
                the structure is in the phase, which is what the grid actually plots.
                {qftModule ? (
                  <>
                    {" "}
                    {algorithmsCourse?.title} covers exactly this tradeoff in{" "}
                    <span className="text-foreground">{qftModule.title}</span>.
                  </>
                ) : null}
              </p>
              <Readouts
                className="mt-6"
                items={[
                  { label: "Dimension", value: `${qft.dimension} × ${qft.dimension}` },
                  { label: "|U_jk|, every entry", value: qft.avgMagnitude.toFixed(4) },
                  { label: "Magnitude spread", value: qft.magnitudeSpread.toExponential(1) },
                  { label: "Distinct phases", value: qft.distinctPhases },
                ]}
              />
            </Reveal>
          }
          figure={
            <Reveal delay={100}>
              <Instrument
                label={`QFT · N = ${qft.dimension}`}
                footnote="Cell opacity tracks |cos(arg(U_jk))| — the same visual grammar the background field uses, but read off a real computed matrix."
              >
                <figure>
                  <svg
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                    className="mx-auto h-auto w-full max-w-xs"
                    aria-hidden="true"
                  >
                    <rect
                      x={margin}
                      y={margin}
                      width={gridExtent}
                      height={gridExtent}
                      fill="none"
                      style={{ stroke: "var(--border-strong)" }}
                      strokeWidth={1}
                    />
                    {qft.cells.flat().map((cell) => (
                      <rect
                        key={`${cell.j}-${cell.k}`}
                        x={margin + cell.k * cellSize}
                        y={margin + cell.j * cellSize}
                        width={cellSize - 1.5}
                        height={cellSize - 1.5}
                        fillOpacity={0.12 + Math.abs(Math.cos(cell.phase)) * 0.72}
                        style={{ fill: "var(--pillar-accent)" }}
                      />
                    ))}
                    {Array.from({ length: qft.dimension }, (_, i) => (
                      <text
                        key={`col-${i}`}
                        x={margin + i * cellSize + cellSize / 2}
                        y={margin - 9}
                        textAnchor="middle"
                        style={{ font: "9px var(--font-tech)", fill: "var(--subtle-foreground)" }}
                      >
                        {i}
                      </text>
                    ))}
                    {Array.from({ length: qft.dimension }, (_, i) => (
                      <text
                        key={`row-${i}`}
                        x={margin - 8}
                        y={margin + i * cellSize + cellSize / 2 + 3}
                        textAnchor="end"
                        style={{ font: "9px var(--font-tech)", fill: "var(--subtle-foreground)" }}
                      >
                        {i}
                      </text>
                    ))}
                  </svg>
                  <figcaption className="mt-3 text-xs leading-relaxed text-subtle-foreground">
                    Rows j and columns k are computational basis indices 0–{qft.dimension - 1} (binary{" "}
                    {toBinaryLabel(0, 3)}–{toBinaryLabel(qft.dimension - 1, 3)}). Each cell&rsquo;s
                    opacity is |cos(arg(U<sub>jk</sub>))| for the real matrix entry
                    U<sub>jk</sub> = ⟨k|QFT|j⟩, computed above.
                  </figcaption>
                </figure>
              </Instrument>
            </Reveal>
          }
        />
      </Section>

      {/* -------------------------------------------------------------
          The five structures — a bespoke results index in Mastery's own
          register (see MasteryResultsIndex's own doc comment), replacing
          the generic CourseTimeline + CourseList every core pillar shares.
          Deliberately distinct from ApexCourseIndex: roman numerals rather
          than §-numbering, a "Result" statement rather than a research-index
          framing, and a flowing module line rather than a two-column grid.
          ------------------------------------------------------------- */}
      <Section width="wide" aria-labelledby="results-index-heading">
        <Reveal>
          <Eyebrow>The five structures</Eyebrow>
          <SectionTitle id="results-index-heading" level={2} size="lg" className="mt-3">
            Where the curriculum&rsquo;s results get proved
          </SectionTitle>
          <p className="mt-3 max-w-[46rem] text-sm leading-relaxed text-muted-foreground">
            Five independent entry points, not a single track — see &ldquo;Curriculum
            position&rdquo; above for exactly what each one requires. Every statement
            below traces to that course&rsquo;s own module list.
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <MasteryResultsIndex courses={courses} lessons={lessons} />
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------
          Then: Apex
          ------------------------------------------------------------- */}
      <Section width="reading" className="pb-4">
        <Reveal>
          <FadeRule />
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Eyebrow>Then</Eyebrow>
              {/* Deliberately one size below this page's other section
                  headings (`size="lg"` above) — this isn't a peer section,
                  it's a closing forward-pointer to the next pillar, the one
                  spot on the site where that transition exists. Per
                  docs/UX_REVIEW.md P2-3: comment the density choice rather
                  than leave it looking like an accidental mismatch. */}
              <SectionTitle level={2} size="md" className="mt-2">
                Apex
              </SectionTitle>
              {apexInfo ? (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {apexInfo.description}
                </p>
              ) : null}
            </div>
            {/* Button mechanics, not a pill: same tight radius, press scale
                and pillar focus ring as `ui/Button.tsx`, with the pillar-edge
                voice this hand-off moment already used. */}
            <Link
              href={pillarVisual("apex").route}
              className="tech-label inline-flex shrink-0 items-center gap-2 rounded-(--radius-tight) border border-pillar-edge px-4 py-2.5 text-pillar-text transition-[color,background-color,border-color,transform] duration-(--dur-fast) ease-instrument hover:bg-pillar-wash active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Continue to Apex →
            </Link>
          </div>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
