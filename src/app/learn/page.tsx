import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Learn",
  description: "The recommended path through QuantumLearn, from qubits to algorithms.",
};

const PATH_STEPS = [
  {
    title: "Foundations",
    description:
      "Complex numbers, linear algebra, and the postulates of quantum mechanics you need before touching a qubit.",
    status: "Coming soon",
  },
  {
    title: "Qubits & gates",
    description:
      "Single- and multi-qubit states, superposition, entanglement, and the gates that manipulate them.",
    status: "Coming soon",
  },
  {
    title: "Circuits & algorithms",
    description:
      "Building real circuits — from Deutsch–Jozsa to Grover's algorithm — and understanding why they work.",
    status: "Coming soon",
  },
  {
    title: "Practice & mastery",
    description:
      "Problem sets and simulator-based exercises to solidify intuition before moving to the next topic.",
    status: "Coming soon",
  },
];

export default function LearnPage() {
  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Learn"
        title="Your path through quantum computing"
        description="A structured route from first principles to real algorithms, combining lessons, simulators, and problem sets at each step."
      />

      <div className="mt-12 space-y-4">
        {PATH_STEPS.map((step, index) => (
          <Card key={step.title} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-foreground">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <Badge>{step.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/lessons">Browse lessons</Button>
        <Button href="/simulators" variant="secondary">
          Try the simulators
        </Button>
      </div>
    </Container>
  );
}
