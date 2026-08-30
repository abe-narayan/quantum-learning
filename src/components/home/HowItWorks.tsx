import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { CurriculumStrip } from "@/components/home/CurriculumStrip";
import { LessonSpecimen } from "@/components/home/LessonSpecimen";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { START_LEARNING_HREF, START_LEARNING_SLUG } from "@/lib/nav";

/**
 * ============================================================
 * Orientation
 * ============================================================
 * The section that exists because the old homepage answered every question a
 * visitor had about the *subject* and none of the questions they had about the
 * *site*: what is behind a link, where a beginner is supposed to start, what
 * "advanced" means here, and in what order any of it comes.
 *
 * Three answers, in the order they are asked:
 *
 *   1. **What is a lesson.** Four beats, because that is genuinely what a
 *      lesson does: derive, ask, run, grade. A visitor who knows this can
 *      read the six track sections below as contents rather than as claims,
 *      and knows that clicking one of them is not going to open a video.
 *   2. **Which door is mine.** The site has two real entrances and they are
 *      for different people. Naming both, with the reason for each, is the
 *      thing that stops a reader with no physics deciding this is not for
 *      them, and equally stops a reader with a maths degree starting at
 *      "what is a qubit" and leaving.
 *   3. **In what order.** `CurriculumStrip`, which used to open the page and
 *      now closes this section, where a list of six subjects reads as a route
 *      instead of a menu.
 *
 * The two doors are links, not buttons, and neither is a third copy of the
 * hero's call to action: the primary entrance is the same
 * `START_LEARNING_HREF` the hero and the Navbar share (one contract, one
 * destination), described here rather than shouted, and the rigorous entrance
 * is the fork `/learn` already offers. Nothing on this page invents a new way
 * in.
 */

/** What a lesson does to you, in order. Not a feature list: every one of these
 *  is a thing on the page of the lesson `START_LEARNING_HREF` opens. */
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
  const startLesson = lessons.find((lesson) => lesson.slug === START_LEARNING_SLUG);
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
            within a screen: the panel to the right of this paragraph links to
            /learn, /mastery and /apex, and further down are /problems,
            /simulators, /map, /glossary, /current-quantum and six track
            pages. The section whose entire job is to be accurate about the
            site was the one place making a claim about it that a reader could
            disprove by clicking. "Nearly every one" costs one word and is
            true; the rest of the sentence is unchanged, because the point it
            makes — that the destination is a page you read, not a video or a
            product tour — is the right point. */}
        <Lede width="wide" className="mt-4">
          Nearly every one opens the same kind of page: a lesson. There are {lessons.length} of
          them{medianMinutes ? `, the middle one runs about ${medianMinutes} minutes` : ""}, and
          they are meant to be read in order. Each puts you through the same four beats.
        </Lede>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <Reveal delay={60} className="min-w-0">
          <dl className="divide-y divide-border border-y border-border">
            {BEATS.map((beat, index) => (
              <div key={beat.label} className="flex gap-4 py-5 sm:gap-6">
                <dt className="flex w-24 shrink-0 flex-col gap-1 sm:w-28">
                  <span aria-hidden="true" data-decorative="" className="tech-label text-pillar">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base font-semibold text-foreground">
                    {beat.label}
                  </span>
                </dt>
                <dd className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {beat.body}
                </dd>
              </div>
            ))}
          </dl>

          {/* The one comparison the page makes, and it is made against what a
              visitor is actually choosing between. Everything above this line
              describes the four beats accurately and still leaves a reader
              asking why they should not just watch a lecture series, because
              the page never once named the alternative. Two beats are the
              honest answer, and they are the two a recording and a printed
              book are structurally incapable of: the instrument, and the
              marking. No claim about quality, no comparison to another site. */}
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            A video can show you the result; a textbook can set a problem about it. Neither hands
            you the solver that produced the result, and neither marks what you write.
          </p>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          {/* The panel's own `label` strip carries "Two ways in" in the
              technical voice. Deliberately not also a heading: this is a
              figure beside the four beats, not a new division of the
              document, and injecting an h3 here would put a level into the
              outline that the act plates below then have to step around. */}
          <Instrument label="Two ways in">
            <div>
              <TechLabel>If you have never studied quantum</TechLabel>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Start at{" "}
                <Link
                  href={START_LEARNING_HREF}
                  className="font-medium text-pillar underline-offset-4 hover:underline"
                >
                  What is a qubit
                </Link>
                . It has no prerequisites at all, it leads with physical intuition rather than
                notation, and it takes about {startLesson ? startLesson.estimatedMinutes : 30}{" "}
                minutes. This is the same lesson the &ldquo;Start learning&rdquo; button opens.
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              {/* Was "If you already have the linear algebra", which gated
                  this door on the one thing the course behind it exists to
                  teach: Mathematical Foundations is rated Foundational, its
                  `prerequisites` array is empty, and `DifficultyMark` glosses
                  it to the reader as "no prior background needed". The real
                  difference between the two doors is not background, it is
                  register: intuition first, or derivation first. Both open at
                  `ENTRY_BAR`. */}
              <TechLabel>If you would rather start from the mathematics</TechLabel>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Take the rigorous route instead:{" "}
                <Link
                  href="/learn"
                  className="font-medium text-pillar underline-offset-4 hover:underline"
                >
                  the curriculum index
                </Link>{" "}
                forks at the top, and the other branch starts from mathematical foundations and
                builds quantum mechanics as mathematics rather than as intuition.
              </p>
              {/* The panel had one advanced door and it landed everyone who
                  was not a beginner in the same place: the rigorous *entry*
                  course. A reader who already knows the subject does not want
                  a better introduction, they want the material that would
                  tell them whether this site is worth their time. Here that
                  material is tracks 05 and 06, at the far end of a page they
                  would have to scroll to the bottom of to find. */}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If quantum mechanics itself is already familiar, skip ahead to{" "}
                <Link
                  href="/mastery"
                  className="font-medium text-pillar underline-offset-4 hover:underline"
                >
                  Quantum Mastery
                </Link>{" "}
                or{" "}
                <Link
                  href="/apex"
                  className="font-medium text-pillar underline-offset-4 hover:underline"
                >
                  Apex
                </Link>{" "}
                and judge the site on that material instead of on its introduction.
              </p>
            </div>

            <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              Neither path locks the other one. Progress is kept in your own browser, there is no
              account, and nothing on this site is behind a sign-up.
            </p>
          </Instrument>
        </Reveal>
      </div>

      {/* Beat 2 is demonstrated live one section up, by `PredictSection`.
          This is beats 1, 3 and 4, shown rather than asserted: the reader who
          has just been told what a lesson does gets one real section of one
          real lesson, with its numbers computed on this page. It sits inside
          the orientation block on purpose, under the description it is
          evidence for, rather than becoming a fifth movement of the page. */}
      <LessonSpecimen />

      <CurriculumStrip />
    </Section>
  );
}
