import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { LazyBlochSphereExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereExplorer";
import { LazyTwoQubitExplorer } from "@/components/simulators/two-qubit-explorer/LazyTwoQubitExplorer";
import { LazyComplexAmplitudeExplorer } from "@/components/simulators/complex-amplitude-explorer/LazyComplexAmplitudeExplorer";
import { LazyWavefunctionExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionExplorer";
import { LazyDensityMatrixExplorer } from "@/components/simulators/density-matrix-explorer/LazyDensityMatrixExplorer";

export const metadata: Metadata = {
  title: "Simulators",
  description: "Interactive quantum simulators for building intuition about qubits and circuits.",
};

const COMING_SOON_SIMULATORS = [
  {
    title: "Circuit builder",
    description: "Drag and drop gates onto a circuit and watch the resulting state evolve.",
    tag: "Coming soon",
  },
  {
    title: "Interference playground",
    description: "Explore how amplitude interference powers algorithms like Grover's.",
    tag: "Coming soon",
  },
];

export default function SimulatorsPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Simulators"
        title="Interactive simulators"
        description="Hands-on tools for building real intuition about quantum states."
      />

      <div className="mt-14 space-y-16">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Bloch Sphere Explorer</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Rotate and manipulate a single qubit&rsquo;s state on the Bloch sphere in real time — apply gates,
            watch the state vector move, and measure.
          </p>
          <div className="mt-6">
            <LazyBlochSphereExplorer />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">2-Qubit State Explorer</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Prepare two-qubit states, apply gates and CNOT, and see entanglement, measurement, and correlation
            play out with real quantum math.
          </p>
          <div className="mt-6">
            <LazyTwoQubitExplorer />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Complex Plane &amp; Amplitude Explorer</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manipulate a complex amplitude directly — real part, imaginary part, magnitude, and phase — and
            see how they relate to probability. Switch to two-amplitude mode to watch relative phase drive
            real interference.
          </p>
          <div className="mt-6">
            <LazyComplexAmplitudeExplorer />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Wavefunction Explorer</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A real 1D numerical wavefunction simulator — position and momentum grids, an actual FFT, and
            genuine time evolution via the split-operator method. Watch wave packets disperse, energy
            eigenstates stay stationary, superpositions beat, and particles tunnel through barriers.
          </p>
          <div className="mt-6">
            <LazyWavefunctionExplorer />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Density Matrix Explorer</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Build a single-qubit density matrix live from two mixed-in pure states and watch it move on the
            Bloch sphere — pure states sit exactly on the surface, and every real mixture pulls the point
            strictly inside, by exactly the amount purity and von Neumann entropy predict.
          </p>
          <div className="mt-6">
            <LazyDensityMatrixExplorer />
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">In development</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON_SIMULATORS.map((sim) => (
            <PlaceholderCard
              key={sim.title}
              title={sim.title}
              description={sim.description}
              tag={sim.tag}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
