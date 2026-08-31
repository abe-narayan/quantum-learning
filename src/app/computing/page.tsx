import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
import {
  PillarBriefing,
  PillarLessonStrip,
  PillarNext,
  pillarFacts,
  pillarReadoutItems,
} from "@/components/pillar/PillarFraming";
import { TierLadder } from "@/components/pillar/TierLadder";
import { LazyBlochSphereHeroExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereHeroExplorer";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { pillarVisual } from "@/lib/design/pillars";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";
import type { GateInstruction } from "@/lib/quantum/circuitBuilder";

export const metadata: Metadata = buildPageMetadata({
  title: "Computing",
  description:
    "Qubits, gates, and circuits, and the algorithms that give quantum computers their power.",
  path: "/computing",
});

/** H on q0, then CNOT(0 → 1): the Bell-state circuit, the first genuinely
 *  two-qubit thing this pillar teaches and the smallest circuit that
 *  produces entanglement. */
const BELL_CIRCUIT: GateInstruction[] = [
  { gate: "H", targets: [0] },
  { gate: "CNOT", targets: [0, 1] },
];

/**
 * Computing is state-and-circuit led, and the page argues that twice with
 * the same move. The hero is an asymmetric split with the state on the wide
 * side: a live, drivable Bloch sphere beside the text that introduces it.
 * The curriculum is the same split again, with the course stack on the wide
 * side and a real two-qubit circuit on the narrow one, because a gate
 * sequence composed against a state is exactly what these courses are, and
 * putting the circuit in a full-width band of its own said the opposite.
 *
 * A structurally different language from Mechanics' reading column and
 * full-bleed chronological rail, Hardware's schematic, and Software's staged
 * pipeline. See those page files for why the four tracks deliberately don't
 * share one template.
 */
export default async function ComputingPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-computing");
  const url = pillarUrl("quantum-computing");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Computing", url },
  ]);
  const field = pillarVisual("quantum-computing");

  // One derivation over the real registries for every figure this page quotes
  // about itself, and for the primary action (the real first course, in
  // curriculum order), see `pillarFacts`, shared with the other three track
  // pages, and mechanics/page.tsx for why `getCourseHref` (→
  // `/courses/<slug>`) is the right destination.
  const facts = pillarFacts(courses, lessons);
  const { firstCourse, firstLesson } = facts;
  const heroHref = firstCourse ? getCourseHref(firstCourse.slug, firstLesson?.slug) : "/learn";

  return (
    <PillarScope pillar="quantum-computing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <Section width="wide">
        {/* Written out rather than the shared `SplitFigure`, whose two
            children are always DOM-ordered text-then-figure (only their
            *visual* left/right can flip, via `reverse`). This hero's text
            column carries the tier ladder, the briefing and its own
            prerequisite links, the readouts, and a closing caption, all of
            which run well past where the shorter figure column ends; with
            `SplitFigure` (`align="start"`) the figure's own Bloch-sphere
            control was the LAST stop in the whole hero's tab sequence, and it
            sits near the row's top. Measured with
            `scripts/audit/a11y.mjs --routes "/computing"`: the briefing's own
            last prerequisite link (the text column's last focusable element)
            to the sphere jumped back 823px. Reordering the two columns in the
            DOM (figure first, text second, with `lg:col-start-*` restoring
            the original visual left/right regardless of DOM order) drains
            the short figure column first instead, so the tab sequence ends
            on the text column's own last stop, where the eye already is.
            `order-2`/`order-1` (unprefixed, so only below `lg`) keep the
            single-column phone layout in its original text-then-figure
            reading order; see ComputingSection.tsx on the homepage for the
            same fix, same measurements. */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-14">
          <div className="order-2 min-w-0 lg:col-start-2">
            <Reveal delay={100} y={16}>
              <LazyBlochSphereHeroExplorer />
            </Reveal>
          </div>
          <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
            <Reveal>
              <Eyebrow>Quantum Computing</Eyebrow>
              <SectionTitle level={1} size="xl" className="mt-4">
                Build the machines, then run the algorithms
              </SectionTitle>
              <Lede className="mt-5">
                Build a single qubit&rsquo;s state on the Bloch sphere, then wire multi-qubit
                circuits together, entangle them, and reason formally about what you&rsquo;ve
                built with density matrices and Bell tests.
              </Lede>
              {/* The primary CTA sits right after the standfirst rather than
                  below the tier ladder and briefing. On a phone those two
                  blocks (the foundations tier's ENTRY_BAR sentence is the
                  long one) push past 500px on their own, which left this
                  button below the 812px fold with zero forward actions above
                  it: measured with `scripts/audit/orientation.mjs --widths
                  375`. The ladder, briefing and the algorithms paragraph are
                  still the very next things a reader meets. */}
              {firstCourse ? (
                <div className="mt-7">
                  <Button href={heroHref} size="lg">
                    Start: {firstCourse.title} →
                  </Button>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
                    <span>
                      {facts.firstCourseLessonCount} lessons
                      {firstLesson ? <> &middot; begins with &ldquo;{firstLesson.title}&rdquo;</> : null}
                    </span>
                    <DifficultyMark difficulty={firstCourse.difficulty} />
                  </p>
                </div>
              ) : null}

              <p className="mt-6 max-w-[38rem] text-sm leading-relaxed text-muted-foreground">
                Then run the algorithms that actually use it: Deutsch-Jozsa, Grover, Shor, VQE,
                QAOA, and the error correction that keeps any of it working.
              </p>

              {/* Same four-rung ladder, same position, as every other pillar
                  page: it is the one element that carries the hierarchy
                  between them, so it cannot be styled per page. */}
              <TierLadder pillar="quantum-computing" className="mt-8" />

              <PillarBriefing
                className="mt-8"
                facts={facts}
                outcome="Build a working algorithm out of gates you chose yourself, and say honestly which problems it does and does not speed up."
              />

              <Readouts className="mt-8" items={pillarReadoutItems(facts)} />

              <p className="mt-6 max-w-sm border-l-2 border-pillar-edge pl-4 text-xs leading-relaxed text-subtle-foreground">
                The background behind this page is not decoration either: {field.fieldCaption.toLowerCase()},
                the same Larmor precession the sphere beside this text lets you drive by hand.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section width="reading" tight aria-labelledby="computing-start-heading">
        <Reveal>
          <PillarLessonStrip
            courses={courses}
            lessons={lessons}
            headingId="computing-start-heading"
          />
        </Reveal>
      </Section>

      <Section width="wide" aria-labelledby="computing-curriculum-heading">
        <SplitFigure
          align="start"
          text={
            <Reveal>
              <Eyebrow>Curriculum</Eyebrow>
              <SectionTitle level={2} size="lg" id="computing-curriculum-heading" className="mt-3">
                {courses.length} courses, one qubit to fault tolerance
              </SectionTitle>
              <p className="mt-3 text-muted-foreground">
                States, then circuits, then the algorithms and the error correction that make them
                useful, each course built directly on the one before it.
              </p>

              {/* The circuit sits *beside* the course stack rather than in a
                  section of its own above it, because that is the claim this
                  pillar makes: a gate sequence is composed against a state,
                  and the courses are the sequence. Two qubits and two gates
                  is the smallest circuit that has anything to compose. */}
              <Instrument
                className="mt-6"
                label="Example circuit"
                readout={
                  <span className="font-tech text-xs text-subtle-foreground">
                    2 qubits · Bell state
                  </span>
                }
                footnote="Hadamard puts q0 in superposition; CNOT then entangles it with q1: the smallest circuit whose two qubits can no longer be described separately. Quantum Gates & Circuits, listed here, is where you build and run one yourself."
              >
                <StaticCircuitDiagram
                  numQubits={2}
                  instructions={BELL_CIRCUIT}
                  ariaLabel="A two-qubit circuit: Hadamard on qubit 0, then a controlled-NOT from qubit 0 to qubit 1, producing a Bell state."
                />
              </Instrument>
            </Reveal>
          }
          figure={
            <Reveal delay={80} className="block">
              <CourseList courses={courses} lessons={lessons} />
            </Reveal>
          }
        />
      </Section>

      <Section width="reading" tight aria-labelledby="computing-next-heading">
        <Reveal>
          <PillarNext pillar="quantum-computing" headingId="computing-next-heading" />
        </Reveal>
      </Section>
    </PillarScope>
  );
}
