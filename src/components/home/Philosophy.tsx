import { Container } from "@/components/ui/Container";

export function Philosophy() {
  return (
    <section className="border-y border-border bg-surface-muted/60 py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Learn the math. See the physics.{" "}
            <span className="text-brand">Experiment with the system.</span>
          </p>
          <p className="mt-4 text-muted-foreground">
            Every concept here is grounded in rigorous mathematics, made
            tangible through physical intuition, and reinforced by direct
            interaction — so understanding is built, not memorized.
          </p>
        </div>
      </Container>
    </section>
  );
}
