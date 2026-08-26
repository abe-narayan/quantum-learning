import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Instrument } from "@/components/ui/Panel";
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
 */
type SimulatorEntry = {
  id: string;
  label: string;
  pillar: Pillar;
  physics: string;
  why: string;
};

const SIMULATOR_INDEX: SimulatorEntry[] = [
  {
    id: "bloch-sphere",
    label: "Bloch Sphere Explorer",
    pillar: "quantum-computing",
    physics: "Every single-qubit state as a point on a sphere — gates as rotations, measurement as a random snap to a pole.",
    why: "Rotate a real qubit by hand and watch superposition collapse the instant you measure it.",
  },
  {
    id: "complex-amplitude-explorer",
    label: "Complex Plane & Amplitude Explorer",
    pillar: "quantum-mechanics",
    physics: "An amplitude's real and imaginary parts, and how only its squared magnitude ever becomes a probability.",
    why: "See directly why global phase is invisible but relative phase drives real interference.",
  },
  {
    id: "density-matrix-explorer",
    label: "Density Matrix Explorer",
    pillar: "quantum-computing",
    physics: "A mixed state built live from two pure states, and how far impurity pulls the Bloch point inside the sphere.",
    why: "Watch purity and entropy update in real time as you dial in a genuine statistical mixture.",
  },
  {
    id: "compare-states-explorer",
    label: "Cross-Simulator Comparison",
    pillar: "quantum-computing",
    physics: "One qubit state, rendered simultaneously as a sphere point, a complex-plane pair, and a probability bar chart.",
    why: "Confirm for yourself that three very different-looking pictures are the same number.",
  },
  {
    id: "two-qubit-explorer",
    label: "2-Qubit State Explorer",
    pillar: "quantum-computing",
    physics: "Two-qubit states, CNOT, and the correlations that only appear once qubits are entangled.",
    why: "Measure one qubit of a Bell pair and watch the other's outcome become fixed, instantly.",
  },
  {
    id: "circuit-builder",
    label: "Circuit Builder",
    pillar: "quantum-software",
    physics: "The build-then-run circuit model real quantum SDKs use, gate by gate.",
    why: "Step backward and forward through your own circuit and watch exactly when entanglement appears.",
  },
  {
    id: "chsh-bell-test",
    label: "CHSH Bell Test",
    pillar: "quantum-computing",
    physics: "The CHSH statistic S, computed live from real measurement angles on a shared entangled pair.",
    why: "Push S past 2 and you've just recreated the experiment that ruled out local hidden variables.",
  },
  {
    id: "rabi-explorer",
    label: "Rabi / Qubit Dynamics Explorer",
    pillar: "quantum-hardware",
    physics: "Driven two-level population transfer, on and off resonance, from direct numerical integration.",
    why: "Detune the drive and watch the maximum transferable population fall below 1, exactly on formula.",
  },
  {
    id: "noise-explorer",
    label: "Noise & Decoherence Explorer",
    pillar: "quantum-hardware",
    physics: "A real Kraus-operator noise channel applied to a qubit step by step.",
    why: "Watch a pure state visibly decay toward a channel's fixed point — the same T1/T2 decay hardware engineers measure.",
  },
  {
    id: "wavefunction-explorer",
    label: "Wavefunction Explorer",
    pillar: "quantum-mechanics",
    physics: "A numerical solution of the time-dependent Schrödinger equation, via FFT and the split-operator method.",
    why: "Watch a wave packet disperse, an eigenstate sit frozen, and a particle tunnel through a barrier it classically couldn't cross.",
  },
  {
    id: "grover-explorer",
    label: "Grover's Algorithm Explorer",
    pillar: "quantum-computing",
    physics: "Amplitude amplification concentrating probability onto a marked item, iteration by iteration.",
    why: "Step past the optimal iteration count and watch success probability overshoot and fall back down.",
  },
  {
    id: "period-finding-explorer",
    label: "Period-Finding Explorer",
    pillar: "quantum-computing",
    physics: "The QFT-based period-finding subroutine behind Shor's algorithm, for any small N and base a.",
    why: "Freely explore the mechanism the lessons only ever show at one fixed worked example.",
  },
  {
    id: "qaoa-explorer",
    label: "Max-Cut QAOA Explorer",
    pillar: "quantum-computing",
    physics: "A p=1 QAOA circuit's expected cut size, tracked live against the brute-force optimum.",
    why: "Drag the cost and mixer angles yourself and see how close you can push toward the true best cut.",
  },
  {
    id: "syndrome-explorer",
    label: "Syndrome Explorer",
    pillar: "quantum-computing",
    physics: "Syndrome extraction and correction in the 3-qubit repetition code, via real ancilla CNOTs.",
    why: "Inject an error, predict which qubit the decoder will blame, then check — and see recovery break past weight one.",
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

const SIMULATOR_GROUPS: SimulatorGroup[] = [
  {
    id: "single-qubit-fundamentals",
    title: "Single-Qubit Fundamentals",
    description: "How one qubit’s state, its statistical description, and its decay all relate to the same sphere.",
    simulatorIds: ["bloch-sphere", "complex-amplitude-explorer", "density-matrix-explorer", "compare-states-explorer"],
  },
  {
    id: "multi-qubit-entanglement",
    title: "Multi-Qubit & Entanglement",
    description: "Building and reading out states that involve more than one qubit at once.",
    simulatorIds: ["two-qubit-explorer", "circuit-builder", "chsh-bell-test"],
  },
  {
    id: "dynamics-and-noise",
    title: "Dynamics & Noise",
    description: "How quantum states evolve continuously in time — driven, decaying, or freely propagating.",
    simulatorIds: ["rabi-explorer", "noise-explorer", "wavefunction-explorer"],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "The quantum subroutines behind real speedups over classical search and optimization.",
    simulatorIds: ["grover-explorer", "period-finding-explorer", "qaoa-explorer"],
  },
  {
    id: "error-correction",
    title: "Error Correction",
    description: "Detecting and correcting errors without disturbing the encoded information.",
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

  return (
    <div data-pillar={sim.pillar} id={id} className="scroll-mt-24">
      <Eyebrow className="text-pillar">{visual.short}</Eyebrow>
      <SectionTitle level={3} size="sm" className="mt-1">
        {sim.label}
      </SectionTitle>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{sim.physics}</p>
      <p className="mt-1 max-w-2xl text-sm text-pillar-text">{sim.why}</p>
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
        <div className="space-y-5">
          {SIMULATOR_GROUPS.map((group) => (
            <div key={group.id}>
              <TechLabel className="text-subtle-foreground">{group.title}</TechLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.simulatorIds.map((id) => {
                  const sim = entry(id);
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      data-pillar={sim.pillar}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-pillar-edge hover:text-foreground"
                    >
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-pillar" />
                      {sim.label}
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
          algorithms and error correction.
        </Lede>

        <Readouts
          className="mt-8"
          items={[
            { label: "Instruments", value: SIMULATOR_INDEX.length },
            { label: "Groups", value: SIMULATOR_GROUPS.length },
            { label: "Pillars covered", value: pillarsCovered },
          ]}
        />

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
