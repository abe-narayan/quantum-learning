import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";
import { LazyBlochSphereHeroExplorer } from "@/components/simulators/bloch-sphere/LazyBlochSphereHeroExplorer";

const PILLAR = "quantum-computing" as const;

/**
 * Track 2 of 6, the second stop in the field's `journey` crossfade, where the
 * environment hands over to `state` (Bloch-sphere precession). Composition: a
 * full-bleed, pillar-tinted band housing the same live qubit explorer the
 * field is drawing an abstraction of, text and instrument edge to edge, a
 * deliberate break from Mechanics' quiet reading column.
 */
export function ComputingSection() {
  return (
    <PillarBand pillar={PILLAR}>
      <Section bleed aria-labelledby="computing-heading" className="border-y border-border bg-pillar-wash">
        <Container>
          <SplitFigure
            text={
              <div>
                <Reveal>
                  <Eyebrow>02 · Quantum Computing</Eyebrow>
                  <SectionTitle id="computing-heading" level={3} className="mt-3">
                    Build the machines, then run the algorithms
                  </SectionTitle>
                  {/* First occurrence of "Bloch sphere" on the page, so it is
                      glossed in plain speech at first use, same first-use
                      rule as MechanicsSection's Notation block, and the live
                      explorer beside this text is the thing being described.
                      "Classical shared randomness" was accurate but alien;
                      "prearranged answers" is the same physical claim (no
                      local hidden variables) said plainly. */}
                  <Lede width="none" className="mt-4">
                    A single qubit&rsquo;s state lives on the Bloch sphere, the globe the live
                    explorer here draws: north pole |0⟩, south pole |1⟩, every other point a
                    superposition of both. Then come multi-qubit circuits, wired together and
                    entangled into a joint state, (|00⟩ + |11⟩)/√2, that cannot be split into a
                    separate state for each qubit. Measuring one instantly fixes the
                    other&rsquo;s outcome, and no scheme of secretly prearranged answers can
                    reproduce that.
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

                <PillarFooter pillar={PILLAR} />
              </div>
            }
            figure={
              <Reveal y={18} delay={80}>
                {/* No `bodyClassName="p-0"`; see the note in Hero.tsx. It
                    compiled to a padding the body never took (`.p-0` is
                    emitted before `.p-4`, and `.sm:p-5` after both), and
                    `BlochSphereHeroExplorer` self-frames with its own
                    `rounded-panel border` root, so flushing this body would
                    double the hairline rather than remove it. */}
                <Instrument>
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
