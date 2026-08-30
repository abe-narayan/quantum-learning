import { Section, Marginalia } from "@/components/ui/Section";
import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";

const PILLAR = "quantum-mastery" as const;

/**
 * Track 5 of 6, the fifth stop in the field's `journey` crossfade, where the
 * environment becomes `operator`. Composition: an editorial type moment rather
 * than another split or timeline, a single large display statement in a narrow
 * column with a margin note, deliberately quieter and more austere than the
 * four sections before it. That drop in visual noise is itself the content:
 * this is where the curriculum stops being introduced and starts being proved.
 *
 * `size="xl"` on an h3 is the case `SectionTitle`'s separate `level` and `size`
 * exist for. The outline says this is one of two tracks under Act III; the
 * type says it is the loudest thing on the screen.
 */
export function MasterySection() {
  return (
    <PillarBand pillar={PILLAR}>
      <Section width="reading" aria-labelledby="mastery-heading">
        <Reveal>
          <Eyebrow>05 · Quantum Mastery</Eyebrow>
        </Reveal>

        <Reveal delay={60}>
          <SectionTitle id="mastery-heading" level={3} size="xl" className="mt-4">
            Where results become proofs.
          </SectionTitle>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Graduate-level mathematical physics and rigorous quantum information theory,
            for readers who&rsquo;ve finished the core curriculum and are ready to draw on
            every earlier track at once, not read about a new one.
          </p>
        </Reveal>

        <Marginalia className="mt-8">
          Entry point: Mechanics&rsquo; open quantum systems and Computing&rsquo;s density
          matrices should already feel familiar before starting here.
        </Marginalia>

        <PillarFooter pillar={PILLAR} />
      </Section>
    </PillarBand>
  );
}
