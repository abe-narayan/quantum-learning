import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PREVIEW_SIMULATORS = [
  {
    title: "Bloch sphere explorer",
    description:
      "Rotate a single qubit's state in real time and watch how gates move it across the sphere.",
  },
  {
    title: "Circuit builder",
    description: "Assemble gates on a circuit and see the resulting state evolve step by step.",
  },
  {
    title: "Entanglement visualizer",
    description: "Measure one qubit of an entangled pair and watch the effect on the other.",
  },
];

export function SimulatorsPreview() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Simulators</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Build intuition by experimenting
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Interactive tools for manipulating quantum states directly —
              currently in development.
            </p>
          </div>
          <Button href="/simulators" variant="secondary" className="self-start sm:self-auto">
            See all simulators
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PREVIEW_SIMULATORS.map((sim) => (
            <Card key={sim.title} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">{sim.title}</h3>
                <Badge>Coming soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{sim.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
