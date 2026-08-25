import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const FEATURED_SIMULATORS = [
  {
    title: "Bloch sphere explorer",
    description: "Rotate a single qubit's state in real time and watch how gates move it across the sphere.",
    tag: "Qubits",
    id: "bloch-sphere",
  },
  {
    title: "Wavefunction explorer",
    description: "A real 1D numerical simulator — an actual FFT and split-operator time evolution — for watching wave packets disperse and tunnel through barriers.",
    tag: "Wave mechanics",
    id: "wavefunction-explorer",
  },
  {
    title: "Rabi / qubit dynamics explorer",
    description: "Drive a two-level system and watch population oscillate exactly, via direct numerical integration of the Schrödinger equation.",
    tag: "Dynamics",
    id: "rabi-explorer",
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
              10 interactive tools for manipulating quantum states directly, each backed by
              this platform&rsquo;s own tested quantum engine, not a scripted animation.
            </p>
          </div>
          <Button href="/simulators" variant="secondary" className="self-start sm:self-auto">
            See all simulators
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURED_SIMULATORS.map((sim) => (
            <Link key={sim.title} href={`/simulators#${sim.id}`} className="block">
              <Card className="flex h-full flex-col gap-3 transition-colors hover:border-brand/40">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{sim.title}</h3>
                  <Badge>{sim.tag}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{sim.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
