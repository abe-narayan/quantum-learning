import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";
import { DailyPuzzle } from "@/components/home/DailyPuzzle";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";

const PILLAR = "quantum-software" as const;

const PIPELINE = [
  {
    title: "Write the circuit",
    description: "Circuits as data before you ever run them, the same build-then-run model real SDKs use.",
  },
  {
    title: "Compile & optimize",
    description: "An abstract circuit turned into something real hardware, or a state-vector simulator, can actually run.",
  },
  {
    title: "Run, then verify",
    description: "Simulated noise acting on a live qubit, and a graded problem to prove you understood what happened.",
  },
];

/**
 * Track 4 of 6, the fourth stop in the field's `journey` crossfade, where the
 * environment becomes `graph` (circuit rails executing). Composition: a
 * timeline across the top for the compile/run pipeline this track actually
 * teaches, then a split pairing the case for practice with a live instance of
 * it, today's problem, rather than a static "view all problems" card grid.
 */
export function SoftwareSection() {
  const totalProblems = getAllProblemMeta().length;

  return (
    <PillarBand pillar={PILLAR}>
      <Section width="wide" aria-labelledby="software-heading">
        <Reveal>
          <Eyebrow>04 · Quantum Software</Eyebrow>
          <SectionTitle id="software-heading" level={3} className="mt-3" size="lg">
            The layer between your code and a real qubit
          </SectionTitle>
          {/* "State-vector engine" and "hybrid quantum-classical loop" are
              both glossed in plain speech at first use rather than dropped:
              the doubling list of numbers IS the concept, and naming it
              without saying what it is would be jargon for jargon's sake. */}
          <Lede className="mt-4 max-w-2xl">
            Every simulator on this site runs on a state-vector engine: a program that tracks
            a quantum state as one long list of numbers, a list that doubles with each qubit
            you add. This track covers that engine, the wall the doubling builds around
            30&ndash;50 qubits, and the compilation and hybrid quantum-classical loops (your
            classical code and a quantum processor taking turns) that turn an abstract
            circuit into something real hardware can run.
          </Lede>
        </Reveal>

        <div className="relative mx-auto mt-10 max-w-4xl">
          <div
            aria-hidden="true"
            data-decorative=""
            className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-pillar via-pillar-dim to-transparent md:block"
          />
          <ol className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-6">
            {PIPELINE.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 90} className="flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pillar-edge bg-surface font-tech text-sm font-semibold text-pillar ring-4 ring-background">
                  {index + 1}
                </span>
                <div className="md:mt-4">
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-12 border-t border-border pt-10">
          <SplitFigure
            align="start"
            text={
              <div>
                <Reveal>
                  <h4 className="font-display text-xl font-semibold text-foreground">
                    Find out what you understood
                  </h4>
                  {/* Deliberately *not* a second description of the problem
                      corpus. `SiteContents`, in the orientation layer, already
                      catalogues it (how many, filterable by what) and used to
                      say almost word for word what this paragraph said about
                      exact grading and multiple choice. This one is about the
                      act, what happens to you when you get one wrong; that one
                      is about the shelf. Same destination, two different
                      reasons to go. */}
                  <p className="mt-3 text-muted-foreground">
                    {totalProblems} problems, every one of them attached to the single lesson it
                    tests. Hints arrive one at a time, so a problem you are stuck on hands you the
                    next step and not the answer. The worked solution sits behind them. Submit as
                    often as you like: nothing is scored, and nothing is recorded against you.
                  </p>
                  <Link
                    href="/problems"
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-pillar hover:underline"
                  >
                    Browse the problem set →
                  </Link>
                </Reveal>

                <PillarFooter pillar={PILLAR} />
              </div>
            }
            figure={
              <Reveal y={18} delay={80}>
                <DailyPuzzle headingLevel="h4" />
              </Reveal>
            }
          />
        </div>
      </Section>
    </PillarBand>
  );
}
