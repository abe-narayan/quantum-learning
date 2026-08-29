import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { CurriculumStrip } from "@/components/home/CurriculumStrip";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { PILLARS } from "@/lib/content/curriculum";
import { START_LEARNING_HREF, START_LEARNING_SLUG } from "@/lib/nav";

/**
 * 14 named tools on /simulators, plus the concept map and the density-matrix
 * pillar's dedicated three-component mixture explorer — no single registry
 * exports a live count today, so this is hand-counted rather than derived.
 * Every other readout below (lessons, problems, tracks) comes straight from
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
 * tracks) for the readout strip instead of hard-coding them — the same
 * pattern `ContinueLearning` already uses one level down.
 *
 * The readouts are followed by `CurriculumStrip` rather than left to stand
 * alone: a count of "6 Tracks" is only a figure until the six are named, and
 * naming them here is what stops the page's real contents from being
 * invisible until the visitor has scrolled past two full sections.
 *
 * The primary CTA goes to `START_LEARNING_HREF` — the same place the
 * Navbar's identical "Start learning" button goes — so the loudest control
 * on the page and the loudest control in the chrome keep one contract: same
 * label, same destination, a page that starts teaching. Browsing lives on
 * the secondary button, labeled as browsing.
 */
export async function Hero() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;
  // The reassurance line under "Start learning" used to read a hardcoded
  // "20 min" while the lesson it points at is authored at 30 — and
  // `estimatedMinutes` is recalibrated corpus-wide (course `estimatedHours`
  // now derives from it), so any constant here is guaranteed to drift again.
  // Read from the lesson `START_LEARNING_HREF` actually opens.
  const startLesson = lessons.find((lesson) => lesson.slug === START_LEARNING_SLUG);

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
                Switch presets and watch a real quantum wave spread out, interfere with
                itself, and pass through a barrier it has no classical business crossing.
                It is computed live in your browser, by the same simulation engine every
                Wave Mechanics lesson uses.
              </Lede>
              <p className="mt-4 text-muted-foreground">
                QuantumLearn teaches quantum mechanics and quantum computing from scratch.
                The first lesson assumes only school algebra.
              </p>
              <div className="mt-8 flex flex-wrap items-start gap-x-3 gap-y-4">
                <div className="flex flex-col gap-2">
                  <Button href={START_LEARNING_HREF} size="lg">
                    Start learning
                  </Button>
                  <span className="font-tech text-[0.6875rem] uppercase tracking-[0.12em] text-subtle-foreground">
                    First lesson{startLesson ? ` · ${startLesson.estimatedMinutes} min` : ""} · no
                    math background needed
                  </span>
                </div>
                <Button href="/learn" size="lg" variant="secondary">
                  Browse the curriculum
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
              { label: "Tracks", value: PILLARS.length, unit: "→ Apex" },
            ]}
          />
          <CurriculumStrip />
        </Reveal>
      </Section>
    </section>
  );
}
