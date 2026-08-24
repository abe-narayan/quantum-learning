import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    title: "Read a lesson",
    description: "Rigorous math, not hand-waved — every result is derived, not just asserted.",
  },
  {
    title: "Touch the simulator embedded in it",
    description: "The same real quantum engines that power /simulators, not a canned animation.",
  },
  {
    title: "Prove you understood it",
    description: "A graded problem tied directly to that lesson, with progressive hints and a worked solution.",
  },
];

/**
 * Replaces the old standalone Philosophy section: keeps its line as a
 * kicker, then makes the claim concrete with a 3-step flow reusing
 * LearningJourney's numbered-circle-and-connector treatment for visual
 * consistency across the page.
 */
export function HowItWorks() {
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

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-brand via-accent to-brand/20 md:block"
          />
          <ol className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center">
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
