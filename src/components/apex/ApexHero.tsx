import Link from "next/link";
import { FullBleed, Section } from "@/components/ui/Section";
import { Eyebrow, Lede, TechLabel, Readouts } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { getCourse } from "@/lib/content/curriculum";
import { PILLAR_ORDER, PILLAR_VISUALS, pillarDepth } from "@/lib/design/pillars";
import type { Course } from "@/lib/content/types";

/**
 * ============================================================
 * Apex hero — the threshold
 * ============================================================
 * Every other pillar page opens with the same eyebrow / h1 / standfirst
 * sequence composed from `Eyebrow`, `SectionTitle` and `Lede`:
 * paragraph. Apex is the terminal level of the curriculum — the brief calls
 * for the top of this page to read as *crossing a boundary*, not as another
 * instance of that template.
 *
 * The composition borrows the anatomy of a physics preprint's title block:
 * a running head (site + position in the curriculum), an oversized display
 * title, a standfirst, then a two-column "prerequisites assumed" /
 * "manuscript metadata" block below a hairline rule — exactly what a paper
 * puts above its abstract. Nothing here is invented copy: the prerequisite
 * list and every number in the readouts are derived from `curriculum.ts` at
 * render time, not hand-typed, so they can't drift out of sync with it.
 *
 * Deliberately full-bleed and background-transparent (no opaque fill) so the
 * `frontier` regime's rising horizon — declared by `PillarScope` on the page
 * — reads straight through it.
 */

/**
 * The courses this pillar actually assumes, resolved from real
 * `course.prerequisites` entries whose own course lives *outside* Apex.
 * (The prerequisites that point at other Apex courses aren't "assumed
 * background" — they're this pillar's own internal structure, surfaced
 * instead by `ApexCourseIndex`.) De-duplicated by course slug, since two
 * Apex courses can share the same external prerequisite.
 */
function assumedPrerequisites(courses: Course[]) {
  const seen = new Map<string, { title: string; pillarLabel: string; href: string }>();
  for (const course of courses) {
    for (const slug of course.prerequisites) {
      if (seen.has(slug)) continue;
      const prerequisite = getCourse(slug);
      if (!prerequisite || prerequisite.pillar === "apex") continue;
      const visual = PILLAR_VISUALS[prerequisite.pillar];
      seen.set(slug, { title: prerequisite.title, pillarLabel: visual.short, href: visual.route });
    }
  }
  return Array.from(seen.values());
}

export function ApexHero({ courses }: { courses: Course[] }) {
  const totalModules = courses.reduce((sum, course) => sum + course.modules.length, 0);
  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const position = pillarDepth("apex") + 1;
  const prerequisites = assumedPrerequisites(courses);

  return (
    <FullBleed className="border-b border-border-strong">
      {/* Engineering-grid texture, masked to a fade so it reads as drafting
          paper under the title block rather than a hard-edged panel — and
          kept translucent enough that the frontier field's horizon line
          stays visible through it, per the "field never competes" rule. */}
      <div
        aria-hidden="true"
        data-decorative=""
        className="pointer-events-none absolute inset-0 grid-paper opacity-[0.35] [mask-image:linear-gradient(180deg,black,transparent_82%)]"
      />

      <Section width="wide" className="relative" tight>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border pb-3">
          <TechLabel>QuantumLearn — Research Frontier</TechLabel>
          <TechLabel>
            Pillar {String(position).padStart(2, "0")} / {String(PILLAR_ORDER.length).padStart(2, "0")}
          </TechLabel>
        </div>

        <div className="mt-10 sm:mt-16">
          <Eyebrow>Apex · the terminal level</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-[clamp(3.75rem,13vw,9.5rem)] font-semibold leading-[0.9] tracking-tight text-foreground">
            Apex
          </h1>
          <Lede className="mt-6 max-w-[46rem] text-xl leading-relaxed">
            You are no longer just learning established concepts. Six pillars
            of QuantumLearn built the machinery — Apex is where it gets
            pointed at the research frontier: the block-encoding framework
            underlying modern quantum algorithms, the real surface-code
            lattice and the threshold that makes fault tolerance an
            engineering target rather than a hope, QMA and the Local
            Hamiltonian problem, the classical-simulation boundary that is
            the actual definition of quantum advantage, and, finally, the
            skill of reading a real paper&rsquo;s claims against its assumptions.
          </Lede>
          <p className="mt-4 max-w-[42rem] text-sm text-subtle-foreground">
            FIG. 1 — background: a horizon separating a dense, ordered
            lattice of settled results below from sparse, tentatively-linked
            open problems above. It rises as you scroll this page.
          </p>
        </div>

        <FadeRule className="my-10 sm:my-14" />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <TechLabel as="p">Prerequisites assumed</TechLabel>
            {prerequisites.length > 0 ? (
              <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
                {prerequisites.map((prerequisite) => (
                  <li
                    key={prerequisite.title}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5"
                  >
                    <span className="text-foreground">{prerequisite.title}</span>
                    <Link
                      href={prerequisite.href}
                      className="tech-label shrink-0 text-pillar-text transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:text-foreground focus-visible:text-foreground"
                    >
                      {prerequisite.pillarLabel} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-xs text-subtle-foreground">
              Each Apex course also lists its own specific prerequisite
              course below — most require material from more than one
              earlier pillar at once.
            </p>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-10">
            <Readouts
              items={[
                { label: "Courses", value: courses.length },
                { label: "Modules", value: totalModules },
                { label: "Depth", value: totalHours, unit: "est. hours" },
                { label: "Level", value: "Master" },
              ]}
            />
          </div>
        </div>
      </Section>
    </FullBleed>
  );
}
