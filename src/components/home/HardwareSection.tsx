import Link from "next/link";
import { Section, SplitFigure } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, Readouts, TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";

const PILLAR = "quantum-hardware" as const;

/**
 * A labeled schematic of a coupled-qubit lattice with control wiring coming
 * in from the edge — the same structure the background field's `lattice`
 * regime animates, drawn here as a static, captioned diagram rather than a
 * second live simulation. Illustrative of chip layout, not a specific
 * device's floorplan.
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
      aria-label="A 3 by 3 grid of qubit nodes connected to their neighbors by couplers, with control lines entering from the left edge of each row — a schematic of a coupled-qubit lattice with its control wiring."
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
 * Pillar 3 of 6 — where the field's `journey` crossfade is dominated by
 * `lattice`. Composition: an asymmetric split, figure-first — the diagram
 * this section teaches from sits at 1.35fr against a 1fr text column.
 */
export function HardwareSection() {
  const courses = getCoursesByPillar(PILLAR);
  const hours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  const visual = PILLAR_VISUALS[PILLAR];

  return (
    <PillarBand pillar={PILLAR}>
      <Section width="wide" aria-labelledby="hardware-heading">
        <SplitFigure
          reverse
          text={
            <div>
              <Reveal>
                <Eyebrow>03 · Quantum Hardware</Eyebrow>
                <SectionTitle id="hardware-heading" className="mt-3">
                  Where the math becomes a physical machine
                </SectionTitle>
                <Lede className="mt-4 max-w-none">
                  Every abstract qubit from Quantum Computing has to become a physical object
                  somewhere — this is that somewhere. Five competing physical platforms, the
                  dilution fridges and control electronics that cool, drive, and measure them,
                  and the noise and scaling limits that keep any one platform from winning
                  outright.
                </Lede>
              </Reveal>

              <Reveal delay={100} className="mt-6 text-sm text-muted-foreground">
                Drive real qubit dynamics yourself in the{" "}
                <Link href="/simulators#rabi-explorer" className="font-medium text-pillar hover:underline">
                  Rabi Explorer
                </Link>{" "}
                — the same driven two-level system behind superconducting, trapped-ion, and
                spin-qubit gates — and watch decoherence itself in the{" "}
                <Link href="/simulators#noise-explorer" className="font-medium text-pillar hover:underline">
                  Noise &amp; Decoherence Explorer
                </Link>
                .
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
            <Reveal y={18} delay={60}>
              <Instrument footnote="Illustrative chip schematic — not a specific device's floorplan.">
                <LatticeDiagram className="h-56 w-full text-pillar" />
              </Instrument>
            </Reveal>
          }
        />
      </Section>
    </PillarBand>
  );
}
