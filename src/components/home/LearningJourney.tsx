import { Container } from "@/components/ui/Container";
import { JOURNEY_STEPS } from "@/lib/journey";

export function LearningJourney() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            The learning journey
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            From a single qubit to real algorithms
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each stage builds directly on the last — the math, the physics, and
            the intuition all move together.
          </p>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-brand via-accent to-brand/20 md:block"
          />
          <ol className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
            {JOURNEY_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-surface text-sm font-semibold text-brand ring-4 ring-background">
                  {index + 1}
                </span>
                <div className="md:mt-4">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
