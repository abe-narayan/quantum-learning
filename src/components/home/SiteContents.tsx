import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";
import { getAllCurrentQuantumMeta } from "@/lib/content/currentQuantum/metaRegistry";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { COURSES, PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";
import { CONCEPT_NODES } from "@/lib/content/concepts";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * ============================================================
 * Everything here
 * ============================================================
 * The site's contents, in one list, reachable without the navbar.
 *
 * This supersedes `ExploreSection`, which did the same job well for five of
 * the site's destinations and sat between Act II and Act III, about nine
 * thousand pixels down. Its two good decisions are kept verbatim, because they
 * were right: ruled rows rather than a wall of identical cards, so ten
 * destinations read in one vertical scan with their differences doing the
 * discriminating instead of the layout; and the whole row as the target via a
 * stretched `::after`, so nothing needs a button telling the reader that a
 * link is a link.
 *
 * What changes is coverage and position. Four major destinations (`/lessons`,
 * `/mastery`, `/apex`, `/about`) appeared nowhere on this page except inside
 * running prose or the site chrome, and the whole index arrived after the
 * reader had already scrolled past most of the site. It is now part of the
 * orientation layer, in front of the narrative.
 *
 * `count` is the honest weight of each destination and every figure is
 * derived. `/about` gets a phrase instead: it is one page and its size is not
 * the interesting fact about it.
 *
 * A Server Component. `GLOSSARY_TERMS` and `CONCEPT_NODES` are plain static
 * arrays already read this way by `/about` and `/glossary`; nothing here
 * crosses the client boundary. See
 * `src/lib/design/__tests__/clientBoundary.test.ts`.
 */

export async function SiteContents() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;
  const currentQuantumCount = getAllCurrentQuantumMeta().length;
  const masteryCourses = getCoursesByPillar("quantum-mastery").length;
  const apexCourses = getCoursesByPillar("apex").length;

  const DESTINATIONS: Array<{ href: string; name: string; count: string; body: string }> = [
    {
      href: "/learn",
      name: "Learn",
      count: `${COURSES.length} courses · ${PILLARS.length} tracks`,
      body: "The recommended path through the whole curriculum, with the two entry routes forking at the top.",
    },
    {
      href: "/lessons",
      name: "All lessons",
      count: `${lessons.length} lessons`,
      body: "The complete index, grouped by track and filterable by difficulty.",
    },
    {
      href: "/problems",
      name: "Problems",
      count: `${problemCount} graded`,
      body: "Marked against a real answer rather than a multiple choice, hints and solution behind each.",
    },
    {
      href: "/simulators",
      name: "Simulators",
      count: `${SIMULATOR_COUNT} instruments`,
      body: "Wave packets, Bloch spheres, circuits, noise channels, Grover, surface-code decoding.",
    },
    {
      href: "/glossary",
      name: "Glossary",
      count: `${GLOSSARY_TERMS.length} terms`,
      body: "Somewhere to look up a word you met three lessons ago, each linked to the lesson behind it.",
    },
    {
      href: "/map",
      name: "Concept map",
      count: `${CONCEPT_NODES.length} concepts`,
      body: "The prerequisite graph, drawn. Pick anything and see what it rests on.",
    },
    {
      href: "/current-quantum",
      name: "Current Quantum",
      count: `${currentQuantumCount} entries`,
      body: "Recent results from the field, each wired back to the lesson that makes it readable.",
    },
    {
      href: PILLAR_VISUALS["quantum-mastery"].route,
      name: "Quantum Mastery",
      count: `${masteryCourses} courses`,
      // Not `MasterySection`'s own sentence ("Graduate-level mathematical
      // physics and rigorous quantum information theory..."): a scrolling
      // visitor meets both on the same page, this index row roughly 4,000px
      // ahead of that section, and the two used to say the identical clause.
      // This row instead names what the five courses actually are, the same
      // fact `/mastery` itself opens with.
      body: "Five self-contained structures that make the core curriculum rigorous: proofs, not just results.",
    },
    {
      href: PILLAR_VISUALS.apex.route,
      name: "Apex",
      count: `${apexCourses} courses`,
      body: "Research depth: block encodings, surface codes, QMA, tensor networks, reading papers.",
    },
    {
      href: "/about",
      name: "About",
      count: "How it is checked",
      body: "Who the site is for, how it is verified, and what it deliberately does not claim.",
    },
  ];

  return (
    <Section width="wide" aria-labelledby="contents-heading">
      <Reveal>
        <Eyebrow>Everything here</Eyebrow>
        <SectionTitle id="contents-heading" className="mt-3">
          The whole site, with its sizes attached.
        </SectionTitle>
        <Lede width="wide" className="mt-4">
          The same set the navigation bar carries, with a figure beside each for how much of it
          there is.
        </Lede>
      </Reveal>

      <Reveal delay={80} className="mt-8">
        <ul className="border-t border-border">
          {/* Only the *name* is inside the anchor, and the anchor stretches
              over the whole row with `after:absolute after:inset-0`. Wrapping
              the description in the link instead would make the row's
              accessible name the entire paragraph, announced in full before a
              screen-reader user could decide whether to follow it, and the
              usual fix for that (an `aria-label` naming the destination)
              overrides the description out of the accessibility tree
              altogether. The stretched pseudo-element keeps all three true at
              once: the row is one 44px-tall click target, the link is named
              "Simulators", and the sentence explaining it is still content. */}
          {DESTINATIONS.map((destination) => (
            <li
              key={destination.href}
              className="group relative grid gap-x-8 gap-y-0.5 border-b border-border py-3 transition-colors duration-(--dur-fast) ease-instrument hover:bg-pillar-wash sm:grid-cols-[15rem_1fr] sm:items-baseline sm:px-2"
            >
              {/* One row on a phone, two lines from `sm` up. The name and the
                  figure are 24px and 13px of the same short line, so stacking
                  them below 640px spent 20px per row (200px over the ten) on
                  a line break that nothing needed: at 375px "Simulators" and
                  "14 instruments" sit side by side with room to spare. From
                  `sm` the row becomes the 15rem index column beside its
                  description, where the stack is what lines the figures up. */}
              <span className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 sm:flex-col sm:items-start sm:justify-start">
                <Link
                  href={destination.href}
                  className="font-display text-lg font-semibold text-foreground after:absolute after:inset-0 after:content-[''] group-hover:text-pillar"
                >
                  {destination.name}
                </Link>
                <TechLabel>{destination.count}</TechLabel>
              </span>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                {destination.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
