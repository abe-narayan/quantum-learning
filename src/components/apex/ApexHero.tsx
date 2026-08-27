import { FullBleed, Section } from "@/components/ui/Section";
import { Eyebrow, Lede, TechLabel, Readouts } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { ReadinessReadout } from "./ReadinessReadout";
import { directPrerequisites, prerequisiteChain } from "./readiness";
import { getCourse } from "@/lib/content/curriculum";
import { PILLAR_ORDER, pillarDepth } from "@/lib/design/pillars";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * Apex hero — the threshold
 * ============================================================
 * Every other track page opens with the same three-part sequence — `Eyebrow`,
 * `SectionTitle` as the h1, then a `Lede` standfirst paragraph. Apex is the
 * terminal level of the curriculum, and the brief calls for the top of this
 * page to read as *crossing a boundary*, not as another instance of that
 * template.
 *
 * The composition borrows the anatomy of a physics preprint's title block:
 * a running head (site + position in the curriculum), an oversized display
 * title, a standfirst, then a two-column "prerequisites assumed" /
 * "manuscript metadata" block below a hairline rule — exactly what a paper
 * puts above its abstract. Nothing here is invented copy: the prerequisite
 * list and every number in the readouts are derived from `curriculum.ts` at
 * render time, not hand-typed, so they can't drift out of sync with it.
 *
 * The prerequisite half of that block is also where the page answers the
 * reader who arrived too early — see `ReadinessReadout`, which reports which
 * of those computed prerequisites they have actually finished and names the
 * specific first course they haven't. It is a status readout, not a gate:
 * nothing on this page is locked, and an advanced reader who has the
 * background from elsewhere is never told to go take a course.
 *
 * Deliberately full-bleed and background-transparent (no opaque fill) so the
 * `frontier` regime's rising horizon — declared by `PillarScope` on the page
 * — reads straight through it.
 */

/**
 * A precise, graduate-syllabus-register statement of what Apex assumes is
 * already fluent — not a beginner-facing warning. Each phrase names a
 * specific result or formalism that a real prerequisite course's own module
 * list establishes, and is only shown if that module still exists in
 * `curriculum.ts` at render time, so this can't drift into an assertion the
 * data no longer backs.
 */
type AssumedResult = { courseSlug: string; moduleSlug: string; phrase: string };
const ASSUMED_RESULTS: AssumedResult[] = [
  {
    courseSlug: "quantum-information-theory",
    moduleSlug: "css-codes-and-the-general-stabilizer-formalism",
    phrase: "the general stabilizer formalism",
  },
  {
    courseSlug: "advanced-algorithms-and-complexity",
    moduleSlug: "bqp-and-oracle-complexity",
    phrase: "BQP and oracle separations",
  },
  {
    courseSlug: "compilation-and-hybrid-algorithms",
    moduleSlug: "quantum-compilation-and-transpilation",
    phrase: "a working transpilation pipeline",
  },
];

function assumedSecondNature(): string[] {
  return ASSUMED_RESULTS.filter((entry) =>
    getCourse(entry.courseSlug)?.modules.some((module) => module.slug === entry.moduleSlug)
  ).map((entry) => entry.phrase);
}

/** "a, b, and c" — never a bare comma-joined list or a trailing Oxford-comma bug at length 2. */
function joinPhrases(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function ApexHero({ courses, lessons }: { courses: Course[]; lessons: LessonMetaWithSlug[] }) {
  const totalModules = courses.reduce((sum, course) => sum + course.modules.length, 0);
  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const position = pillarDepth("apex") + 1;
  const assumed = assumedSecondNature();
  // Both derived from the real `prerequisites` graph at render time — the
  // direct, out-of-Apex prerequisite courses for the status list, and their
  // full transitive ancestry for the "first course you haven't finished"
  // computation inside `ReadinessReadout`.
  const direct = directPrerequisites(courses, lessons);
  const chain = prerequisiteChain(courses, lessons);

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
            Track {String(position).padStart(2, "0")} / {String(PILLAR_ORDER.length).padStart(2, "0")}
          </TechLabel>
        </div>

        <div className="mt-10 sm:mt-16">
          <Eyebrow>Apex · the terminal level</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-[clamp(3.75rem,13vw,9.5rem)] font-semibold leading-[0.9] tracking-tight text-foreground">
            Apex
          </h1>
          <Lede className="mt-6 max-w-[46rem] text-xl leading-relaxed">
            You are no longer just learning established concepts. Six tracks
            of QuantumLearn built the machinery — Apex is where it gets
            pointed at the research frontier: block encodings, quantum
            signal processing, and the quantum singular value transformation
            (QSVT) that now unifies most of quantum algorithm design; the
            real 2D surface-code lattice, its decoder, and the threshold
            that makes fault tolerance an engineering target rather than a
            hope; QMA and the Local Hamiltonian problem; tensor networks and
            the classical-simulation boundary that is the actual definition
            of quantum advantage; and, finally, the skill of reading a real
            paper&rsquo;s claims against its assumptions.
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
            {assumed.length > 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {joinPhrases(assumed)} are assumed second nature here, not
                re-derived — this is where they get used, not taught.
              </p>
            ) : null}
            {/* The same computed prerequisite list this block always carried,
                now also reporting whether the reader has actually finished
                each one and — if not — naming the specific course the
                prerequisite graph puts first. See ReadinessReadout: it is a
                status readout, not a gate, and says so. */}
            <ReadinessReadout
              className="mt-6"
              label="Status"
              pillarLabel="Apex"
              direct={direct}
              chain={chain}
            />
            <p className="mt-3 text-xs text-subtle-foreground">
              Each Apex course also lists its own specific prerequisite
              course below — most require material from more than one
              earlier track at once.
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
