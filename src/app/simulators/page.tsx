import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Eyebrow, SectionTitle, Lede, Readouts, TechLabel } from "@/components/ui/Typography";
import { pillarVisual } from "@/lib/design/pillars";
import type { Pillar } from "@/lib/content/types";
import { LazyBlochSphereExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereExplorer";
import { LazyTwoQubitExplorer } from "@/components/simulators/two-qubit-explorer/LazyTwoQubitExplorer";
import { LazyComplexAmplitudeExplorer } from "@/components/simulators/complex-amplitude-explorer/LazyComplexAmplitudeExplorer";
import { LazyWavefunctionExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionExplorer";
import { LazyDensityMatrixExplorer } from "@/components/simulators/density-matrix-explorer/LazyDensityMatrixExplorer";
import { LazyCircuitBuilder } from "@/components/simulators/circuit-builder/LazyCircuitBuilder";
import { LazyGroverExplorer } from "@/components/simulators/grover-explorer/LazyGroverExplorer";
import { LazyRabiExplorer } from "@/components/simulators/rabi-explorer/LazyRabiExplorer";
import { LazyNoiseExplorer } from "@/components/simulators/noise-explorer/LazyNoiseExplorer";
import { LazySyndromeExplorer } from "@/components/simulators/syndrome-explorer/LazySyndromeExplorer";
import { LazyPeriodFindingExplorer } from "@/components/simulators/period-finding-explorer/LazyPeriodFindingExplorer";
import { LazyQAOAExplorer } from "@/components/simulators/qaoa-explorer/LazyQAOAExplorer";
import { LazyCHSHBellTestExplorer } from "@/components/simulators/chsh-bell-test/LazyCHSHBellTestExplorer";
import { LazyCompareStatesExplorer } from "@/components/simulators/compare-states/LazyCompareStatesExplorer";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Simulators",
  description: "Interactive quantum simulators for building intuition about qubits and circuits.",
  path: "/simulators",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Simulators", url: `${BASE_URL}/simulators` },
]);

/**
 * The lab-bench directory. Every instrument gets a pillar (which retints its
 * mount via `data-pillar`, matching the identity it carries inside its home
 * lessons — see `src/lib/design/pillars.ts`), one sentence of what physics
 * it actually demonstrates, and one sentence that's a real reason to open
 * it — not "try the sliders," but the specific thing that happens when you
 * do.
 *
 * `level` and `lesson` are the honesty pair. Everything on this bench runs
 * without an account and without finishing anything first, but that is not
 * the same as everything being equally approachable, and pretending otherwise
 * is its own kind of unfriendliness. `level` says plainly which of the three
 * a given instrument is; `lesson` links the one lesson that introduces it
 * properly, for the readers who want that instead of poking at it cold.
 */
type SimulatorLevel = "open" | "warmed-up" | "grounded";

const LEVEL_COPY: Record<SimulatorLevel, { label: string; blurb: string }> = {
  open: {
    label: "No background needed",
    blurb: "Everything on the controls is explained on the controls. Start here.",
  },
  "warmed-up": {
    label: "Easier after one qubit makes sense",
    blurb: "Usable cold, but it assumes you've met a single qubit somewhere first.",
  },
  grounded: {
    label: "Built for a lesson",
    blurb: "You can absolutely drive it now; it will mean far more after the lesson linked below.",
  },
};

type SimulatorEntry = {
  id: string;
  label: string;
  pillar: Pillar;
  physics: string;
  why: string;
  level: SimulatorLevel;
  /** The lesson that introduces this instrument's ideas. Verified to exist under `src/content/lessons/`. */
  lesson?: { href: string; title: string };
};

const SIMULATOR_INDEX: SimulatorEntry[] = [
  {
    id: "bloch-sphere",
    label: "Bloch Sphere Explorer",
    pillar: "quantum-computing",
    physics: "A qubit drawn as an arrow on a ball. Operations turn the arrow; measuring snaps it, at random, to the top or the bottom.",
    why: "Rotate a real qubit by hand and watch superposition collapse the instant you measure it.",
    level: "open",
    lesson: {
      href: "/lessons/quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      title: "The Bloch Sphere",
    },
  },
  {
    id: "complex-amplitude-explorer",
    label: "Complex Plane & Amplitude Explorer",
    pillar: "quantum-mechanics",
    physics: "The arrow behind a probability: an amplitude has a length and a direction, and only the length squared ever becomes odds.",
    why: "See directly why the direction is invisible in one measurement and decisive whenever two paths meet.",
    level: "open",
    lesson: {
      href: "/lessons/quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
      title: "Complex Numbers for Quantum Mechanics",
    },
  },
  {
    id: "density-matrix-explorer",
    label: "Density Matrix Explorer",
    pillar: "quantum-computing",
    physics: "The difference between a qubit that has no answer yet and one that has an answer you weren't told — and why only one of them sits on the sphere's surface.",
    why: "Watch purity and entropy update in real time as you dial in a genuine statistical mixture.",
    level: "warmed-up",
    lesson: {
      href: "/lessons/quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
      title: "From State Vectors to Density Matrices",
    },
  },
  {
    id: "compare-states-explorer",
    label: "Cross-Simulator Comparison",
    pillar: "quantum-computing",
    physics: "One qubit, three pictures at once: a point on a ball, two arrows in a plane, and a pair of bars.",
    why: "Confirm for yourself that three very different-looking pictures are the same number.",
    level: "open",
  },
  {
    id: "two-qubit-explorer",
    label: "2-Qubit State Explorer",
    pillar: "quantum-computing",
    physics: "What changes when two qubits stop being independent — and what a measurement on one does to the other.",
    why: "Measure one qubit of a Bell pair and watch the other's outcome become fixed, instantly.",
    level: "warmed-up",
    lesson: {
      href: "/lessons/quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
      title: "Bell States and Entanglement",
    },
  },
  {
    id: "circuit-builder",
    label: "Circuit Builder",
    pillar: "quantum-software",
    physics: "The build-then-run workflow real quantum SDKs use: stack operations on wires, then step through them one at a time.",
    why: "Step backward and forward through your own circuit and watch exactly when entanglement appears.",
    level: "warmed-up",
    lesson: {
      href: "/lessons/quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
      title: "Building Quantum Circuits",
    },
  },
  {
    id: "chsh-bell-test",
    label: "CHSH Bell Test",
    pillar: "quantum-computing",
    physics: "The experiment that ruled out the comfortable explanation: that each particle was carrying its answer all along.",
    why: "Push S past 2 and you've recreated the measurement that won the 2022 Nobel Prize in Physics.",
    level: "grounded",
    lesson: {
      href: "/lessons/quantum-computing/entanglement-and-measurement/the-chsh-inequality",
      title: "The CHSH Inequality",
    },
  },
  {
    id: "rabi-explorer",
    label: "Rabi / Qubit Dynamics Explorer",
    pillar: "quantum-hardware",
    physics: "How a control pulse actually flips a physical qubit — and what goes wrong when the pulse is tuned slightly off.",
    why: "Mistune the drive and watch the flip stop completing, exactly as far short as the formula predicts.",
    level: "open",
    lesson: {
      href: "/lessons/quantum-hardware/control-and-readout/calibration",
      title: "Calibration",
    },
  },
  {
    id: "noise-explorer",
    label: "Noise & Decoherence Explorer",
    pillar: "quantum-hardware",
    physics: "A qubit losing its quantum information to the environment, one step at a time — the reason quantum computers are hard to build.",
    why: "Watch a pure state visibly decay toward a channel's fixed point — the same T1/T2 decay hardware engineers measure.",
    level: "open",
    lesson: {
      href: "/lessons/quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
      title: "T1 and T2 Decoherence",
    },
  },
  {
    id: "wavefunction-explorer",
    label: "Wavefunction Explorer",
    pillar: "quantum-mechanics",
    physics: "A particle as a spreading wave, solved numerically frame by frame — including one leaking through a wall it has no business crossing.",
    why: "Watch a wave packet disperse, an eigenstate sit frozen, and a particle tunnel through a barrier it classically couldn't cross.",
    level: "warmed-up",
    lesson: {
      href: "/lessons/quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
      title: "The Schrödinger Equation in Position Space",
    },
  },
  {
    id: "grover-explorer",
    label: "Grover's Algorithm Explorer",
    pillar: "quantum-computing",
    physics: "Searching an unsorted list by pushing probability onto the right answer instead of checking items one by one.",
    why: "Step past the optimal number of rounds and watch the success probability overshoot and fall back down.",
    level: "warmed-up",
    lesson: {
      href: "/lessons/quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
      title: "Grover's Algorithm: Amplitude Amplification",
    },
  },
  {
    id: "period-finding-explorer",
    label: "Period-Finding Explorer",
    pillar: "quantum-computing",
    physics: "The subroutine at the heart of Shor's algorithm: find how often a pattern repeats, and you've factored the number.",
    why: "Freely explore the mechanism the lessons only ever show at one fixed worked example.",
    level: "grounded",
    lesson: {
      href: "/lessons/quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
      title: "The Quantum Period-Finding Circuit",
    },
  },
  {
    id: "qaoa-explorer",
    label: "Max-Cut QAOA Explorer",
    pillar: "quantum-computing",
    physics: "Two dials, tuned by hand, biasing a quantum circuit toward good answers to a hard optimization problem.",
    why: "Drag the cost and mixer angles yourself and see how close you can push toward the true best split.",
    level: "grounded",
    lesson: {
      href: "/lessons/quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
      title: "QAOA and Combinatorial Optimization",
    },
  },
  {
    id: "syndrome-explorer",
    label: "Syndrome Explorer",
    pillar: "quantum-computing",
    physics: "Finding and fixing an error in a qubit without ever looking at the qubit — because looking would destroy it.",
    why: "Inject an error, predict which qubit the decoder will blame, then check — and see recovery break past weight one.",
    level: "grounded",
    lesson: {
      href: "/lessons/quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      title: "The Three-Qubit Bit-Flip Code",
    },
  },
];

/**
 * The bench's five named groups, matched one-to-one against the page's own
 * `<section>`s below — the jump-nav is built from this same table (see
 * `SimulatorNav`) so it can never drift out of sync with the groupings it
 * claims to map, the defect the UX review named directly (P1-12).
 */
type SimulatorGroup = {
  id: string;
  title: string;
  description: string;
  simulatorIds: string[];
};

/**
 * Group titles name **what you will see happen**, not which pillar the
 * instruments were filed under. A reader who does not yet know the words
 * "multi-qubit" or "decoherence" can still tell these five apart on sight,
 * which is the entire job of a directory. The pillar identity hasn't gone
 * anywhere — it still tints each instrument and links back to its course
 * from the mount header.
 */
const SIMULATOR_GROUPS: SimulatorGroup[] = [
  {
    id: "single-qubit-fundamentals",
    title: "Watch one qubit move",
    description:
      "Four views of a single qubit: as an arrow you can rotate, as the arrows behind its probabilities, as something you only partly know about, and all three at once.",
    simulatorIds: ["bloch-sphere", "complex-amplitude-explorer", "density-matrix-explorer", "compare-states-explorer"],
  },
  {
    id: "multi-qubit-entanglement",
    title: "Make two qubits affect each other",
    description:
      "Wire qubits together, entangle them, and measure one to see what happens to the other — up to the experiment that proved no ordinary explanation can account for it.",
    simulatorIds: ["two-qubit-explorer", "circuit-builder", "chsh-bell-test"],
  },
  {
    id: "dynamics-and-noise",
    title: "Watch a state change over time",
    description:
      "Press play. A qubit being flipped by a control pulse, a qubit quietly losing its information to the environment, and a particle spreading out and tunnelling through a wall.",
    simulatorIds: ["rabi-explorer", "noise-explorer", "wavefunction-explorer"],
  },
  {
    id: "algorithms",
    title: "Run an algorithm and watch it work",
    description:
      "The three quantum algorithms people actually name — search, factoring, optimization — running step by step, with the numbers computed rather than illustrated.",
    simulatorIds: ["grover-explorer", "period-finding-explorer", "qaoa-explorer"],
  },
  {
    id: "error-correction",
    title: "Break a qubit and fix it",
    description:
      "Inject a real error and watch it get found and repaired without the encoded information ever being looked at.",
    simulatorIds: ["syndrome-explorer"],
  },
];

function entry(id: string): SimulatorEntry {
  const found = SIMULATOR_INDEX.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown simulator id: ${id}`);
  return found;
}

/**
 * One instrument's mount: the pillar-tinted header every simulator on the
 * bench gets (what it demonstrates, why to open it) above the simulator
 * itself. `data-pillar` here is a plain HTML attribute — no client JS needed
 * to retint the subtree, same trick `PillarScope` uses elsewhere.
 */
function SimulatorMount({ id, children }: { id: string; children: ReactNode }) {
  const sim = entry(id);
  const visual = pillarVisual(sim.pillar);
  const level = LEVEL_COPY[sim.level];

  return (
    <div data-pillar={sim.pillar} id={id} className="scroll-mt-24">
      <Eyebrow className="text-pillar">
        <Link href={visual.route} className="hover:underline focus-visible:underline">
          {visual.short}
        </Link>
      </Eyebrow>
      <SectionTitle level={3} size="sm" className="mt-1">
        {sim.label}
      </SectionTitle>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{sim.physics}</p>
      <p className="mt-1 max-w-2xl text-sm text-pillar-text">{sim.why}</p>
      <p className="mt-3 max-w-2xl text-xs text-subtle-foreground">
        <span className="font-medium text-muted-foreground">{level.label}.</span> {level.blurb}
        {sim.lesson ? (
          <>
            {" "}
            <Link
              href={sim.lesson.href}
              className="whitespace-nowrap text-pillar-text underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              {sim.lesson.title} →
            </Link>
          </>
        ) : null}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Renders the actual instrument for one simulator id. A plain lookup rather
 *  than a data-driven component map, since the error-correction entry needs
 *  a genuinely different (two-column) layout than every other instrument. */
function SimulatorInstrumentBody({ id }: { id: string }) {
  switch (id) {
    case "bloch-sphere":
      return <LazyBlochSphereExplorer />;
    case "complex-amplitude-explorer":
      return <LazyComplexAmplitudeExplorer />;
    case "density-matrix-explorer":
      return <LazyDensityMatrixExplorer />;
    case "compare-states-explorer":
      return <LazyCompareStatesExplorer />;
    case "two-qubit-explorer":
      return <LazyTwoQubitExplorer />;
    case "circuit-builder":
      return <LazyCircuitBuilder />;
    case "chsh-bell-test":
      return <LazyCHSHBellTestExplorer />;
    case "rabi-explorer":
      return <LazyRabiExplorer />;
    case "noise-explorer":
      return <LazyNoiseExplorer />;
    case "wavefunction-explorer":
      return <LazyWavefunctionExplorer />;
    case "grover-explorer":
      return <LazyGroverExplorer />;
    case "period-finding-explorer":
      return <LazyPeriodFindingExplorer />;
    case "qaoa-explorer":
      return <LazyQAOAExplorer />;
    case "syndrome-explorer":
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <TechLabel>Bit-flip code</TechLabel>
            <div className="mt-3">
              <LazySyndromeExplorer mode="bit-flip" />
            </div>
          </div>
          <div>
            <TechLabel>Phase-flip code</TechLabel>
            <div className="mt-3">
              <LazySyndromeExplorer mode="phase-flip" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

/**
 * The bench directory: a real `.instrument` panel whose jump-links are
 * grouped under the same five headings the page body uses, instead of one
 * flat bag of 14 pills — so the nav reads as a map of the page, not a list
 * of buttons.
 */
function SimulatorNav() {
  return (
    <nav aria-label="Jump to simulator">
      <Instrument className="mt-10" label="Bench directory — jump to an instrument">
        <div className="space-y-6">
          {SIMULATOR_GROUPS.map((group) => (
            <div key={group.id}>
              <TechLabel className="text-subtle-foreground">{group.title}</TechLabel>
              {/* Each entry is one anchor wrapping its whole card — title,
                  one-line description and level badge are all inside the same
                  link, so there is no "which bit do I click" moment and no
                  separate Open affordance to hunt for. `grid` rather than
                  `flex-wrap` so the cards line up at every width, single
                  column at 320px. */}
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.simulatorIds.map((id) => {
                  const sim = entry(id);
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      data-pillar={sim.pillar}
                      // Name it with the instrument, not with the instrument
                      // plus its physics sentence plus its level chip — four
                      // of these cards computed an accessible name over 170
                      // characters, which is a paragraph read aloud before the
                      // reader learns which simulator the link goes to. The
                      // description and level stay visible; they are context,
                      // not the name.
                      aria-label={sim.label}
                      className="flex min-h-11 flex-col gap-1 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-pillar-edge hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-pillar" />
                        {sim.label}
                      </span>
                      <span className="text-xs leading-relaxed text-muted-foreground">{sim.physics}</span>
                      <span className="mt-auto pt-1 text-[11px] uppercase tracking-wide text-subtle-foreground">
                        {LEVEL_COPY[sim.level].label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Instrument>
    </nav>
  );
}

export default function SimulatorsPage() {
  const pillarsCovered = new Set(SIMULATOR_INDEX.map((sim) => sim.pillar)).size;

  return (
    <PillarScope regime="atlas">
      <Section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <Eyebrow>Simulators</Eyebrow>
        <SectionTitle level={1} size="xl" className="mt-3 max-w-3xl">
          The instrument bench
        </SectionTitle>
        <Lede className="mt-4 max-w-[46rem]">
          Fourteen live instruments, not scripted animations — every number you see is computed by
          the platform&rsquo;s own tested quantum engine, from single-qubit basics through
          algorithms and error correction. Every control says in plain words what it does, so you can
          start turning knobs before you know the vocabulary.
        </Lede>

        <Readouts
          className="mt-8"
          items={[
            { label: "Instruments", value: SIMULATOR_INDEX.length },
            { label: "Groups", value: SIMULATOR_GROUPS.length },
            { label: "Areas covered", value: pillarsCovered },
          ]}
        />

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button href="#bloch-sphere" size="lg">
            Try the first one: Bloch Sphere Explorer →
          </Button>
          <p className="max-w-sm text-xs leading-relaxed text-subtle-foreground">
            No account, no lesson to finish first — every instrument below runs the instant you
            scroll to it. The five groups run easiest to hardest, and each instrument says up front
            whether it assumes anything, linking the lesson if it does.
          </p>
        </div>

        <SimulatorNav />

        <div className="mt-14 space-y-20">
          {SIMULATOR_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <SectionTitle level={2} size="md">
                {group.title}
              </SectionTitle>
              <p className="mt-2 max-w-2xl text-muted-foreground">{group.description}</p>

              <div className="mt-8 space-y-16">
                {group.simulatorIds.map((id) => (
                  <SimulatorMount key={id} id={id}>
                    <SimulatorInstrumentBody id={id} />
                  </SimulatorMount>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </PillarScope>
  );
}
