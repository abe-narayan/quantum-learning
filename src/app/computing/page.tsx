import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { CourseList } from "@/components/curriculum/CourseList";
import { LazyBlochSphereHeroExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereHeroExplorer";
import { StaticCircuitDiagram } from "@/components/visualizations/StaticCircuitDiagram";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
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
 * Computing is state-and-circuit led: an asymmetric split puts the state
 * (a live, drivable Bloch sphere) directly beside the text that introduces
 * it, then a small static circuit diagram grounds "circuit" as a concrete
 * object before the curriculum lists the courses that build up to it. A
 * structurally different language from Mechanics' single reading column —
 * see that page file for why the four pillars deliberately don't share one
 * template.
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
  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);

  return (
    <PillarScope pillar="quantum-computing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <Section width="wide">
        <SplitFigure
          align="start"
          text={
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
              <p className="mt-4 max-w-[38rem] text-sm leading-relaxed text-muted-foreground">
                Then run the algorithms that actually use it: Deutsch-Jozsa, Grover, Shor, VQE,
                QAOA, and the error correction that keeps any of it working. Start with{" "}
                <em>Qubits &amp; Quantum States</em> — it only needs the linear algebra and
                complex numbers from Mathematical Foundations for Quantum Mechanics.
              </p>
              <Readouts
                className="mt-8"
                items={[
                  { label: "Courses", value: courses.length },
                  { label: "Curriculum hours", value: totalHours },
                  { label: "Starts from", value: "Qubits & Quantum States" },
                ]}
              />
            </Reveal>
          }
          figure={
            <Reveal delay={100} y={16}>
              <LazyBlochSphereHeroExplorer />
            </Reveal>
          }
        />
      </Section>

      <Section width="reading" tight>
        <Reveal>
          <Instrument
            label="Example circuit"
            readout={<span className="font-tech text-xs text-subtle-foreground">2 qubits · Bell state</span>}
            footnote="Hadamard puts q0 in superposition; CNOT then entangles it with q1 — the smallest circuit whose two qubits can no longer be described separately. Build and run circuits like this yourself in Quantum Gates & Circuits."
          >
            <StaticCircuitDiagram
              numQubits={2}
              instructions={BELL_CIRCUIT}
              ariaLabel="A two-qubit circuit: Hadamard on qubit 0, then a controlled-NOT from qubit 0 to qubit 1, producing a Bell state."
            />
          </Instrument>
        </Reveal>
      </Section>

      <Section width="wide" aria-labelledby="computing-curriculum-heading">
        <SplitFigure
          align="start"
          text={
            <Reveal>
              <Eyebrow>Curriculum</Eyebrow>
              <SectionTitle level={2} size="lg" id="computing-curriculum-heading" className="mt-3">
                {courses.length} courses
              </SectionTitle>
              <p className="mt-3 max-w-sm text-muted-foreground">
                States, then circuits, then the algorithms and error correction that make them
                useful — one qubit to fault tolerance.
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-subtle-foreground">
                Same asymmetric split as the state above: the course stack is the wide, weighty
                side, the way the Bloch sphere was.
              </p>
            </Reveal>
          }
          figure={
            <Reveal delay={80} className="block">
              <CourseList courses={courses} lessons={lessons} />
            </Reveal>
          }
        />
      </Section>
    </PillarScope>
  );
}
