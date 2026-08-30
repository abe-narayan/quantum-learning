import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";

const PILLAR = "quantum-hardware" as const;

/**
 * A labeled schematic of a coupled-qubit lattice with control wiring coming
 * in from the edge, the same structure the background field's `lattice`
 * regime animates, drawn here as a static, captioned diagram rather than a
 * second live simulation. Illustrative of chip layout, not a specific
 * device's floorplan.
 *
 * THE 8-UNIT LABELS, MEASURED. `src/lib/design/__tests__/figureLegibility.test.ts`
 * cannot decide this figure — the classes arrive as a prop, so whether it is
 * `w-full` is the caller's choice — and `components/home` is outside the
 * directories it scans, so the arithmetic is recorded here instead.
 *
 * There is exactly one caller, `HardwareSection` below, and it is mounted only
 * on the homepage: `/hardware` renders no lattice diagram at all (confirmed
 * against both routes on the dev server). It passes `h-56 w-full`, and the
 * `preserveAspectRatio` this `<svg>` does not override defaults to
 * `xMidYMid meet`, so the drawing scales by whichever of the two axes binds
 * first: min(boxWidth / 200, 224 / 140), the 224 being `h-56`.
 *
 * The narrowest box is a 320px viewport: `Section width="wide"` is a
 * `Container` (`px-4`), giving a 288px column, and the `<Instrument>` frame
 * takes 2 x (16px `p-4` + 1px border) = 34px, leaving **254px**. There
 * min(254/200, 1.6) = 1.27, and the CONTROL and COUPLER labels paint at
 * 8 x 1.27 = **10.16px**. That is the minimum: the height binds at every box
 * from 320px up, pinning the scale at 1.6 and the labels at 12.8px however
 * wide the page gets. Both clear the ~9px floor, so the 8 stands.
 */
function LatticeDiagram({ className }: { className?: string }) {
  const positions = [0, 1, 2];
  const spacing = 46;
  const originX = 24;
  const originY = 20;

  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      role="img"
      aria-label="A 3 by 3 grid of qubit nodes connected to their neighbors by couplers, with control lines entering from the left edge of each row: a schematic of a coupled-qubit lattice with its control wiring."
    >
      {positions.map((row) =>
        positions.map((col) => {
          const x = originX + col * spacing;
          const y = originY + row * spacing;
          return (
            <g key={`${row}-${col}`}>
              {col < 2 ? (
                <line x1={x + 8} y1={y} x2={x + spacing - 8} y2={y} stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
              ) : null}
              {row < 2 ? (
                <line x1={x} y1={y + 8} x2={x} y2={y + spacing - 8} stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
              ) : null}
            </g>
          );
        })
      )}
      {positions.map((row) => (
        <line
          key={`control-${row}`}
          x1={0}
          y1={originY + row * spacing}
          x2={originX - 8}
          y2={originY + row * spacing}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.55"
        />
      ))}
      {positions.map((row) =>
        positions.map((col) => (
          <circle
            key={`qubit-${row}-${col}`}
            cx={originX + col * spacing}
            cy={originY + row * spacing}
            r={row === 1 && col === 1 ? 6.5 : 4.5}
            fill="currentColor"
            opacity={row === 1 && col === 1 ? 1 : 0.7}
          />
        ))
      )}
      <text x="4" y="14" fontSize="8" letterSpacing="0.5" fill="var(--muted-foreground)">
        CONTROL
      </text>
      <text x={originX + spacing - 6} y="134" fontSize="8" letterSpacing="0.5" fill="var(--muted-foreground)">
        COUPLER
      </text>
    </svg>
  );
}

/**
 * Track 3 of 6, the third stop in the field's `journey` crossfade, where the
 * environment becomes `lattice`. Composition: an asymmetric split, figure
 * first, with the diagram this section teaches from at 1.35fr against a 1fr
 * text column.
 */
export function HardwareSection() {
  return (
    <PillarBand pillar={PILLAR}>
      <Section width="wide" aria-labelledby="hardware-heading">
        <SplitFigure
          reverse
          text={
            <div>
              <Reveal>
                <Eyebrow>03 · Quantum Hardware</Eyebrow>
                <SectionTitle id="hardware-heading" level={3} className="mt-3">
                  Where the math becomes a physical machine
                </SectionTitle>
                <Lede width="none" className="mt-4">
                  Every abstract qubit from Quantum Computing has to become a physical object
                  somewhere. This is that somewhere: five competing physical platforms, the
                  dilution fridges (refrigerators colder than deep space) and control
                  electronics that cool, drive, and measure them, and the noise and scaling
                  limits that keep any one platform from winning outright.
                </Lede>
              </Reveal>

              <Reveal delay={100} className="mt-6 text-sm text-muted-foreground">
                Drive real qubit dynamics yourself in the{" "}
                <Link href="/simulators#rabi-explorer" className="font-medium text-pillar hover:underline">
                  Rabi Explorer
                </Link>{" "}
                (the same driven two-level system behind superconducting, trapped-ion, and
                spin-qubit gates), and watch decoherence (a qubit leaking its quantum behavior
                into its surroundings until only classical noise is left) happen live in the{" "}
                <Link href="/simulators#noise-explorer" className="font-medium text-pillar hover:underline">
                  Noise &amp; Decoherence Explorer
                </Link>
                .
              </Reveal>

              <PillarFooter pillar={PILLAR} />
            </div>
          }
          figure={
            <Reveal y={18} delay={60}>
              <Instrument footnote="Illustrative chip schematic, not a specific device's floorplan.">
                <LatticeDiagram className="h-56 w-full text-pillar" />
              </Instrument>
            </Reveal>
          }
        />
      </Section>
    </PillarBand>
  );
}
