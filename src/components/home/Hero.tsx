import { Section } from "@/components/ui/Section";
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

/**
 * ============================================================
 * The homepage opener, and the page's one `h1`
 * ============================================================
 * Rebuilt to be **complete on its own**, at 375px as well as at 1440px, after
 * the first screen was measured at both:
 *
 *   1440x900  the only actions on screen were the simulator's own controls
 *             ("Free particle", "Tunnel through a barrier", "Pause"). The
 *             primary call to action was below the fold.
 *   375x812   zero actions on screen. Three dense paragraphs and nothing to
 *             click.
 *
 * So a first-time visitor could not tell what the site was, that it costs
 * nothing, or where to begin. Four things now have to be in the first screen at
 * every width, and the order below is the order they are asked in:
 *
 *   the hook       an `h1` that is a real question about the physical world,
 *                  not a description of the site. Classical electrodynamics
 *                  genuinely predicts that an orbiting electron radiates away
 *                  its energy and spirals into the nucleus in ~1.6e-11 s, and
 *                  the fact that it does not is the observation quantum
 *                  mechanics was built to explain. It is the honest opening of
 *                  this subject and it costs one line.
 *   what this is   one paragraph. It used to be three, plus `ENTRY_BAR`, plus
 *                  a fourth explaining the panel. Two of those moved (see
 *                  below); one was cut.
 *   the price      free, said once, loudly, in its own tinted strip touching
 *                  the button. Buried mid-sentence it was invisible; a visitor
 *                  who does not know whether a site will ask for a card does
 *                  not click its primary button.
 *   the action     `START_LEARNING_HREF`, the same destination and label the
 *                  Navbar's button and `ApexSection`'s closing button use. One
 *                  contract: a page that starts teaching.
 *
 * **What moved out, and where to.**
 *
 *   `ENTRY_BAR`   to `EntryChooser`, directly below this section. It is the
 *                 site's one honest statement of what it assumes and it is
 *                 load-bearing, but it answers "am I qualified", which is the
 *                 question after "where do I start", not before it. It also
 *                 has one owner (`lib/entryBar.ts`) and is consumed in several
 *                 places, so it moves rather than being restated.
 *   the panel's   into the panel itself. The paragraph that said "the panel
 *   explanation   beside this text is not an illustration" needed a
 *                 `lg:hidden`/`hidden lg:inline` pair to stay true in both
 *                 layouts, which is a paragraph fighting its own placement.
 *                 The explorer now draws its own legend and narrates its own
 *                 run, which is where that sentence belonged all along.
 *
 * **The simulation stays and stops dominating.** It was the wide track of a
 * `SplitFigure` (whose figure column is always the 1.35fr one, in both
 * `reverse` states), so on desktop it took over half the first screen and on a
 * phone it pushed every control off it. The grid here is written out instead,
 * with the text on the wide track, and the figure follows the text in source
 * order so the phone gets the button before the instrument.
 *
 * Async because it reads the real curriculum counts rather than hard-coding
 * them. Every figure on this screen is derived.
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

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        data-decorative=""
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.32] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] grid-paper"
      />

      <Section width="wide" tight>
        {/* Written out rather than `SplitFigure`, which hands the figure the
            1.35fr track whichever way round it is asked for. Here the text is
            the wide column and the instrument is the narrow one, which is the
            whole point of the rebuild. Below `lg` this collapses to one
            column in source order: text, then instrument. */}
        {/* `lg:items-start`, not `items-center`. Centring the text column
            against a much taller instrument column pushed the heading, the
            price and the button down by half the difference: measured at
            1440x900 the primary button sat 691px down, inside the first screen
            but only just, with nothing above it but air. Top-aligned it is at
            ~430px and the fold is no longer part of the argument. */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <Eyebrow>StudyQuantum</Eyebrow>
            {/* `break-words` is a WCAG 1.4.4 fix, not typography. At 200%
                text-only zoom this heading is 120px type in a 443px column,
                where its longest word no longer fits one line; with the
                default `overflow-wrap: normal` the word simply ran out past
                the column, past the `Section` gutter, and into the
                `overflow-hidden` on the `<section>` above, which clipped it
                at the viewport edge, 1319px of content in a 1280px box.
                `overflow-wrap: break-word` only ever acts on a word that
                cannot fit its line at all, so nothing changes at any text
                size the heading already fits, and at 200% the word wraps
                instead of disappearing. */}
            <SectionTitle level={1} size="xl" className="mt-4 break-words">
              Why has the electron not fallen into the nucleus?
            </SectionTitle>
            {/* Two sentences, and the length is load-bearing rather than
                stylistic: at 375px this paragraph is 34 characters to the
                line, so every extra clause is 33px of the first screen spent
                before the reader reaches a button. The version this replaced
                ran seven lines. What the site *is* moved down one element,
                into the strip below, where it is set at 14px and costs half as
                much per word. */}
            <Lede className="mt-5">
              Classical physics gives it about ten picoseconds before it spirals in, taking
              every atom with it. Explaining why that does not happen is quantum mechanics.
            </Lede>

            {/* The price, said once and loudly, touching the button it
                qualifies. This was previously a subordinate clause in the
                second sentence of the second paragraph ("A complete course
                ..., free, from school algebra..."), which is a place a reader
                deciding whether to click does not look. It also carries what
                the site *is*, which used to open that paragraph: 14px type
                costs about half as much of the first screen per word as the
                20px lede above it, and this is the one element on the screen
                where a reader is already looking for small print. */}
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 py-3">
              <span className="font-display text-lg font-semibold text-foreground">Free</span>
              <span className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                Quantum mechanics and quantum computing, school algebra to research papers. No
                account, no ads, nothing behind a paywall.
              </span>
            </p>

            <div className="mt-6 flex flex-wrap items-start gap-x-3 gap-y-4">
              <div className="flex flex-col gap-2">
                <Button href={START_LEARNING_HREF} size="lg">
                  Start learning
                </Button>
                {/* Not "no math background needed", which the entry bar one
                    section down contradicts. The lesson's own `prerequisites`
                    array is empty, so "no prerequisites" is the claim the data
                    supports, and it is a claim about the curriculum rather
                    than about the reader. */}
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

          <Reveal y={18} className="min-w-0">
            {/* There is no `bodyClassName="p-0"` here, and taking it off
                changed nothing on screen, because it had never applied.
                `cn()` is a plain join with no tailwind-merge, so `p-0` landed
                beside the body's own `p-4 sm:p-5` and stylesheet order decided
                the winner. `WavefunctionHeroExplorer` renders its own root and
                no longer self-frames, so the padding here is the only padding.

                No `footnote` and no `label`. This carried a plain-language
                caption for a while ("the tall curve is where the particle
                probably is..."), added because the explorer's own copy
                explained the *code* ("an actual FFT and split-operator time
                evolution") and nothing explained the *curve* to someone
                meeting a probability density for the first time. The explorer
                now draws its own legend and narrates the run in the panel, so
                the caption out here says the same thing a third time. A
                caption that repeats the figure is padding, and this panel's
                problem was that it was too big for the first screen. */}
            <Instrument>
              <LazyWavefunctionHeroExplorer />
            </Instrument>
          </Reveal>
        </div>

        <Reveal y={12} delay={80} className="mt-10 border-t border-border pt-6">
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
