import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { LessonSearch } from "@/components/curriculum/LessonSearch";
import { PillarLessonStrip } from "@/components/curriculum/PillarLessonStrip";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { CurriculumExplorer } from "./CurriculumExplorer";
import { RecommendedNext } from "./RecommendedNext";
import { COURSES, CURRICULUM_HOURS, PILLARS } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import {
  ENTRY_BAR,
  ENTRY_BAR_MATH,
  ENTRY_BAR_NOT_ASSUMED,
  ENTRY_BAR_SHORT,
} from "@/lib/entryBar";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Learn",
  description:
    "The StudyQuantum curriculum: Quantum Mechanics, Quantum Computing, Quantum Hardware, Quantum Software, Quantum Mastery, and Apex, from school algebra through graduate-level rigor.",
  path: "/learn",
});

/**
 * "a" or "an" for a numeral that will be *read aloud*, not spelled.
 *
 * The card printed "Opens a 11-module course" because the article was a
 * literal and the count is derived: `modules.length` is 11 today and the
 * sentence was written when it was something else. English takes the article
 * from the sound, and the numbers whose spoken form opens on a vowel are 8
 * ("eight"), 11 ("eleven"), 18 ("eighteen") and the eighties (80-89), which
 * over any course-sized count is exactly a leading "8", "11" or "18".
 */
function indefiniteArticle(count: number): "a" | "an" {
  return /^(8|11|18)/.test(String(count)) ? "an" : "a";
}

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Learn", url: `${BASE_URL}/learn` },
]);

export default async function LearnPage() {
  const lessons = await getAllLessonsMeta();

  // The beginner-friendly entry point. "What Is a Qubit?" needs no math
  // background and leads with physical intuition (spinning-coin analogy, a
  // live Bloch-sphere demo) before any formalism — a genuinely different,
  // equally valid way in for a reader who wants the "why" before the "how."
  const intuitionLesson = lessons.find(
    (lesson) => lesson.slug === "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
  );

  // Derived from the actual prerequisite graph, not hardcoded: whichever
  // course(s) require nothing else are the curriculum's true starting points.
  //
  // There are two of them, and this page is built around exactly that fact —
  // the fork below offers both. `Qubits & Quantum States` (the intuition
  // route) re-teaches complex numbers and Dirac notation from scratch in its
  // own modules, so no lesson in it depends on a Mathematical Foundations
  // lesson; it is a real root, not a course that merely looks like one. The
  // rigorous route is therefore "the root that is not the intuition course"
  // rather than `rootCourses[0]`, which would silently become whichever of
  // the two happens to be declared first in `curriculum.ts`.
  const rootCourses = COURSES.filter((course) => course.prerequisites.length === 0);
  const rootCourse =
    rootCourses.find((course) => course.slug !== intuitionLesson?.course) ?? rootCourses[0];
  const firstLesson = rootCourse
    ? lessons
        .filter((lesson) => lesson.course === rootCourse.slug)
        .find((lesson) => lesson.module === rootCourse.modules[0]?.slug)
    : undefined;

  // Both doors' lengths, read off the lessons those doors actually open. They
  // were previously collapsed into a single figure quoted in the hero button
  // (before that, a hardcoded "20 minutes" that was wrong for both doors —
  // `what-is-a-qubit` is 30 and `complex-numbers-for-physics` is 40). A fork
  // is a comparison, so each card states its own number and the reader can
  // weigh them side by side; `estimatedMinutes` is recalibrated corpus-wide by
  // a fitted rule and course `estimatedHours` derives from it, so any constant
  // here is guaranteed to drift again.
  const intuitionMinutes = intuitionLesson?.estimatedMinutes;
  const rigorMinutes = firstLesson?.estimatedMinutes;

  // How much of the curriculum actually hangs off a given root, counted rather
  // than asserted. Route B's card used to claim "every course on this platform
  // traces back … to Mathematical Foundations", which was a true statement
  // about a one-root graph and becomes false the moment there are two — and it
  // is the kind of claim that fails silently, since nothing renders the graph
  // beside it. Counting the closure keeps the sentence correct whatever the
  // prerequisite data says next.
  //
  // Printed on *both* cards, which is the correction that matters. The figure
  // appeared on Route B alone ("21 of the 31 other courses trace back to it"),
  // and a lone number in a comparison reads as the argument for the card
  // carrying it. Route A's course is the larger of the two: 23 of 31. So the
  // one card the page was quietly arguing for was the smaller one, using a
  // figure the other card could have beaten. A fork the reader cannot compare
  // line by line is not a choice, which is the rule the rest of this pair
  // already follows.
  function dependentCourseCount(rootSlug: string): number {
    return COURSES.filter((course) => {
      if (course.slug === rootSlug) return false;
      const seen = new Set<string>();
      const queue = [...course.prerequisites];
      while (queue.length > 0) {
        const slug = queue.pop()!;
        if (slug === rootSlug) return true;
        if (seen.has(slug)) continue;
        seen.add(slug);
        const prerequisite = COURSES.find((candidate) => candidate.slug === slug);
        if (prerequisite) queue.push(...prerequisite.prerequisites);
      }
      return false;
    }).length;
  }

  const intuitionCourse = COURSES.find((course) => course.slug === intuitionLesson?.course);
  const rigorDependents = rootCourse ? dependentCourseCount(rootCourse.slug) : 0;
  const intuitionDependents = intuitionCourse ? dependentCourseCount(intuitionCourse.slug) : 0;
  const otherCourseCount = COURSES.length - 1;

  const declaredModuleCount = COURSES.reduce((sum, course) => sum + course.modules.length, 0);

  return (
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* -------------------------------------------------------------
          Hero — no single pillar (this page surveys all six): the
          `<PillarScope regime="atlas">` above declares the neutral
          reference environment and paints the atmosphere layer, while
          individual sections below retint themselves locally with plain
          `data-pillar` wrappers. See DESIGN_SYSTEM.md §2 and §7, and
          docs/UX_REVIEW.md P1-2.
          ------------------------------------------------------------- */}
      {/* `tight` halves the vertical rhythm on this section (both edges) —
          deliberately, so the hero reads fast rather than opening the page
          with a near-empty screen. (A previous `pt-4 sm:pt-8` override here
          did nothing: Section sets padding-top via inline `style`, which
          always wins over a class on the same element, so the hero was
          silently using the *full*, un-tightened rhythm the whole time.
          `tight` is the actual fix.) */}
      <Section width="reading" tight>
        <Reveal>
          <Eyebrow>Learn</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            The StudyQuantum curriculum
          </SectionTitle>
          {/* "Tracks", not "pillars", in every reader-facing string on this
              page — the nav, the homepage and this page now agree on one word.
              `Pillar` stays the internal type/data/CSS-token name everywhere
              (`PILLARS`, `data-pillar`, `PillarScope`, …); only the prose
              changed. */}
          {/* The entry claim in this lede used to be hand-written: "They start
              from school algebra and assume no physics", which was true, was a
              seventh wording of the one sentence `entryBar.ts` exists to own,
              and had already lost the trigonometry clause that module added
              because both roots need it by their second lesson. The two
              phrases are now the same constants `ENTRY_BAR` itself is built
              from, so this line cannot say something the bar does not. */}
          <Lede width="reading" className="mt-5">
            Six tracks, each a stack of courses: quantum mechanics and computing from first
            principles, then the hardware and software that make them real, then graduate-level
            mastery and research-depth work. They start from {ENTRY_BAR_MATH} and assume{" "}
            {ENTRY_BAR_NOT_ASSUMED}.
          </Lede>
          {/* The one clear action for a newcomer, placed before the stats
              readout: a first-time visitor's question is "where do I click?",
              and the previous page shape answered it with four figures to
              parse and no button until a section down. Anchor, not lesson
              link, so the choice of entry point (the fork below) stays a
              real choice. */}
          {rootCourse || intuitionLesson ? (
            // The label has to name where the click lands, and this one lands
            // on the fork, not in a lesson. It used to read "New here? Start
            // with a 30-minute lesson" and then scroll the reader to a choice
            // between two lessons, neither of which it had named — the loudest
            // control on the page promising one thing and delivering another.
            // The durations it was carrying now sit on the two cards
            // themselves, where they are actually comparable.
            <Button href="#ways-in" size="lg" className="mt-(--rhythm-close)">
              New here? Pick a starting point
            </Button>
          ) : null}
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Tracks", value: PILLARS.length },
              { label: "Courses", value: COURSES.length },
              // "Lessons authored" was a hedge against a gap that no longer
              // exists: every one of the 219 declared modules has a written
              // lesson, so the qualifier reads to a first-time visitor as
              // "this site is unfinished". `pillarReadoutItems` already drops
              // its own qualifier on the same condition; this does the same,
              // and comes straight back the day a module is declared ahead of
              // its lesson.
              declaredModuleCount === lessons.length
                ? { label: "Lessons", value: lessons.length }
                : {
                    label: "Lessons authored",
                    value: lessons.length,
                    unit: `of ${declaredModuleCount}`,
                  },
              // "Est. time", and `CURRICULUM_HOURS` rather than a fourth
              // private sum of `COURSES`. One quantity had three labels and
              // two values across three pages: "Est. time 118 hrs" on the
              // homepage, "Curriculum length 118h" here, "Reading time 117h"
              // on /lessons. See the constant's note in
              // `lib/content/curriculum.ts`.
              { label: "Est. time", value: CURRICULUM_HOURS, unit: "h" },
            ]}
          />
        </Reveal>
        {/* Renders nothing for a first-time visitor — the "two ways in"
            panel below is what they see instead. */}
        <ContinueLearning />
      </Section>

      {/* -------------------------------------------------------------
          Two ways in — kept from the previous page, restyled as a pair
          of instrument panels, each tinted to the pillar it leads into,
          with a real "OR" fork marker between them so the choice reads as
          a genuine branch rather than two similar cards. `RecommendedNext`
          (a real recommendation from the prerequisite graph plus stored
          progress) renders first: for a returning reader it is the
          strongest thing in this section — heavier border, bigger heading —
          and for a first-time reader it renders nothing, so this fork is
          the first thing they see either way.
          ------------------------------------------------------------- */}
      {rootCourse || intuitionLesson || lessons.length > 0 ? (
        <Section width="wide" tight id="ways-in">
          <RecommendedNext lessons={lessons} />

          <Reveal>
            <Eyebrow>Where to start</Eyebrow>
            <SectionTitle level={2} size="md" className="mt-3">
              Two ways in, one curriculum
            </SectionTitle>
            {/* "Both reach the same six tracks" was true only by
                OR-reachability, and only for one of the two. Counted on the
                real graph: Mathematical Foundations' closure touches 4 of the
                6 tracks, Qubits & Quantum States' touches 6 — and it touches
                Mechanics and Software only through courses that *also* need
                `wave-mechanics`, which is Mathematical Foundations' line.
                Take one root and nothing else and the curriculum stops: 7
                further courses off Mathematical Foundations, 9 off Qubits &
                Quantum States, all 32 only with both. So the honest sentence
                is that this is a choice of *starting end*, not of half the
                site, and it has to be here because the two figures on the
                cards below read as "courses this unlocks" without it. */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Neither route is the beginner version of the other. Both open at the same bar; they
              differ in what they ask of you on the first page. Neither one finishes the
              curriculum on its own either, so whichever you pick you will take the other
              eventually: the counts on the cards are which end you start from, not which half you
              get. {ENTRY_BAR}
            </p>
          </Reveal>

          <Reveal delay={80} className="relative mt-8 grid gap-5 sm:grid-cols-2">
            {/* Both fork cards use the same stretched-link treatment as
                CourseList's course cards: the card's one link (its Button)
                carries an inset-0 overlay pseudo-element, anchored to the
                `.instrument` (position: relative in globals.css), so the
                whole card is clickable while the button stays the visible
                affordance and the accessible name stays the button's own
                text. `active:!scale-none` is load-bearing, not cosmetic:
                Button's pressed-state scale would turn the link into a
                containing block mid-press, snapping the overlay down to the
                button's own box between pointerdown and pointerup and
                silently swallowing any click that started elsewhere on the
                card. Secondary links inside a stretched card get
                `relative z-10` to stay clickable above the overlay, exactly
                as CourseList does. */}
            {intuitionLesson ? (
              <div data-pillar="quantum-computing">
                <Instrument
                  className="h-full"
                  label="Route A · Intuition first"
                  // Was "Assumes no math background." — the exact string
                  // `Hero.tsx` carries a comment explaining it deliberately
                  // rejected as untrue, printed on the very next screen. Both
                  // doors state the one shared bar (`ENTRY_BAR_SHORT`) and
                  // then the thing that actually differs between them.
                  footnote={`${ENTRY_BAR_SHORT} Physical pictures on page one, formalism once you need it.`}
                >
                  <SectionTitle level={3} size="sm">
                    {intuitionLesson.title}
                  </SectionTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{intuitionLesson.description}</p>
                  {/* The same closure figure Route B carries, in the same
                      place, so the two are comparable. No superlative on
                      either card: the numbers are printed and the reader
                      compares them, which is what stops this drifting the
                      next time the prerequisite graph moves. */}
                  {intuitionCourse ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Its course is {intuitionCourse.title}. {intuitionDependents} of the{" "}
                      {otherCourseCount} other courses trace back to it, directly or through their
                      own prerequisites.
                    </p>
                  ) : null}
                  {/* `withHint`: the visible "no prior background needed"
                      gloss, not the hover-only tooltip — this card is
                      precisely where a beginner on a phone decides whether
                      they're allowed to start here. */}
                  <DifficultyMark difficulty={intuitionLesson.difficulty} withHint className="mt-3" />
                  {/* Both cards state the same three facts in the same order
                      and the same place — what you open, how long it is, what
                      it assumes — because a fork the reader cannot compare
                      line by line is not a choice, it is two adverts. The
                      minutes are `estimatedMinutes` off the lesson each button
                      opens, never a constant. */}
                  <p className="mt-4 tech-label text-subtle-foreground">
                    Opens one lesson{intuitionMinutes ? ` · ${intuitionMinutes} min` : ""}
                  </p>
                  <Button
                    href={`/lessons/${intuitionLesson.slug}`}
                    size="lg"
                    className="mt-3 before:absolute before:inset-0 before:content-[''] active:!scale-none"
                  >
                    {/* The card's own heading is this lesson's title, sitting
                        four lines above; repeating it inside the button was
                        the same string twice in one card, and at 320px it wrapped
                        the button to three lines to say nothing new. The
                        sr-only half keeps the link's accessible name specific,
                        which matters because the stretched `::before` makes
                        this button the name of the whole card. */}
                    Start this lesson
                    <span className="sr-only">: {intuitionLesson.title}</span>
                  </Button>
                </Instrument>
              </div>
            ) : null}
            {/* Decorative fork marker between the two paths — a shape/label
                cue (not a color-only one) that this is a branch, not a pair
                of similar cards. Hidden below `sm`, where the grid is
                already a single stacked column and "OR" would just sit
                between two vertically stacked cards, which reads on its own
                without the chip. */}
            {intuitionLesson && rootCourse ? (
              <div
                aria-hidden="true"
                data-decorative=""
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
              >
                <span className="rounded-full border border-border-strong bg-surface px-2.5 py-1 tech-label font-semibold text-subtle-foreground">
                  Or
                </span>
              </div>
            ) : null}
            {rootCourse ? (
              <div data-pillar="quantum-mechanics">
                <Instrument
                  className="h-full"
                  label="Route B · Rigor first"
                  footnote={`${ENTRY_BAR_SHORT} Derivations and proofs from the first page, not analogies.`}
                >
                  <SectionTitle level={3} size="sm">
                    {rootCourse.title}
                  </SectionTitle>
                  {/* The course's own description, verbatim, exactly as Route
                      A prints `intuitionLesson.description`. It used to be
                      replaced here by the editorial one-liner "The
                      mathematics the physics is built on", which dropped the
                      two warnings the real description carries and that
                      `curriculum.ts` explicitly relies on being rendered
                      beside a `DifficultyMark`: that this is a mathematics
                      course from the first page, and that single-variable
                      calculus is assumed from the *next* course on. The one
                      screen where a reader picks between the two routes was
                      the one screen not showing them. */}
                  <p className="mt-2 text-sm text-muted-foreground">{rootCourse.description}</p>
                  {/* The count is walked from the prerequisite graph above,
                      not written down here. Both cards in this fork are real
                      roots — neither requires anything first — so the honest
                      difference between them is not "which one is the start"
                      but how much of the curriculum each one carries, and
                      that is a number the data can answer for itself. It is
                      now printed on both cards, on its own line on both, in
                      the same place; see the note on `dependentCourseCount`
                      and the closure caveat in the paragraph above the fork. */}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rigorDependents} of the {otherCourseCount} other courses trace back to it,
                    directly or through their own prerequisites.
                  </p>
                  {/* The mirror of Route A's readout, and the one place the
                      cards genuinely differ in kind: this door opens a course,
                      so it names the lesson it starts you on (a different
                      title from this card's heading, unlike Route A's) and
                      states the course's own length as well. */}
                  <DifficultyMark difficulty={rootCourse.difficulty} withHint className="mt-3" />
                  <p className="mt-4 tech-label text-subtle-foreground">
                    Opens {indefiniteArticle(rootCourse.modules.length)}{" "}
                    {rootCourse.modules.length}-module course
                    {rootCourse.estimatedHours ? ` · ${rootCourse.estimatedHours}h` : ""}
                  </p>
                  {firstLesson ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Starting on {firstLesson.title}
                      {rigorMinutes ? `, ${rigorMinutes} min` : ""}.
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {firstLesson ? (
                      <Button
                        href={`/lessons/${firstLesson.slug}`}
                        size="lg"
                        variant="secondary"
                        className="before:absolute before:inset-0 before:content-[''] active:!scale-none"
                      >
                        Start the first lesson
                        <span className="sr-only">: {firstLesson.title}</span>
                      </Button>
                    ) : null}
                    {/* Was "View the full course →" — a verb this brief bans
                        by name, and a label that appeared twice on this page
                        (RecommendedNext carries the same control) pointing at
                        two different courses. Naming what is behind it makes
                        the two instances tell themselves apart, and tells the
                        reader that the course page is an outline rather than
                        another lesson. */}
                    {/* `inline-flex min-h-11 items-center` costs nothing here
                        and buys the 44px target: this row is `items-center`
                        beside a `size="lg"` Button, which is already 44px tall,
                        so a 44px box for the link changes no layout at all
                        while taking it off the 20px line box it had. */}
                    <Link
                      href={getCourseHref(rootCourse.slug, firstLesson?.slug)}
                      aria-label={`See all ${rootCourse.modules.length} modules in ${rootCourse.title}`}
                      className="relative z-10 inline-flex min-h-11 items-center text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
                    >
                      See all {rootCourse.modules.length} modules →
                    </Link>
                  </div>
                </Instrument>
              </div>
            ) : null}
          </Reveal>

          {/* -------------------------------------------------------------
              The third tier of the fork, and the answer to the brief's
              "lessons should not feel hidden/invisible until the user
              scrolls."

              Two recommended doors sit above; this is the whole key ring.
              It puts six *real, clickable lesson titles* on screen roughly
              one scroll in, instead of leaving the page's first lesson
              title buried in a course card's module manifest six pillar
              headers down.

              It lives inside this section rather than becoming a section of
              its own on purpose. A third full-height "how to start" block
              between the hero and the catalog would have traded one
              complaint ("where are the lessons") for a worse one ("which of
              these three things am I supposed to click"). As a compact
              instrument under an existing heading it reads as *more detail
              on the same choice*, and it costs about one card's height.

              And because its rows are the first lesson of each pillar in
              curriculum order — not a flat "latest lessons" sample — it
              restates the six-pillar progression on the way past rather
              than flattening it. See PillarLessonStrip's own header.
              ------------------------------------------------------------- */}
          <Reveal delay={140}>
            <PillarLessonStrip lessons={lessons} className="mt-10" />
          </Reveal>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------
          The curriculum itself — search, a difficulty scan, and all six
          pillars in progression order, ending at Apex. `tight` on the top
          edge so a first-time visitor (no "two ways in"/RecommendedNext
          preamble consumed much space above) reaches the first real course
          sooner rather than crossing another full section's worth of
          padding to get here.
          ------------------------------------------------------------- */}
      <Section width="wide" tight>
        <Reveal>
          <LessonSearch lessons={lessons}>
            <CurriculumExplorer lessons={lessons} />
          </LessonSearch>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
