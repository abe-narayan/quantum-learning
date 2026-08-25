import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
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

const SIMULATOR_INDEX: { id: string; label: string }[] = [
  { id: "bloch-sphere", label: "Bloch Sphere Explorer" },
  { id: "complex-amplitude-explorer", label: "Complex Plane & Amplitude Explorer" },
  { id: "density-matrix-explorer", label: "Density Matrix Explorer" },
  { id: "compare-states-explorer", label: "Cross-Simulator Comparison" },
  { id: "two-qubit-explorer", label: "2-Qubit State Explorer" },
  { id: "circuit-builder", label: "Circuit Builder" },
  { id: "chsh-bell-test", label: "CHSH Bell Test" },
  { id: "rabi-explorer", label: "Rabi / Qubit Dynamics Explorer" },
  { id: "noise-explorer", label: "Noise & Decoherence Explorer" },
  { id: "wavefunction-explorer", label: "Wavefunction Explorer" },
  { id: "grover-explorer", label: "Grover's Algorithm Explorer" },
  { id: "period-finding-explorer", label: "Period-Finding Explorer" },
  { id: "qaoa-explorer", label: "Max-Cut QAOA Explorer" },
  { id: "syndrome-explorer", label: "Syndrome Explorer" },
];

export default function SimulatorsPage() {
  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Simulators"
        title="Interactive simulators"
        description="Hands-on tools for building real intuition about quantum states, grouped from single-qubit basics through algorithms and error correction."
      />

      <nav aria-label="Jump to simulator" className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold text-foreground">Jump to a simulator</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SIMULATOR_INDEX.map((sim) => (
            <a
              key={sim.id}
              href={`#${sim.id}`}
              className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >
              {sim.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-14 space-y-20">
        <section id="single-qubit-fundamentals" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Single-Qubit Fundamentals</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            How one qubit&rsquo;s state, its statistical description, and its decay all relate to the same sphere.
          </p>

          <div className="mt-8 space-y-16">
            <section id="bloch-sphere" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Bloch Sphere Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Rotate and manipulate a single qubit&rsquo;s state on the Bloch sphere in real time — apply gates,
                watch the state vector move, and measure.
              </p>
              <div className="mt-6">
                <LazyBlochSphereExplorer />
              </div>
            </section>

            <section id="complex-amplitude-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Complex Plane &amp; Amplitude Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Manipulate a complex amplitude directly — real part, imaginary part, magnitude, and phase — and
                see how they relate to probability. Switch to two-amplitude mode to watch relative phase drive
                real interference.
              </p>
              <div className="mt-6">
                <LazyComplexAmplitudeExplorer />
              </div>
            </section>

            <section id="density-matrix-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Density Matrix Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Build a single-qubit density matrix live from two mixed-in pure states and watch it move on the
                Bloch sphere — pure states sit exactly on the surface, and every real mixture pulls the point
                strictly inside, by exactly the amount purity and von Neumann entropy predict.
              </p>
              <div className="mt-6">
                <LazyDensityMatrixExplorer />
              </div>
            </section>

            <section id="compare-states-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Cross-Simulator Comparison</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                One real qubit state, one set of shared controls, and three of this page&rsquo;s own rendering
                lenses side by side — the Bloch sphere, the complex amplitude plane, and the probability bar
                chart — so you can see directly that they&rsquo;re all the same number.
              </p>
              <div className="mt-6">
                <LazyCompareStatesExplorer />
              </div>
            </section>
          </div>
        </section>

        <section id="multi-qubit-entanglement" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Multi-Qubit &amp; Entanglement</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Building and reading out states that involve more than one qubit at once.
          </p>

          <div className="mt-8 space-y-16">
            <section id="two-qubit-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">2-Qubit State Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Prepare two-qubit states, apply gates and CNOT, and see entanglement, measurement, and correlation
                play out with real quantum math.
              </p>
              <div className="mt-6">
                <LazyTwoQubitExplorer />
              </div>
            </section>

            <section id="circuit-builder" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Circuit Builder</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Build a real circuit gate by gate on 2 or 3 qubits, then step through it to watch the state vector
                evolve at every stage. The same build-then-run model real quantum SDKs use.
              </p>
              <div className="mt-6">
                <LazyCircuitBuilder />
              </div>
            </section>

            <section id="chsh-bell-test" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">CHSH Bell Test</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Pick four measurement angles on a shared entangled pair and watch the real computed CHSH value S
                update live — cross the classical bound of 2, and you&rsquo;ve just recreated the experiment that
                ruled out local hidden variables.
              </p>
              <div className="mt-6">
                <LazyCHSHBellTestExplorer />
              </div>
            </section>
          </div>
        </section>

        <section id="dynamics-and-noise" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Dynamics &amp; Noise</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            How quantum states evolve continuously in time — driven, decaying, or freely propagating.
          </p>

          <div className="mt-8 space-y-16">
            <section id="rabi-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Rabi / Qubit Dynamics Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Drive a two-level system and watch population oscillate between the ground and excited state, exactly
                (via direct numerical integration of the Schrödinger equation), both as a P(1) curve over time and as
                a genuine Bloch-sphere trajectory. Detune the drive and watch the maximum transferable population
                drop below 1, following 4V²/(Δ²+4V²) exactly.
              </p>
              <div className="mt-6">
                <LazyRabiExplorer />
              </div>
            </section>

            <section id="noise-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Noise &amp; Decoherence Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Apply a real Kraus-operator noise channel (amplitude damping or dephasing) to a qubit step by step and
                watch its Bloch vector shrink from the sphere&rsquo;s surface toward the channel&rsquo;s fixed point,
                with purity and entropy updating live from the platform&rsquo;s tested open-systems engine.
              </p>
              <div className="mt-6">
                <LazyNoiseExplorer />
              </div>
            </section>

            <section id="wavefunction-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Wavefunction Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                A real 1D numerical wavefunction simulator — position and momentum grids, an actual FFT, and
                genuine time evolution via the split-operator method. Watch wave packets disperse, energy
                eigenstates stay stationary, superpositions beat, and particles tunnel through barriers.
              </p>
              <div className="mt-6">
                <LazyWavefunctionExplorer />
              </div>
            </section>
          </div>
        </section>

        <section id="algorithms" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Algorithms</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The quantum subroutines behind real speedups over classical search and optimization.
          </p>

          <div className="mt-8 space-y-16">
            <section id="grover-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Grover&rsquo;s Algorithm Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Step through Grover&rsquo;s algorithm one oracle-and-diffusion iteration at a time and watch the
                marked state&rsquo;s amplitude grow, using the platform&rsquo;s real, tested Grover engine, not a
                scripted animation.
              </p>
              <div className="mt-6">
                <LazyGroverExplorer />
              </div>
            </section>

            <section id="period-finding-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Period-Finding Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Pick any small composite N, any base a coprime to it, and any number of counting qubits, then watch the
                platform&rsquo;s real period-finding engine (the same QFT-based mechanism behind Shor&rsquo;s algorithm)
                compute the actual measurement distribution and its peak spacing, not just the one fixed a=7, N=15
                example shown inside the lessons.
              </p>
              <div className="mt-6">
                <LazyPeriodFindingExplorer />
              </div>
            </section>

            <section id="qaoa-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Max-Cut QAOA Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Drag the cost angle γ and mixer angle β across a real p=1 QAOA circuit on a few small graphs, and watch
                the genuinely computed expected cut size chase (or miss) the real brute-force optimum live, generalizing
                the QAOA lessons&rsquo; own grid-searched, single-graph worked examples into something you can explore
                yourself.
              </p>
              <div className="mt-6">
                <LazyQAOAExplorer />
              </div>
            </section>
          </div>
        </section>

        <section id="error-correction" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Error Correction</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Detecting and correcting errors without disturbing the encoded information.
          </p>

          <div className="mt-8 space-y-16">
            <section id="syndrome-explorer" className="scroll-mt-24">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Syndrome Explorer</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Inject a real X or Z error into a 3-qubit repetition code and watch the platform&rsquo;s actual
                error-correction engine extract the syndrome via genuine ancilla CNOTs and partial measurement,
                decode it, and apply the correction — the bit-flip code and its phase-flip dual, both live.
              </p>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Bit-flip code</h4>
                  <div className="mt-3">
                    <LazySyndromeExplorer mode="bit-flip" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Phase-flip code</h4>
                  <div className="mt-3">
                    <LazySyndromeExplorer mode="phase-flip" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </Container>
  );
}
