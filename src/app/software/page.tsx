import type { Metadata } from "next";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
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
import { CircuitStateStepper } from "@/components/visualizations/CircuitStateStepper";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { pillarVisual } from "@/lib/design/pillars";
import { swapOverheadForLinearChain } from "@/lib/quantum/transpilation";
import { stateVectorMemoryBytes } from "@/lib/quantum/simulationCost";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";
import type { GateInstruction } from "@/lib/quantum/circuitBuilder";

export const metadata: Metadata = buildPageMetadata({
  title: "Software",
  description: "The simulators, compilers, and SDKs used to program, test, and run quantum algorithms.",
  path: "/software",
});

const PIPELINE_STEPS = [
  { label: "Circuit", detail: "Built as data — gates + qubit indices, exactly like a real SDK" },
  { label: "Transpile", detail: "Decomposed into a native gate set for the target's real connectivity" },
  { label: "Run", detail: "A state-vector simulator, or a real QPU" },
  { label: "Bitstrings", detail: "Sampled measurement outcomes, ready to post-process" },
] as const;

/**
 * A left-to-right flow strip: this pillar's own composition language,
 * distinct from Mechanics' reading column, Computing's split, and
 * Hardware's schematic. Deliberately hand-rolled rather than reusing the
 * generic `PipelineDiagram` visualization component, which hard-codes the
 * site-level `--accent` token — this stays in the pillar channel so it
 * retints correctly under `data-pillar="quantum-software"`. Demoted to a
 * caption beneath the live transpile/execute instrument below — the four
 * static boxes name the stages; the instrument is what actually runs one.
 */
function CompilationPipeline() {
  return (
    // No right-edge `mask-image` fade. The one that was here
    // (`linear-gradient(to right, black 88%, transparent)`) was static, so it
    // did not track scroll position and did not know whether there was
    // anything left to scroll to. Two consequences, both bad: at desktop
    // widths the four steps fit with room to spare — 4 × 10.5rem plus arrows
    // is well inside the container — and the fade dimmed the tail of the
    // last card's text anyway, for no reason; and on a phone, once the reader
    // scrolled to the end, the fade was still over the rightmost card, so
    // "Bitstrings" could never be read at full opacity no matter what they
    // did. Content the reader cannot reach is a worse trade than a visible
    // scrollbar. The cards are `shrink-0` inside `overflow-x-auto`, so a
    // narrow viewport clips the last one mid-card, which is itself the
    // clearest possible signal that the row continues.
    //
    // ...but "the reader can scroll to it" was only ever true with a mouse or
    // a trackpad. This strip holds four `min-w-[10.5rem]` (168px) cards with
    // `gap-3` and a ~14px arrow between each, so its minimum content width is
    // 4 × 168 + 3 × 38 ≈ 786px against the ~288px of column a 320px viewport
    // leaves — and it contains no link, no button, no focusable descendant of
    // any kind. A `div` with `overflow-x: auto` is focusable by default only
    // in Firefox, so on a phone or in a keyboard-only session three of the
    // four pipeline stages were simply unreachable: WCAG 2.1.1. Worse than
    // the usual case, too, because `html, body { overflow-x: clip }`
    // (globals.css §"Full-bleed overhang") means there is no page-level
    // scrollbar to hint that the row continues — the clipped fourth card is
    // the only signal, and it is invisible to anyone not looking at pixels.
    //
    // The fix is `src/mdx-components.tsx`'s `Table` wrapper, one role weaker:
    // `tabIndex={0}` makes it a real tab stop, and a name tells whoever lands
    // on it what they just took focus of and that it moves. `role="group"`
    // rather than `Table`'s `role="region"` deliberately — `region` is a
    // landmark, worth spending on a wide data table a reader may want to find
    // from a landmark list, but this is a four-box caption under a live
    // instrument and does not belong in that list. The visible focus ring is
    // the global `:focus-visible` rule in globals.css (2px pillar outline,
    // 2px offset), which is exactly what `Table`'s explicit utilities
    // recreate; nothing here opts out of it, so it needs no restatement.
    //
    // The name says "scrollable" in words, and uses a comma rather than the
    // em dash the rest of this file's prose would take: several screen
    // readers pronounce "—" outright ("em dash") instead of pausing on it, so
    // punctuation that reads well on screen can read badly aloud in an
    // accessible name.
    <div
      role="group"
      aria-label="Compilation pipeline stages, scrollable"
      tabIndex={0}
      className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-2"
    >
      {PIPELINE_STEPS.map((step, index) => (
        <div key={step.label} className="flex shrink-0 items-center gap-3">
          <div className="min-w-[10.5rem] rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 py-3">
            <p className="font-tech text-[0.65rem] uppercase tracking-[0.12em] text-pillar-text">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{step.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
          </div>
          {index < PIPELINE_STEPS.length - 1 ? (
            <span aria-hidden="true" data-decorative="" className="text-lg text-pillar-text">
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * The transpiled circuit an Instrument below actually runs: a logical
 * H(q0) then CNOT(q0, q2), routed onto LINEAR-CHAIN hardware connectivity
 * (qubit i can only interact with qubit i±1) the way
 * `cnotOnLinearChain` in `src/lib/quantum/transpilation.ts` does it —
 * swap the control into position next to the target, apply the real
 * CNOT, then swap back. Written out explicitly here (rather than calling
 * that function, which operates on a StateVector rather than emitting an
 * instruction list) so `CircuitStateStepper` can step through it gate by
 * gate; the SWAP count below matches `swapOverheadForLinearChain(0, 2)`
 * exactly, so the two never drift apart.
 */
const TRANSPILED_INSTRUCTIONS: GateInstruction[] = [
  { gate: "H", targets: [0] },
  { gate: "SWAP", targets: [0, 1] },
  { gate: "CNOT", targets: [1, 2] },
  { gate: "SWAP", targets: [0, 1] },
];

/** Bytes → binary-prefix string, for the state-vector memory readouts. */
function formatBytes(bytes: number): string {
  const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unitIndex]}`;
}

export default async function SoftwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-software");
  const url = pillarUrl("quantum-software");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Software", url },
  ]);
  const swapOverhead = swapOverheadForLinearChain(0, 2);
  const field = pillarVisual("quantum-software");

  // One derivation over the real registries for every figure this page quotes
  // about itself, and for the primary action (the real first course, in
  // curriculum order) — see `pillarFacts`, shared with the other three track
  // pages, and mechanics/page.tsx for why `getCourseHref` (→
  // `/courses/<slug>`) is the right destination.
  const facts = pillarFacts(courses, lessons);
  const { firstCourse, firstLesson } = facts;
  const heroHref = firstCourse ? getCourseHref(firstCourse.slug, firstLesson?.slug) : "/learn";

  return (
    <PillarScope pillar="quantum-software">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />

      <Section width="reading">
        <Reveal>
          <Eyebrow>Quantum Software</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            The layer between your code and a real qubit
          </SectionTitle>
          <Lede className="mt-5">
            Circuits as data before you ever run them, the state-vector engine underneath every
            simulator and the wall it hits around 30-50 qubits, and the compilation and hybrid
            quantum-classical loops that turn an abstract circuit into something real hardware
            can run.
          </Lede>
          <p className="mt-4 max-w-[42rem] text-sm leading-relaxed text-muted-foreground">
            This is the SDK, simulation, and compilation stack — not the physics or the physical
            device, but the code and infrastructure layer that sits between them.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <PillarBriefing
            className="mt-8"
            facts={facts}
            outcome="Trace a circuit from source, through transpilation onto a real device's connectivity, to the bitstrings that come back — and say why a 50-qubit simulation is not an option."
          />
        </Reveal>

        <Reveal delay={100}>
          <Readouts className="mt-8" items={pillarReadoutItems(facts)} />
        </Reveal>

        {firstCourse ? (
          <Reveal delay={120} className="mt-7 block">
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
          </Reveal>
        ) : null}

        <Reveal delay={140}>
          {/* The track's own instrument readout, kept separate from the shared
              course/lesson/hour row above: this one is a computed physical
              limit, not a measure of the curriculum's size. */}
          <p className="mt-8 tech-label">The state-vector wall, exactly</p>
          <Readouts
            className="mt-3"
            items={[
              { label: "30 qubits", value: formatBytes(stateVectorMemoryBytes(30)) },
              { label: "40 qubits", value: formatBytes(stateVectorMemoryBytes(40)) },
              { label: "50 qubits", value: formatBytes(stateVectorMemoryBytes(50)) },
            ]}
          />
          <p className="mt-3 max-w-[42rem] text-xs leading-relaxed text-subtle-foreground">
            Doubling with every added qubit, computed directly from{" "}
            <code className="text-pillar-text">stateVectorMemoryBytes</code> — not a quoted
            figure. This is why 30-50 qubits is where exact state-vector simulation stops being
            practical on ordinary hardware.
          </p>
          <p className="mt-6 max-w-[42rem] border-l-2 border-pillar-edge pl-4 text-xs leading-relaxed text-subtle-foreground">
            The gates streaming behind this page are not decoration either:{" "}
            {field.fieldCaption.toLowerCase()} — a circuit actually executing, the same model the
            live instrument below runs for real.
          </p>
        </Reveal>
      </Section>

      <Section width="reading" tight aria-labelledby="software-start-heading">
        <Reveal>
          <PillarLessonStrip
            courses={courses}
            lessons={lessons}
            headingId="software-start-heading"
          />
        </Reveal>
      </Section>

      <Section width="wide" aria-labelledby="software-instrument-heading">
        <Reveal>
          <Eyebrow>Live instrument</Eyebrow>
          <SectionTitle level={2} size="lg" id="software-instrument-heading" className="mt-3">
            A circuit, transpiled and executed
          </SectionTitle>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The logical circuit below calls for a Hadamard, then a CNOT directly between qubits 0
            and 2. This hardware only allows adjacent qubits to interact, so the transpiler routes
            the CNOT with a SWAP network first — the same linear-chain routing this platform&rsquo;s
            own tested <code className="text-pillar-text">cnotOnLinearChain</code> implements. Step
            or play through the compiled sequence; the bars are the real |amplitude|&sup2; of the
            state after exactly the highlighted gates, not an animation standing in for one.
          </p>
        </Reveal>

        <Reveal delay={80} y={20} className="mt-8 block">
          <Instrument
            label="Transpile & execute"
            readout={
              <span className="font-tech text-xs text-subtle-foreground">
                {swapOverhead} SWAP{swapOverhead === 1 ? "" : "s"} inserted · linear-chain
                connectivity
              </span>
            }
            footnote="Qubits 0 and 2 end up entangled even though the compiled circuit never applies a gate directly between them — the SWAP network carries qubit 0's amplitude next to qubit 2, the CNOT entangles them there, and a SWAP carries it back. That routing overhead is exactly what Programming Quantum Computers' transpilation unit derives in full."
          >
            <CircuitStateStepper
              numQubits={3}
              instructions={TRANSPILED_INSTRUCTIONS}
              ariaLabel="A logical Hadamard-then-CNOT circuit between qubits 0 and 2, transpiled onto linear-chain hardware connectivity with an inserted SWAP network, stepped gate by gate."
            />
          </Instrument>
        </Reveal>

        <Reveal delay={140} className="mt-8 block">
          <p className="tech-label">Compiled stages</p>
          <div className="mt-4">
            <CompilationPipeline />
          </div>
        </Reveal>
      </Section>

      <Section width="wide" aria-labelledby="software-curriculum-heading">
        <Reveal>
          <Eyebrow>Curriculum</Eyebrow>
          <SectionTitle level={2} size="lg" id="software-curriculum-heading" className="mt-3">
            {courses.length} courses, source to hardware
          </SectionTitle>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Programming model first, then simulation and its real limits, then the compilation
            pipeline that gets a circuit onto actual hardware.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10 block">
          <CourseList courses={courses} lessons={lessons} />
        </Reveal>
      </Section>

      <Section width="reading" tight aria-labelledby="software-next-heading">
        <Reveal>
          <PillarNext pillar="quantum-software" headingId="software-next-heading" />
        </Reveal>
      </Section>
    </PillarScope>
  );
}
