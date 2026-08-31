import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { CurriculumStrip } from "@/components/home/CurriculumStrip";
import { LessonSpecimen } from "@/components/home/LessonSpecimen";
import { getAllLessonsMeta } from "@/lib/content/lessons";

/**
 * ============================================================
 * Orientation
 * ============================================================
 * What is actually behind a link on this page, and in what order the material
 * comes.
 *
 * Two answers, where there used to be three:
 *
 *   1. **What is a lesson.** Four beats, because that is genuinely what a
 *      lesson does: derive, ask, run, grade. A visitor who knows this can read
 *      the six track sections below as contents rather than as claims, and
 *      knows that clicking one of them is not going to open a video. Beat 2 is
 *      demonstrated live one section up by `PredictSection`; beats 1, 3 and 4
 *      are shown rather than asserted by `LessonSpecimen` below.
 *   2. **In what order.** `CurriculumStrip`, where a list of six subjects
 *      reads as a route instead of a menu because the reader has just been
 *      told what one lesson does to them.
 *
 * The third answer, "which door is mine", was an `<Instrument label="Two ways
 * in">` beside the beats. It is gone from here and is now `EntryChooser`, four
 * sections up, directly under the hero: it is the answer to the first question
 * a visitor has and it was sitting behind the answer to the third. Nothing in
 * it was lost. Two of its doors became the first two cards there, its advanced
 * door became the line under them, `ENTRY_BAR` moved with it, and its closing
 * fact about progress being kept in the browser is now beside the hero's
 * primary button.
 *
 * With the panel gone the beats no longer share a two-column split with it, so
 * they run as a 2x2 grid instead of a four-row list. Same four beats, same
 * copy, roughly half the height above `sm`.
 */

/** What a lesson does to you, in order. Not a feature list: every one of these
 *  is a thing on the page of the lesson the "Start learning" button opens. */
const BEATS = [
  {
    label: "Derive",
    body: "The actual derivation, written out. Not a summary of one, and not a picture of the result with the algebra left as an exercise.",
  },
  {
    label: "Predict",
    body: "The lesson stops and asks what you think happens next, the same way this page just did, and will not show you the answer until you commit.",
  },
  {
    label: "Operate",
    body: "A working simulator, built into the page, running the real numerics with its parameters exposed. You break it on purpose and see what breaks.",
  },
  {
    label: "Prove",
    body: "Graded problems tied to that specific lesson, marked exactly, with progressive hints and a full worked solution behind them.",
  },
];

export async function HowItWorks() {
  const lessons = await getAllLessonsMeta();
  // "How long is one of these" is the question that decides whether a visitor
  // opens a lesson at all, and the page answered it for exactly one lesson
  // (the on-ramp, in the hero) out of 219. The median rather than the mean,
  // because the corpus has a long tail of 55-90 minute Apex lessons that would
  // drag an average away from the lesson a first-time reader will actually
  // open, and derived rather than written down, for the same reason the
  // hero's duration is.
  const durations = lessons.map((lesson) => lesson.estimatedMinutes).sort((a, b) => a - b);
  const medianMinutes = durations[Math.floor(durations.length / 2)];

  return (
    <Section width="wide" aria-labelledby="how-heading" className="border-y border-border bg-surface/30">
      <Reveal>
        <Eyebrow>Orientation</Eyebrow>
        <SectionTitle id="how-heading" className="mt-3">
          What is actually behind a link on this page
        </SectionTitle>
        {/* Was "Every one of them", which the rest of the page falsifies
            within a screen: the contents index above lists ten destinations
            and only two of them are lessons. The section whose entire job is
            to be accurate about the site was the one place making a claim
            about it that a reader could disprove by clicking. "Nearly every
            one" costs one word and is true; the rest of the sentence is
            unchanged, because the point it makes, that the destination is a
            page you read rather than a video or a product tour, is the right
            point. */}
        <Lede width="wide" className="mt-4">
          Nearly every one opens the same kind of page: a lesson. There are {lessons.length} of
          them{medianMinutes ? `, the middle one about ${medianMinutes} minutes` : ""}, and each
          puts you through the same four beats.
        </Lede>
      </Reveal>

      <Reveal delay={60} className="mt-8">
        <dl className="grid gap-x-10 border-t border-border sm:grid-cols-2">
          {BEATS.map((beat, index) => (
            <div key={beat.label} className="flex gap-4 border-b border-border py-4 sm:gap-6">
              <dt className="flex w-24 shrink-0 flex-col gap-1 sm:w-20">
                <span aria-hidden="true" data-decorative="" className="tech-label text-pillar">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-semibold text-foreground">
                  {beat.label}
                </span>
              </dt>
              <dd className="min-w-0 text-sm leading-relaxed text-muted-foreground">{beat.body}</dd>
            </div>
          ))}
        </dl>

        {/* The one comparison the page makes, and it is made against what a
            visitor is actually choosing between. Everything above this line
            describes the four beats accurately and still leaves a reader
            asking why they should not just watch a lecture series, because the
            page never once named the alternative. Two beats are the honest
            answer, and they are the two a recording and a printed book are
            structurally incapable of: the instrument, and the marking. No
            claim about quality, no comparison to another site. */}
        <p className="mt-6 max-w-reading text-sm leading-relaxed text-muted-foreground">
          A video can show you the result; a textbook can set a problem about it. Neither hands
          you the solver that produced the result, and neither marks what you write.
        </p>
      </Reveal>

      <LessonSpecimen />

      <CurriculumStrip />
    </Section>
  );
}
