import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/registry";
import { PILLARS } from "@/lib/content/curriculum";

/**
 * 14 named tools on /simulators, plus the concept map and the density-matrix
 * pillar's dedicated three-component mixture explorer — no single registry
 * exports a live count today, so this is hand-counted rather than derived.
 * Every other readout below (lessons, problems, pillars) comes straight from
 * the same data the rest of the site reads.
 */
const SIMULATOR_COUNT = "16+";

/**
 * The homepage opener. Leads with a real, manipulable phenomenon — a live
 * split-operator wavefunction simulation, the same engine every Wave
 * Mechanics lesson uses — rather than a headline describing one. The
 * headline and CTAs sit beside it, not above it, so the first thing a
 * visitor's eye can *do* something with is the physics, not the copy.
 *
 * Async because it reads the real curriculum counts (lessons, problems,
 * pillars) for the readout strip instead of hard-coding them — the same
 * pattern `ContinueLearning` already uses one level down.
 */
export async function Hero() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        data-decorative=""
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.32] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] grid-paper"
      />

      <Section width="wide">
        <SplitFigure
          reverse
          text={
            <div>
              <Eyebrow>QuantumLearn — a research console</Eyebrow>
              <SectionTitle level={1} size="xl" className="mt-4">
                This is a live quantum simulation. Not a diagram of one.
              </SectionTitle>
              <Lede className="mt-5">
                Switch presets on the live simulation and watch a real wave packet — solved in
                your browser by the same split-operator engine behind every Wave Mechanics
                lesson — disperse, interfere with itself, and tunnel through a barrier it has
                no classical business crossing.
              </Lede>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/learn" size="lg">
                  Start learning
                </Button>
                <Button href="/simulators" size="lg" variant="secondary">
                  Explore simulators
                </Button>
              </div>
              <ContinueLearning />
            </div>
          }
          figure={
            <Reveal y={18}>
              <Instrument
                bodyClassName="p-0"
                footnote="Real-time split-operator time evolution — an actual FFT, not a canned animation."
              >
                <LazyWavefunctionHeroExplorer />
              </Instrument>
            </Reveal>
          }
        />

        <Reveal y={12} delay={80} className="mt-16 border-t border-border pt-8">
          <Readouts
            items={[
              { label: "Lessons", value: lessons.length },
              { label: "Problems", value: problemCount },
              { label: "Simulators", value: SIMULATOR_COUNT },
              { label: "Pillars", value: PILLARS.length, unit: "→ Apex" },
            ]}
          />
        </Reveal>
      </Section>
    </section>
  );
}
