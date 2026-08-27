import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionTitle, Lede, Readouts, TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { LazyBlochSphereHeroExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereHeroExplorer";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

const PILLAR = "quantum-computing" as const;

/**
 * Pillar 2 of 6 — where the field's `journey` crossfade is dominated by
 * `state` (Bloch-sphere precession). Composition: a full-bleed, pillar-tinted
 * band housing the same live qubit explorer the field is drawing an
 * abstraction of — text and instrument, edge to edge, a deliberate break
 * from Mechanics' quiet reading column.
 */
export function ComputingSection() {
  const courses = getCoursesByPillar(PILLAR);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const visual = PILLAR_VISUALS[PILLAR];

  return (
    <PillarBand pillar={PILLAR}>
      <Section bleed aria-labelledby="computing-heading" className="border-y border-border bg-pillar-wash">
        <Container>
          <SplitFigure
            text={
              <div>
                <Reveal>
                  <Eyebrow>02 · Quantum Computing</Eyebrow>
                  <SectionTitle id="computing-heading" className="mt-3">
                    Build the machines, then run the algorithms
                  </SectionTitle>
                  <Lede className="mt-4 max-w-none">
                    A single qubit&rsquo;s state on the Bloch sphere, then multi-qubit circuits wired
                    together and entangled — a joint state, (|00⟩ + |11⟩)/√2, that cannot be split
                    into a separate state for each qubit. Measuring one instantly fixes the other&rsquo;s
                    outcome, in a way no classical shared randomness can reproduce.
                  </Lede>
                </Reveal>

                <Reveal delay={100} className="mt-6">
                  <Link
                    href="/lessons/quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-pillar hover:underline"
                  >
                    See the proof of entanglement →
                  </Link>
                </Reveal>

                <Reveal
                  delay={160}
                  className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6"
                >
                  <Readouts
                    items={[
                      { label: "Courses", value: courses.length },
                      { label: "Est. time", value: hours, unit: "hrs" },
                    ]}
                  />
                  <Link
                    href={visual.route}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-pillar hover:underline"
                  >
                    Enter {visual.short} →
                  </Link>
                </Reveal>

                <p className="mt-6 flex items-baseline gap-2">
                  <TechLabel>Field</TechLabel>
                  <span className="text-xs text-subtle-foreground">{visual.fieldCaption}</span>
                </p>
              </div>
            }
            figure={
              <Reveal y={18} delay={80}>
                <Instrument bodyClassName="p-0">
                  <LazyBlochSphereHeroExplorer />
                </Instrument>
              </Reveal>
            }
          />
        </Container>
      </Section>
    </PillarBand>
  );
}
