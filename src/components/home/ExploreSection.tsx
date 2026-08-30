import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { SIMULATOR_COUNT } from "@/components/home/siteFigures";
import { getAllCurrentQuantumMeta } from "@/lib/content/currentQuantum/metaRegistry";
import { getAllProblemMeta } from "@/lib/problems/metaRegistry";

/**
 * ============================================================
 * The detour
 * ============================================================
 * Sits between the tracks that build the machine and the tracks that go past
 * it, and it is the only section on the page that is not a step in the
 * sequence. That placement is the argument: the reader has just been walked
 * through four tracks in a fixed order, and the honest thing to say next is
 * that the order is a recommendation, not a gate.
 *
 * Rendered as an index rather than a grid of cards, and that is a deliberate
 * refusal. Five destinations laid out as five tiles is a wall, everything on
 * it competing at the same volume with an identical "Explore" button under it;
 * the same five as ruled rows read at a glance, in one vertical scan, with the
 * differences between them (what you do there, and how much of it there is)
 * doing the discriminating instead of the layout. Each whole row is the link,
 * so nothing here needs a button telling the reader that a link is a link.
 *
 * `count` is the honest weight of each destination, and every figure but the
 * simulators is derived: the Current Quantum entry count comes from the
 * meta-only registry, which is the client-safe half of that collection by
 * design (see clientBoundary.test.ts) and carries no prose. This is a Server
 * Component regardless, so nothing here reaches a browser.
 */

export function ExploreSection() {
  const currentQuantumCount = getAllCurrentQuantumMeta().length;
  const problemCount = getAllProblemMeta().length;

  const DESTINATIONS: Array<{ href: string; name: string; count: string; body: string }> = [
    {
      href: "/simulators",
      name: "Simulators",
      count: `${SIMULATOR_COUNT} tools`,
      body: "Every instrument the lessons use, standing on its own with all of its parameters unlocked. Wave packets, Bloch spheres, circuits, noise channels, Grover, surface-code syndromes.",
    },
    {
      href: "/map",
      name: "Concept map",
      count: "Prerequisite graph",
      body: "The dependency graph of everything the site teaches, drawn. Pick any concept and see exactly what it rests on, and what rests on it.",
    },
    {
      href: "/problems",
      name: "Problems",
      count: `${problemCount} graded`,
      body: "The whole problem corpus, filterable by track and difficulty, each one marked exactly against a real answer rather than a multiple choice.",
    },
    {
      href: "/glossary",
      name: "Glossary",
      count: "Every term, defined",
      body: "The one place to look up a word you met three lessons ago. Each entry links back to the lesson that introduces it properly.",
    },
    {
      href: "/current-quantum",
      name: "Current Quantum",
      count: `${currentQuantumCount} entries`,
      body: "Real, recent results from the field, each one wired back to the lesson that makes it readable. What the curriculum is for, happening now.",
    },
  ];

  return (
    <Section width="wide" aria-labelledby="explore-heading">
      <Reveal>
        <Eyebrow>Sideways</Eyebrow>
        <SectionTitle id="explore-heading" className="mt-3">
          The order is a recommendation, not a gate.
        </SectionTitle>
        <Lede width="wide" className="mt-4">
          Nothing on this site is locked. If a track two levels above you looks interesting, open
          it. And if you would rather skip the reading entirely and go turn knobs for an hour,
          start at the top of this list.
        </Lede>
      </Reveal>

      <Reveal delay={80} className="mt-12">
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
              className="group relative grid gap-x-8 gap-y-2 border-b border-border py-6 transition-colors duration-(--dur-fast) ease-instrument hover:bg-pillar-wash sm:grid-cols-[14rem_1fr] sm:px-2"
            >
              <span className="flex min-w-0 flex-col gap-1">
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
