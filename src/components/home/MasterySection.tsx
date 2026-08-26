import Link from "next/link";
import { Section, Marginalia } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Readouts, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

const PILLAR = "quantum-mastery" as const;

/**
 * Pillar 5 of 6 — where the field's `journey` crossfade is dominated by
 * `operator`. Composition: an editorial type moment rather than another
 * split or timeline — a single large display statement in a narrow column
 * with a margin note, deliberately quieter and more austere than the four
 * sections before it. That drop in visual noise is itself the content: this
 * is where the curriculum stops being introduced and starts being proved.
 */
export function MasterySection() {
  const courses = getCoursesByPillar(PILLAR);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const visual = PILLAR_VISUALS[PILLAR];

  return (
    <PillarBand pillar={PILLAR}>
      <Section width="reading" aria-labelledby="mastery-heading">
        <Reveal>
          <Eyebrow>05 · Quantum Mastery</Eyebrow>
        </Reveal>

        <Reveal delay={60}>
          <SectionTitle id="mastery-heading" size="xl" className="mt-4">
            Where results become proofs.
          </SectionTitle>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Graduate-level mathematical physics and rigorous quantum information theory —
            for readers who&rsquo;ve finished the core curriculum and are ready to draw on
            every earlier pillar at once, not read about a new one.
          </p>
        </Reveal>

        <Marginalia className="mt-8">
          Entry point: Mechanics&rsquo; open quantum systems and Computing&rsquo;s density
          matrices should already feel familiar before starting here.
        </Marginalia>

        <Reveal
          delay={180}
          className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8"
        >
          <Readouts
            items={[
              { label: "Courses", value: courses.length },
              { label: "Est. time", value: hours, unit: "hrs" },
            ]}
          />
          <Link
            href={visual.route}
            className="inline-flex items-center text-sm font-semibold text-pillar hover:underline"
          >
            Enter {visual.short} →
          </Link>
        </Reveal>

        <p className="mt-8 flex items-baseline gap-2">
          <TechLabel>Field</TechLabel>
          <span className="text-xs text-subtle-foreground">{visual.fieldCaption}</span>
        </p>
      </Section>
    </PillarBand>
  );
}
