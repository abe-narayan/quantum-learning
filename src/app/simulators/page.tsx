import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export const metadata: Metadata = {
  title: "Simulators",
  description: "Interactive quantum simulators for building intuition about qubits and circuits.",
};

const SIMULATORS = [
  {
    title: "Bloch sphere explorer",
    description: "Rotate and manipulate a single qubit's state on the Bloch sphere in real time.",
    tag: "Coming soon",
  },
  {
    title: "Circuit builder",
    description: "Drag and drop gates onto a circuit and watch the resulting state evolve.",
    tag: "Coming soon",
  },
  {
    title: "Entanglement visualizer",
    description: "See how measuring one qubit of an entangled pair affects the other.",
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
        description="Hands-on tools for building real intuition about quantum states — these are in development."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SIMULATORS.map((sim) => (
          <PlaceholderCard
            key={sim.title}
            title={sim.title}
            description={sim.description}
            tag={sim.tag}
          />
        ))}
      </div>
    </Container>
  );
}
