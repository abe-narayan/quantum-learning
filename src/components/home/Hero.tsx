import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LazyWavefunctionHeroExplorer } from "@/components/simulators/wavefunction-explorer/LazyWavefunctionHeroExplorer";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { CURRICULUM_HOURS, PILLARS } from "@/lib/content/curriculum";
import { START_LEARNING_HREF, START_LEARNING_SLUG } from "@/lib/nav";
import { ENTRY_BAR } from "@/lib/entryBar";

/**
 * The homepage opener, and the page's one `h1`.
 *
 * Leads with a real, manipulable phenomenon (a live split-operator
 * wavefunction simulation, the same engine every Wave Mechanics lesson uses)
 * rather than a headline describing one. The headline and CTAs sit beside it,
 * not above it, so the first thing a visitor's eye can *do* something with is
 * the physics, not the copy.
 *
 * The heading itself has to survive being the only sentence some visitors
 * read, so it names the subject and the method in one line. The three
 * paragraphs under it answer, in order, the three questions a first-time
 * visitor has and cannot get from a title: what this is, whether they are
 * allowed to be here, and what the panel to the right actually is. That last
 * one is load-bearing. A moving graph on a homepage is assumed to be
 * decoration; saying plainly that it is a numerical solver, running now, in
 * their browser, is the difference between a visitor watching it and a visitor
 * touching it.
 *
 * Async because it reads the real curriculum counts (lessons, problems,
 * tracks) for the readout strip instead of hard-coding them, the same pattern
 * `ContinueLearning` already uses one level down.
 *
 * The primary CTA goes to `START_LEARNING_HREF`, the same place the Navbar's
 * identical "Start learning" button goes, so the loudest control on the page
 * and the loudest control in the chrome keep one contract: same label, same
 * destination, a page that starts teaching. Browsing lives on the secondary
 * button, labeled as browsing.
 *
 * The six tracks used to be named here, in a strip below the readouts. They
 * now open `HowItWorks`, one section down, where a reader who has just been
 * told what a lesson is can read a list of tracks as a route rather than as a
 * menu. The hero keeps the counts, because "how big is this" is a fair
 * question to answer in the first screen and one figure answers it.
 */
export async function Hero() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;
  // The reassurance line under "Start learning" used to read a hardcoded
  // "20 min" while the lesson it points at is authored at 30, and
  // `estimatedMinutes` is recalibrated corpus-wide (course `estimatedHours`
  // now derives from it), so any constant here is guaranteed to drift again.
  // Read from the lesson `START_LEARNING_HREF` actually opens.
  const startLesson = lessons.find((lesson) => lesson.slug === START_LEARNING_SLUG);
  // "How long is this going to take me" is one of the first four questions a
  // visitor has, and the page used to answer it only in fragments: the first
  // lesson's 30 minutes here, then a per-track hour count six times further
  // down, in `PillarFooter`. Nobody adds six numbers off a homepage. The whole
  // figure belongs in the same strip as the whole lesson count, and derived
  // from the same course data `PillarFooter` sums per track, so the total and
  // the parts cannot disagree.
  //
  // `CURRICULUM_HOURS` rather than the sum written out here: /learn and
  // /lessons each derived this same figure their own way and /lessons' came
  // out at 117 against this one's 118. See the constant's own note in
  // `lib/content/curriculum.ts` for which derivation won and why.

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
              <Eyebrow>StudyQuantum</Eyebrow>
              {/* `break-words` is a WCAG 1.4.4 fix, not typography. At 200%
                  text-only zoom this heading is 120px type in a 443px column,
                  where its longest word no longer fits one line; with the
                  default `overflow-wrap: normal` the word simply ran out past
                  the column, past the `Section` gutter, and into the
                  `overflow-hidden` on the `<section>` below, which clipped it
                  at the viewport edge — 1319px of content in a 1280px box.
                  `overflow-wrap: break-word` only ever acts on a word that
                  cannot fit its line at all, so nothing changes at any text
                  size the heading already fits, and at 200% the word wraps
                  instead of disappearing.

                  The section's `overflow-hidden` stays, and removing it would
                  not have fixed this anyway: it would have traded a clipped
                  word for a page that scrolls sideways, which 1.4.4 counts as
                  the same loss. It also earns its place, because `[data-reveal]`
                  opens at `translate3d(0, var(--reveal-y), 0)` and both
                  `Reveal`s in this section sit at the bottom of it, so the
                  untrimmed section is 12 to 18px taller until they land. */}
              <SectionTitle level={1} size="xl" className="mt-4 break-words">
                Quantum mechanics, taught on instruments you can drive.
              </SectionTitle>
              <Lede className="mt-5">
                A complete course in quantum mechanics and quantum computing, free, from school
                algebra to the point where research papers stop being opaque. Every idea arrives
                with the equipment to test it.
              </Lede>
              {/* "beside" was written for the `lg` layout and is only true
                  there. `SplitFigure` collapses to one column below `lg` with
                  the figure second, so on a phone the panel is not beside this
                  text, it is about 400px below it and off-screen: the
                  paragraph pointed at something the reader could not see and
                  had not been told to scroll for. The word is the only part
                  that depends on the layout, so the word is what varies with
                  it. `hidden`/`lg:hidden` rather than a neutral rewrite
                  because a direction is what makes the sentence do its job —
                  it is an instruction to go and touch the thing. */}
              <p className="mt-4 max-w-lede text-muted-foreground">
                The panel <span className="lg:hidden">further down this screen</span>
                <span className="hidden lg:inline">beside this text</span> is not an illustration.
                It is a numerical solver integrating the Schrödinger equation in your browser,
                right now, with the same code the Wave Mechanics lessons teach from. Change the
                preset and the physics changes with it.
              </p>
              {/* The site's one statement of what it assumes, from
                  `lib/entryBar.ts`. It used to be written out here and, in six
                  other wordings, on /learn, /about, the footer, the tier
                  ladder and the homepage's own "two ways in" panel — two of
                  which were false. One string now, so a reader who reads the
                  claim twice reads the same claim twice. */}
              <p className="mt-4 max-w-lede text-muted-foreground">{ENTRY_BAR}</p>
              <div className="mt-8 flex flex-wrap items-start gap-x-3 gap-y-4">
                <div className="flex flex-col gap-2">
                  <Button href={START_LEARNING_HREF} size="lg">
                    Start learning
                  </Button>
                  {/* Not "no math background needed", which `ENTRY_BAR` two
                      lines above contradicts on the same screen. The lesson's
                      own `prerequisites` array is empty, so "no
                      prerequisites" is the claim the data supports, and it is
                      a claim about the curriculum rather than about the
                      reader. */}
                  <span className="tech-label text-subtle-foreground">
                    First lesson{startLesson ? ` · ${startLesson.estimatedMinutes} min` : ""} · no
                    prerequisites
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
              {/* There is no `bodyClassName="p-0"` here any more, and taking
                  it off changed nothing on screen, because it had never
                  applied. `cn()` is a plain join with no tailwind-merge, so
                  `p-0` landed beside the body's own `p-4 sm:p-5` and
                  stylesheet order decided the winner. Compiled through this
                  project's own `@tailwindcss/postcss`, `.p-0` is emitted
                  before `.p-4`, and `.sm\:p-5` sits in the `sm` variant block
                  far below both, so the body has carried 16px under 640px and
                  20px above it at every width this page has ever been served
                  at. Same class of dead override as the `max-w-*` note in
                  ui/Typography.tsx.
                  Left off rather than made to work. `WavefunctionHeroExplorer`
                  renders its own `rounded-panel border border-border ... p-6
                  sm:p-8` root, so a genuinely flush body would butt that
                  panel's hairline against `.instrument`'s at the identical
                  radius and draw `.instrument::after`'s corner ticks over the
                  top of it. The frame worth removing is the inner one, in the
                  explorer, not the padding out here. */}
              <Instrument
                footnote="Real-time split-operator time evolution: an actual FFT, not a canned animation."
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
              // "all tracks" rather than a bare "hrs": `PillarFooter` prints
              // "Est. time / N hrs" six more times down this page, once per
              // track, and without the qualifier the two readouts look like
              // the same measurement disagreeing with itself.
              { label: "Est. time", value: CURRICULUM_HOURS, unit: "hrs, all tracks" },
            ]}
          />
        </Reveal>
      </Section>
    </section>
  );
}
