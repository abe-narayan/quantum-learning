import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle, TechLabel } from "@/components/ui/Typography";
import { Panel, Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { COURSES, CURRICULUM_HOURS, PILLARS } from "@/lib/content/curriculum";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { buildSearchIndex } from "@/lib/search";
import { START_LEARNING_HREF } from "@/lib/nav";
import { ENTRY_BAR } from "@/lib/entryBar";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "What StudyQuantum is, who it's for, how its content and simulators are verified, and what it deliberately does not claim.",
  path: "/about",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "About", url: `${BASE_URL}/about` },
]);

/**
 * The simulator count, derived rather than hand-kept.
 *
 * There is no programmatic registry of simulators, `/simulators` is a page
 * of hand-written `<section id="...">` blocks, but `buildSearchIndex` in
 * `src/lib/search/index.ts` already carries one `type: "simulator"` entry per
 * real section on that page, and a test keeps that list honest. Counting
 * those entries is therefore the closest thing to a source of truth that
 * exists, and it costs nothing: passing empty inputs for every other content
 * kind builds only the simulator entries. This page used to hard-code `14`
 * beside a comment asking a future editor to remember to update it, which is
 * exactly the kind of claim that goes quietly wrong.
 *
 * The empty arrays are positional, so a future parameter added to
 * `buildSearchIndex` has to be added here too, a compile error, not a silent
 * wrong number, which is the trade this file is making on purpose.
 */
const SIMULATOR_COUNT = buildSearchIndex([], [], [], []).filter(
  (entry) => entry.type === "simulator"
).length;

/**
 * What this page is for: a visitor who has not decided whether to trust the
 * site yet. That reader is not served by adjectives, they are served by
 * specifics they can check (real counts, a named verification mechanism they
 * can go look at) and by an explicit statement of what the site does *not*
 * claim, which is the part almost no education site is willing to write down.
 * Deliberately no superlatives, no testimonials, no "world-class."
 */
export default async function AboutPage() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;
  // `CURRICULUM_HOURS`, not a local reduce. This page's footnote promises
  // that every figure above it is counted from the site's own content, so a
  // second derivation of the same quantity is exactly the thing that makes
  // that promise false later. `/`, `/learn` and `/lessons` already read the
  // constant; this used the same sum and so agreed today, but nothing kept
  // it agreeing. The label stays "Curriculum hours": this is an
  // explanatory stats block, not the filter chrome the short vocabulary is
  // for.
  const totalHours = CURRICULUM_HOURS;

  return (
    // No single track, About describes the whole site, so it gets the
    // neutral `atlas` reference environment rather than the homepage's
    // curriculum-order crossfade. See docs/UX_REVIEW.md P1-2.
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* `tight`, not `className="pt-4 sm:pt-8"`: `Section` writes its
          vertical padding as an inline `style`, which always beats a class on
          the same element, so that override compiled fine and applied to
          nothing, the page opened with the full `--rhythm-section` (72px at
          320px, 136px on a wide desktop) where 16px was asked for. `tight` is
          the prop that actually reduces it. Same dead override as /learn's
          hero, error.tsx and not-found.tsx. */}
      <Section width="reading" tight>
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            About StudyQuantum
          </SectionTitle>
          <Lede width="reading" className="mt-5">
            StudyQuantum is a written curriculum in quantum mechanics and quantum computing, from
            the linear algebra up to research-depth material, with a working physics engine behind
            every simulation on the site.
          </Lede>
          <p className="mt-5 max-w-reading text-base leading-relaxed text-muted-foreground">
            It is one connected subject taught in{" "}
            <Link href="/learn" className="text-pillar-text hover:underline">
              {PILLARS.length} tracks
            </Link>{" "}
            (Quantum Mechanics, Computing, Hardware, Software, then Quantum Mastery and Apex) in a
            fixed order, because each one builds on the one before it. There are no
            accounts, no paywall, and no streaks or points. The lessons you have finished are
            remembered in your own browser and sent nowhere.
          </p>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Lessons", value: lessons.length },
              { label: "Practice problems", value: problemCount },
              { label: "Courses", value: COURSES.length },
              { label: "Simulators", value: SIMULATOR_COUNT },
              { label: "Glossary entries", value: GLOSSARY_TERMS.length },
              { label: "Curriculum hours", value: totalHours },
            ]}
          />
          <p className="mt-4 text-xs leading-relaxed text-subtle-foreground">
            Every figure above is counted from the site&rsquo;s own content at build time, not
            written by hand.
          </p>
        </Reveal>
      </Section>

      <Section width="wide" tight>
        <Reveal className="grid gap-5 sm:grid-cols-2">
          <Panel className="p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">How it is taught</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The math and physics come before the algorithms and the hardware, in that order, and
              nothing is asserted that the curriculum has not already built. Where a result can be
              derived at the reader&rsquo;s level, it is derived rather than quoted. Where it
              cannot, the lesson says so.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Concepts that are easier to see than to read about are paired with a simulator that
              runs the real computation, so intuition comes from changing a parameter and watching
              what happens rather than from a diagram of what would happen.
            </p>
          </Panel>
          <Panel className="p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Who it is for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">Starting from little or nothing:</span>{" "}
              {/* `ENTRY_BAR` now carries the calculus clause itself, so the sentence that
                  used to repeat it here has been replaced by the part /about has the room
                  to add and the one-line bar does not: which course the boundary falls on,
                  which calculus is actually used, and where to get it. */}
              {ENTRY_BAR} The first course, Mathematical Foundations, builds the linear
              algebra it needs from zero and stays calculus-free throughout; From Classical
              to Quantum, the one after it, assumes derivatives, definite integrals and
              first-order Taylor expansion, and no lesson on this site teaches them, so an
              introductory single-variable calculus text is the one outside book this
              curriculum expects you to have. The Computing track needs none of it. Any
              unfamiliar term is a{" "}
              <Link href="/glossary" className="text-pillar-text hover:underline">
                glossary
              </Link>{" "}
              entry away.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">Coming in with a background:</span> Quantum Mastery
              and Apex are graduate-level: spectral theory for unbounded operators, Lindblad
              dynamics, QSVT, surface-code decoding, resource estimation. If you already know the
              subject, start there and judge the site on that material rather than on the
              introduction.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Undecided?{" "}
              <Link href="/current-quantum" className="text-pillar-text hover:underline">
                Current Quantum
              </Link>{" "}
              is real, dated research in plain language, each item linked to the lesson that
              explains the idea behind it.
            </p>
          </Panel>
        </Reveal>

        <Reveal delay={80} className="mt-5">
          <Instrument label="Verification">
            <h2 className="font-display text-lg font-semibold text-foreground">
              How the content is sourced and checked
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="text-foreground">The simulators run real physics.</span> The Bloch
                sphere, the wavefunction explorer, the density-matrix explorer and the rest are
                driven by this platform&rsquo;s own quantum engine (complex linear algebra, a
                split-operator Schrödinger solver, Kraus-operator noise channels) under unit test.
                None of them is a scripted animation.{" "}
                <Link href="/simulators" className="text-pillar-text hover:underline">
                  Open a simulator
                </Link>{" "}
                and check the numbers against a textbook.
              </li>
              <li>
                <span className="text-foreground">Practice problems are graded exactly.</span> Each
                is checked against a worked solution, not approximate string matching, and the
                worked solution is shown afterwards.
              </li>
              <li>
                <span className="text-foreground">External claims carry their source.</span> Every
                Current Quantum entry links the primary source (the paper, the standards document,
                or the lab&rsquo;s own announcement), and every external image carries its credit
                and license.
              </li>
              <li>
                <span className="text-foreground">Structure is checked mechanically.</span>{" "}
                Prerequisites, difficulty levels, lesson counts and cross-links are read from the
                curriculum data at build time, so the figures a page quotes about itself cannot
                drift from the content it actually has.
              </li>
            </ul>
          </Instrument>
        </Reveal>

        <Reveal delay={120} className="mt-5">
          <Panel className="p-6">
            <TechLabel>Scope</TechLabel>
            <h2 className="mt-1.5 font-display text-lg font-semibold text-foreground">
              What this is not
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Being clear about the limits is part of being trustworthy about the rest.
            </p>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              <li>
                It is <span className="text-foreground">not accredited</span>, and it awards no
                certificate, degree or credit. Nothing here is graded by a person.
              </li>
              <li>
                It does <span className="text-foreground">not run anything on real quantum
                hardware</span>. Every simulation executes in your own browser, at the scale a
                browser allows, which the Software track is explicit about, because that limit is
                itself part of the subject.
              </li>
              <li>
                It is <span className="text-foreground">not a substitute for a physics degree</span>
                . It is a rigorous, self-contained path through the material; it is not a
                supervised research training, and it does not pretend the two are the same.
              </li>
              <li>
                It makes <span className="text-foreground">no forecasts</span> about when quantum
                computers will break encryption or outperform classical machines at a useful task.
                Where the honest answer is &ldquo;this is open,&rdquo; the lessons say that instead.
              </li>
              <li>
                Coverage is <span className="text-foreground">uneven and still growing</span>. Every
                course page shows how much of it is written; a module with no lesson yet is marked
                as such rather than hidden.
              </li>
            </ul>
          </Panel>
        </Reveal>

        {/* Same contract as the Navbar and the homepage hero: the button
            labelled "Start learning" goes to the on-ramp lesson
            (START_LEARNING_HREF), never to /learn. It pointed at /learn here,
            which meant the one loud button on the About page answered "start
            learning" with another index to choose from, the exact failure
            the shared constant exists to prevent (see its comment in
            src/lib/nav.ts). /learn is still one click away as the secondary
            action, under the label the rest of the site gives it. */}
        <Reveal delay={160} className="mt-10 flex flex-wrap justify-center gap-3 text-center">
          <Button href={START_LEARNING_HREF} size="lg">
            Start learning
          </Button>
          <Button href="/learn" size="lg" variant="secondary">
            Browse the curriculum
          </Button>
          <Button href="/simulators" size="lg" variant="ghost">
            Try a simulator first
          </Button>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
