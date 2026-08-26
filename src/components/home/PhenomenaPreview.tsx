import Link from "next/link";
import type { ReactElement } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

type Phenomenon = {
  title: string;
  description: string;
  cta: string;
  href: string;
  glyph: (props: { className?: string }) => ReactElement;
};

/**
 * Small, accurate, static sketches of what each lesson actually derives —
 * plain SVG, no canvas and no client-side simulation. These are teasers for
 * the real interactive versions at /simulators and inside the lessons
 * themselves, not a second copy of them, so each one shows just enough
 * geometry to be recognizable at a glance.
 */
const SuperpositionGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 80" className={className} role="img" aria-label="Bar chart of two equal-height amplitude bars labeled |0> and |1>, with a phase dial above them, illustrating a state that is a combination of both at once.">
    <line x1="8" y1="66" x2="132" y2="66" stroke="var(--border)" strokeWidth="1.5" />
    <rect x="22" y="22" width="26" height="44" rx="3" fill="currentColor" />
    <text x="35" y="78" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">|0⟩</text>
    <text x="63" y="48" textAnchor="middle" fontSize="14" fill="var(--muted-foreground)">+</text>
    <rect x="78" y="22" width="26" height="44" rx="3" fill="currentColor" opacity="0.55" />
    <text x="91" y="78" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">|1⟩</text>
    <circle cx="122" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="122" y1="20" x2="129" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const InterferenceGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 80" className={className} role="img" aria-label="Two overlapping wave paths that reinforce at some points and cancel at others, forming a combined wave, illustrating quantum interference.">
    <path
      d="M4,40 C13,22 22,22 31,40 C40,58 49,58 58,40 C67,22 76,22 85,40 C94,58 103,58 112,40 C121,22 130,22 136,32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.55"
    />
    <path
      d="M4,40 C13,58 22,58 31,40 C40,22 49,22 58,40 C67,58 76,58 85,40 C94,22 103,22 112,40 C121,58 130,58 136,48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 3"
      opacity="0.55"
    />
    <path
      d="M4,40 C13,8 22,8 31,40 C40,72 49,72 58,40 C67,8 76,8 85,40 C94,72 103,72 112,40 C121,8 130,8 136,22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  </svg>
);

const EntanglementGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 80" className={className} role="img" aria-label="Two separate circles, each with an arrow pointing the same direction, joined by a dashed line, illustrating two qubits whose measurement outcomes are correlated no matter how far apart they are.">
    <circle cx="36" cy="40" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="36" y1="40" x2="49.5" y2="16.6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    <circle cx="49.5" cy="16.6" r="3" fill="currentColor" />
    <line x1="64" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="104" cy="40" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line x1="104" y1="40" x2="117.5" y2="16.6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    <circle cx="117.5" cy="16.6" r="3" fill="currentColor" />
  </svg>
);

const TunnelingGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 160 80" className={className} role="img" aria-label="A wave arriving from the left, decaying smoothly while crossing a shaded energy barrier, then re-emerging with reduced but nonzero amplitude on the right, illustrating quantum tunneling.">
    <line x1="6" y1="66" x2="154" y2="66" stroke="var(--border)" strokeWidth="1.5" />
    <rect x="70" y="14" width="24" height="52" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.25" />
    <path
      d="M6,40 C16,22 26,58 36,40 C46,22 56,58 66,40 C72,36 78,34 82,36 C86,38 88,39 94,38 C102,37 108,32 116,40 C124,48 132,32 140,40 C145,44 150,36 154,40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    />
  </svg>
);

const PHENOMENA: Phenomenon[] = [
  {
    title: "Superposition",
    description:
      "A quantum state can be a weighted combination of two outcomes at once, c_a|a⟩ + c_b|b⟩ — a relative phase that stays invisible when you measure in that same basis but reshapes the odds entirely in another.",
    cta: "See the derivation",
    href: "/lessons/quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    glyph: SuperpositionGlyph,
  },
  {
    title: "Interference",
    description:
      "Amplitudes heading to the same outcome add together — a single, well-placed phase flip can turn a uniform superposition across several qubits into one definite result, with no measurement in between.",
    cta: "See how circuits use it",
    href: "/lessons/quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    glyph: InterferenceGlyph,
  },
  {
    title: "Entanglement",
    description:
      "Two qubits can share a joint state, (|00⟩ + |11⟩)/√2, that cannot be split into a separate state for each one — measuring one instantly fixes the other's outcome, in a way no classical shared randomness can reproduce.",
    cta: "See the proof",
    href: "/lessons/quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    glyph: EntanglementGlyph,
  },
  {
    title: "Quantum tunneling",
    description:
      "A particle aimed at a barrier taller than its own energy doesn't simply stop — inside the barrier its wavefunction decays smoothly rather than vanishing, leaving a real chance of finding it on the far side.",
    cta: "See the wave decay",
    href: "/lessons/quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    glyph: TunnelingGlyph,
  },
];

export function PhenomenaPreview() {
  return (
    <section className="border-b border-border bg-surface-muted/40 py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Not analogies</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Four things classical physics can&rsquo;t explain
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each of these is a real result derived, step by step, in a QuantumLearn lesson —
            not an analogy. Pick one to see the math behind it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PHENOMENA.map((phenomenon, index) => {
            const accentClass = index % 2 === 0 ? "text-brand" : "text-accent";
            const Glyph = phenomenon.glyph;

            return (
              <Link key={phenomenon.title} href={phenomenon.href} className="block h-full">
                <Card className="flex h-full flex-col gap-3 transition-colors hover:border-brand/40">
                  <div className={accentClass}>
                    <Glyph className="h-16 w-full" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{phenomenon.title}</h3>
                  <p className="text-sm text-muted-foreground">{phenomenon.description}</p>
                  <span className="mt-auto pt-1 text-sm font-medium text-brand">
                    {phenomenon.cta} →
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
