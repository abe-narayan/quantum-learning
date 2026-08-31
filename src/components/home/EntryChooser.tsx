import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { START_LEARNING_HREF, START_LEARNING_SLUG } from "@/lib/nav";
import { ENTRY_BAR_SHORT } from "@/lib/entryBar";

/**
 * ============================================================
 * Four ways in
 * ============================================================
 * The section that converts "what do I click" into "which of these am I".
 *
 * The homepage had one call to action and a navbar, which asks a visitor to
 * choose a destination before anything has told them what the destinations
 * are. Four self-descriptions do the opposite: a reader recognises themselves
 * in one line and the link under it is already the right page. No account, no
 * modal, no wizard, no stored state, no quiz. Four honest links.
 *
 * The previous version of this idea was an `<Instrument label="Two ways in">`
 * buried inside `HowItWorks`, four sections and roughly two thousand pixels
 * down the page, offering a beginner door, a rigorous door and a line for
 * readers who already know the subject. It was well written and it was in the
 * wrong place: it is the answer to the first question a visitor has, and it
 * was placed after the answer to the third. That panel is gone; its beginner
 * and rigorous doors are the first two cards below, its "if you already know
 * the subject" door is the closing paragraph, and its last reassurance
 * (progress is kept in your own browser) is the clause that ends it.
 *
 * The entry bar sits here rather than in the hero for the same reason. It is
 * the site's single statement of what it assumes and it must not be restated
 * in anyone's own words (six wordings existed once, two of them false, see
 * `lib/entryBar.ts`), but it answers "am I qualified", which is the question
 * *after* "where do I start". In the hero it was a fourth paragraph in front
 * of the first button; here it is the footnote to a choice the reader has just
 * made, in the short form, under the label that form is written for.
 *
 * Whole-row links via a stretched `::after`, the same technique the contents
 * index uses: the anchor wraps only the self-description, so that is the row's
 * accessible name, while the sentence explaining it stays readable content
 * rather than being swallowed into a run-on link name.
 *
 * A Server Component, like every section on this page. It reads three
 * registries and ships none of them.
 */
export async function EntryChooser() {
  const lessons = await getAllLessonsMeta();
  const startLesson = lessons.find((lesson) => lesson.slug === START_LEARNING_SLUG);
  const problemCount = getAllProblemMeta().length;

  const ROUTES: Array<{ href: string; you: string; destination: string; body: string }> = [
    {
      href: START_LEARNING_HREF,
      you: "I have never studied quantum physics",
      destination: "What is a qubit",
      body: `The on-ramp lesson: no prerequisites at all, about ${
        startLesson ? startLesson.estimatedMinutes : 30
      } minutes, intuition before notation.`,
    },
    {
      href: "/learn",
      you: "I would rather start from the mathematics",
      destination: "The rigorous route",
      body: "The curriculum index forks at the top. The other branch builds the theory as mathematics.",
    },
    {
      href: "/simulators",
      you: "I want to turn knobs before I read anything",
      destination: `${SIMULATOR_COUNT} instruments`,
      body: "Every solver the lessons use, standing alone with its parameters unlocked. Real numerics.",
    },
    {
      href: "/problems",
      you: "I know some of this and want to be tested",
      destination: `${problemCount} problems`,
      body: "Filterable by track and difficulty, marked against a real answer, worked solution behind each.",
    },
  ];

  return (
    <Section width="wide" aria-labelledby="entry-heading" className="border-b border-border">
      <Reveal>
        <Eyebrow>Where to start</Eyebrow>
        <SectionTitle id="entry-heading" className="mt-3">
          Four ways in. Pick the one that sounds like you.
        </SectionTitle>
      </Reveal>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {ROUTES.map((route, index) => (
          <li key={route.href} className="min-w-0">
            <Reveal delay={index * 60} className="h-full">
              <div className="group relative flex h-full flex-col rounded-(--radius-tight) border border-border bg-surface p-4 transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar-edge hover:bg-pillar-wash">
                <Link
                  href={route.href}
                  className="font-display text-lg font-semibold leading-snug text-foreground after:absolute after:inset-0 after:content-[''] group-hover:text-pillar"
                >
                  {route.you}
                </Link>
                <p className="mt-1.5 min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {route.body}
                </p>
                <TechLabel className="mt-3 text-pillar-text">{route.destination} →</TechLabel>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={200} className="mt-6 border-t border-border pt-5">
        {/* `ENTRY_BAR_SHORT`, not `ENTRY_BAR`. The two are the same claim in
            two grammatical positions and the short one is the form for "a
            label above it already says what is being described", which is
            exactly the case here. Never a third wording: six of those existed
            once and two were false. See `lib/entryBar.ts`. */}
        <TechLabel as="p">What it assumes</TechLabel>
        <p className="mt-1.5 max-w-reading text-sm leading-relaxed text-muted-foreground">
          {ENTRY_BAR_SHORT}
        </p>
        {/* The third door of the old panel, kept because it is the one a
            reader with a physics degree needs: an introduction cannot tell
            them whether this site is worth their time, and tracks 05 and 06
            can. It is a sentence rather than a fifth card because the four
            above are the choices a first-time visitor makes; this is a way
            past all four. The closing clause is the "Two ways in" panel's own
            last fact, which is the reassurance that decides whether someone
            clicks anything at all. */}
        <p className="mt-3 max-w-reading text-sm leading-relaxed text-muted-foreground">
          Already know quantum mechanics? Judge the site on{" "}
          <Link
            href="/mastery"
            className="font-medium text-pillar underline-offset-4 hover:underline"
          >
            Quantum Mastery
          </Link>{" "}
          or{" "}
          <Link href="/apex" className="font-medium text-pillar underline-offset-4 hover:underline">
            Apex
          </Link>{" "}
          instead. No route rules out another, and progress is kept in your own browser.
        </p>
      </Reveal>
    </Section>
  );
}
