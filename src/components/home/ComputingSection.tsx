import Link from "next/link";
import { Section } from "@/components/ui/Section";
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
          {/* Written out rather than the shared `SplitFigure`, whose two
              children are always in DOM order text-then-figure (only their
              *visual* left/right can flip, via `reverse`). Here the figure is
              the shorter column, because it has no counterpart to the text
              column's fourth paragraph, `PillarFooter`. DOM order text-then-
              figure means the whole text column, including that trailing
              paragraph, is the tab sequence's last stop before the figure,
              and every alignment this grid can express (`items-center`,
              `items-start`, `items-end`, all measured) puts the figure at
              least the figure's own height above that stop, since the figure
              is shorter than the text column by roughly that much: measured
              with `scripts/audit/a11y.mjs --routes "/"`, "Enter Computing →"
              (the text column's last stop) to the sphere's first control
              jumped back 640px at the shared component's default
              `items-center`, 745px at `items-start`, and still 534px at
              `items-end`, all past the 400px backward-jump threshold.
              Reordering the two children in the DOM instead (figure first,
              text second, with `lg:col-start-*` fixing the *visual* columns
              back to their original places, independent of DOM order) is
              what actually fixes it: the tab sequence now drains the shorter
              figure first, then the text column with its own long tail last,
              landing there exactly where the eye already is at the end of
              the section. Confirmed at 0 backward jumps over 400px.

              Below `lg` this collapses to one column with no explicit grid
              placement at all, so it stacks in plain DOM order, figure then
              text, which is backward: `SplitFigure`'s own doc comment states
              the rule this used to get from it for free, "the visual second
              in source order, so on a phone the reader gets the framing text
              before the figure, which is the order that teaches." `order-2`
              / `order-1` (unprefixed, so they apply below `lg` and are
              superseded by the explicit `lg:col-start-*` placement above
              that breakpoint) restore that reading order on a phone without
              touching the desktop fix. */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-14">
            <div className="order-2 min-w-0 lg:col-start-2">
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
            </div>
            <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
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
          </div>
        </Container>
      </Section>
    </PillarBand>
  );
}
