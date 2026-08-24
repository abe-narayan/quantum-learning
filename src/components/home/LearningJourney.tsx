import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { JOURNEY_TRACKS } from "@/lib/journey";

export function LearningJourney() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            The learning journey
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Two tracks, one foundation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every path starts from the same math. From there, quantum mechanics
            and quantum computing branch into their own sequences — take
            either one, or both. See the{" "}
            <Link href="/learn" className="text-brand hover:underline">
              full curriculum
            </Link>
            .
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {JOURNEY_TRACKS.map((track) => (
            <div key={track.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {track.label}
              </h3>
              <div className="relative mt-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-brand via-accent to-brand/20 md:block"
                />
                <ol className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
                  {track.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center"
                    >
                      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-surface text-sm font-semibold text-brand ring-4 ring-background">
                        {index + 1}
                      </span>
                      <div className="md:mt-4">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
