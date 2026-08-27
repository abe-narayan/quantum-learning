import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { DailyPuzzle } from "@/components/home/DailyPuzzle";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

const PILLAR = "quantum-software" as const;

const PIPELINE = [
  {
    title: "Write the circuit",
    description: "Circuits as data before you ever run them — the same build-then-run model real SDKs use.",
  },
  {
    title: "Compile & optimize",
    description: "An abstract circuit turned into something real hardware — or a state-vector simulator — can actually run.",
  },
  {
    title: "Run, then verify",
    description: "Simulated noise acting on a live qubit, and a graded problem to prove you understood what happened.",
  },
];

/**
 * Pillar 4 of 6 — where the field's `journey` crossfade is dominated by
 * `graph` (circuit rails executing). Composition: a timeline across the top
 * (the compile/run pipeline this pillar actually teaches), then a split
 * pairing the case for practice with a live instance of it — today's
 * problem — rather than a static "view all problems" card grid.
 */
export function SoftwareSection() {
  const courses = getCoursesByPillar(PILLAR);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const totalProblems = getAllProblemMeta().length;
  const visual = PILLAR_VISUALS[PILLAR];

  return (
    <PillarBand pillar={PILLAR}>
      <Section width="wide" aria-labelledby="software-heading">
        <Reveal>
          <Eyebrow>04 · Quantum Software</Eyebrow>
          <SectionTitle id="software-heading" className="mt-3" size="lg">
            The layer between your code and a real qubit
          </SectionTitle>
          <Lede className="mt-4 max-w-2xl">
            The state-vector engine underneath every simulator, the wall it hits around
            30&ndash;50 qubits, and the compilation and hybrid quantum-classical loops that turn
            an abstract circuit into something real hardware can run.
          </Lede>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div
            aria-hidden="true"
            data-decorative=""
            className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-pillar via-pillar-dim to-transparent md:block"
          />
          <ol className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-6">
            {PIPELINE.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 90} className="flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pillar-edge bg-surface font-tech text-sm font-semibold text-pillar ring-4 ring-background">
                  {index + 1}
                </span>
                <div className="md:mt-4">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-16 border-t border-border pt-14">
          <SplitFigure
            align="start"
            text={
              <div>
                <Reveal>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Test what you actually understand
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {totalProblems} practice problems across every course, each graded exactly
                    and tied to a specific lesson, with progressive hints and a worked
                    solution — not multiple choice standing in for understanding.
                  </p>
                  <Link
                    href="/problems"
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-pillar hover:underline"
                  >
                    View all problems →
                  </Link>
                </Reveal>

                <Reveal
                  delay={120}
                  className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6"
                >
                  <Readouts
                    items={[
                      { label: "Courses", value: courses.length },
                      { label: "Est. time", value: hours, unit: "hrs" },
                    ]}
                  />
                  <Link
                    href={visual.route}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-pillar hover:underline"
                  >
                    Enter {visual.short} →
                  </Link>
                </Reveal>

                <p className="mt-6 flex items-baseline gap-2">
                  <TechLabel>Field</TechLabel>
                  <span className="text-xs text-subtle-foreground">{visual.fieldCaption}</span>
                </p>
              </div>
            }
            figure={
              <Reveal y={18} delay={80}>
                <DailyPuzzle />
              </Reveal>
            }
          />
        </div>
      </Section>
    </PillarBand>
  );
}
