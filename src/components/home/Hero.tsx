import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BlochSpherePreview } from "@/components/simulators/bloch-sphere/BlochSpherePreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--brand) 22%, transparent), transparent 55%), radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 50%), linear-gradient(var(--surface-muted), var(--background))",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="grid gap-16 py-24 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-32">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">QuantumLearn</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Learn quantum computing by experimenting with it.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Manipulate real qubit states, watch superposition and entanglement
            unfold, and build the intuition no textbook alone can teach —
            grounded in the math and physics that make it rigorous.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/learn" size="lg">
              Start learning
            </Button>
            <Button href="/simulators" size="lg" variant="secondary">
              Explore simulators
            </Button>
          </div>
        </div>

        <BlochSpherePreview />
      </Container>
    </section>
  );
}
