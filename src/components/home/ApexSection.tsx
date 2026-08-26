import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionTitle, Readouts, TechLabel } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { getCoursesByPillar, PILLARS } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

const PILLAR = "apex" as const;

/**
 * Pillar 6 of 6 — the terminal section, where the field's `journey`
 * crossfade ends on `frontier`: a horizon separating dense, settled results
 * below from sparse, tentatively-linked open problems above. Deliberately
 * the least card-like, least colorful section on the page — Apex's identity
 * is contrast and density, not a louder accent — and it carries the
 * homepage's one remaining call to action, replacing what used to be a
 * separate generic "FinalCTA" section.
 */
export function ApexSection() {
  const courses = getCoursesByPillar(PILLAR);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const visual = PILLAR_VISUALS[PILLAR];

  return (
    <PillarBand pillar={PILLAR} className="bg-background">
      <div
        aria-hidden="true"
        data-decorative=""
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--pillar-accent) 22%, var(--pillar-accent) 78%, transparent)",
        }}
      />

      <Section width="wide" aria-labelledby="apex-heading" className="border-t border-border">
        <Container className="max-w-3xl">
          <Reveal>
            <Eyebrow>06 · Apex — the summit</Eyebrow>
            <SectionTitle id="apex-heading" size="xl" className="mt-4">
              Everything before this built toward here.
            </SectionTitle>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The block-encoding framework underlying most quantum algorithms research. A real
              2D surface-code lattice and its decoder, not a toy 3-qubit code. QMA and the
              Local Hamiltonian problem. Tensor networks and the classical-simulation boundary
              that is the actual definition of quantum advantage. A final course in reading and
              evaluating real quantum-computing papers. Dense, research-depth material — built
              entirely on courses you&rsquo;ve already completed by the time you reach it.
            </p>
          </Reveal>

          <Reveal
            delay={140}
            className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8"
          >
            <Readouts
              items={[
                { label: "Courses", value: courses.length },
                { label: "Est. time", value: hours, unit: "hrs" },
                { label: "Pillars climbed", value: PILLARS.length - 1, unit: "→ here" },
              ]}
            />
          </Reveal>

          <p className="mt-6 flex items-baseline gap-2">
            <TechLabel>Field</TechLabel>
            <span className="text-xs text-subtle-foreground">{visual.fieldCaption}</span>
          </p>

          <Reveal delay={200} className="mt-14 border-t border-border-strong pt-10 text-center">
            <p className="font-tech text-xs uppercase tracking-[0.14em] text-subtle-foreground">
              The curriculum ends here. For now.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/learn" size="lg">
                Start at the beginning
              </Button>
              <Button href={visual.route} size="lg" variant="secondary">
                See the summit
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PillarBand>
  );
}
