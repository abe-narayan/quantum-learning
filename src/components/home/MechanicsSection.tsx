import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede, TechLabel } from "@/components/ui/Typography";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";

const PILLAR = "quantum-mechanics" as const;

/**
 * Small, accurate, static sketches of what the lessons behind them actually
 * derive, plain SVG, no canvas. Teasers for the real interactive versions
 * inside the lessons and at /simulators, not a second copy of them.
 *
 * Both are `aria-hidden`: each one draws exactly what its card's own
 * description sentence already says in words (two equal amplitudes and a
 * phase; a wave decaying through a barrier and re-emerging). They previously
 * carried `role="img"` descriptions that restated that sentence, which meant
 * a screen-reader user heard the same content twice per card. The visible
 * prose is the accessible version here, so the drawings are decoration.
 */
function SuperpositionGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 80"
      className={className}
      aria-hidden="true"
      data-decorative=""
    >
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
}

function TunnelingGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 80"
      className={className}
      aria-hidden="true"
      data-decorative=""
    >
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
}

const PHENOMENA = [
  {
    title: "Superposition",
    description:
      "A state can be a weighted combination of two outcomes at once, written c_a|a⟩ + c_b|b⟩, carrying a relative phase invisible in one basis and decisive in another.",
    href: "/lessons/quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    Glyph: SuperpositionGlyph,
  },
  {
    title: "Tunneling",
    description:
      "A particle aimed at a barrier taller than its own energy doesn't stop at it. Its wavefunction decays smoothly through the barrier, leaving a real chance of appearing on the far side.",
    href: "/lessons/quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    Glyph: TunnelingGlyph,
  },
];

/**
 * Track 1 of 6, and the first stop in the background field's `journey`
 * crossfade, which holds on `wave` from the top of the page until this section
 * reaches the middle of the screen (see PillarBand's `data-journey-stop`).
 * Composition: a measured reading column, the plainest of the page's
 * alternating layouts, deliberately, since the loudest compositions are saved
 * for tracks further down.
 *
 * `level={3}` because the six track sections now sit inside three `ActPlate`
 * h2s. The visual size is unchanged: `SectionTitle` keeps `level` and `size`
 * separate exactly so a heading can move in the outline without shrinking.
 */
export function MechanicsSection() {
  return (
    <PillarBand pillar={PILLAR}>
      <Section width="reading" aria-labelledby="mechanics-heading">
        <Reveal>
          <Eyebrow>01 · Quantum Mechanics</Eyebrow>
          <SectionTitle id="mechanics-heading" level={3} className="mt-3">
            Reality, from first principles
          </SectionTitle>
          <Lede width="none" className="mt-4">
            Quantum theory on its own terms, not a computing prerequisite: the actual
            mathematics reality obeys. Linear algebra and complex numbers first, then state
            vectors, operators, and the Schrödinger equation, built up rigorously through the
            hydrogen atom and open quantum systems.
          </Lede>
        </Reveal>

        {/* The page's first contact with Dirac notation, the two cards
            directly below print `c_a|a⟩ + c_b|b⟩`, and ComputingSection
            prints a Bell state after that. The notation stays (it is what
            the material actually looks like, and sanding it off would make
            the homepage read as marketing about physics rather than
            physics), but it gets grounded exactly once, here, at first use:
            one clause saying a ket is a name for a state, plus the glossary
            entry for a reader who wants more. Every later appearance on the
            page can then stand unglossed. See docs/BEGINNER_REVIEW.md
            blocker 3. */}
        <Reveal delay={60} className="mt-6 border-l-2 border-pillar-edge pl-4">
          <TechLabel>Notation</TechLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            <span className="font-tech text-foreground">|0⟩</span>, spoken &ldquo;ket
            zero&rdquo;, is just a name for a state, the way <em>x</em> is a name for a
            number. The cards below and the rest of this page write quantum states that
            way.{" "}
            <Link
              href="/glossary#dirac-notation"
              className="font-medium text-pillar underline-offset-4 hover:underline"
            >
              Dirac notation, in the glossary →
            </Link>
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PHENOMENA.map((phenomenon, index) => {
            const Glyph = phenomenon.Glyph;
            return (
              <Reveal key={phenomenon.title} delay={index * 90}>
                {/* The link wraps the whole card, figure, heading, description
                    and CTA, so the accessible name would otherwise be computed
                    by concatenating all of it: the heading, then the whole
                    description sentence, then "See the derivation →",
                    announced as one run-on name before the reader can decide
                    whether to follow it. `aria-label` here replaces that with
                    the one thing a name should be, where the link goes. The
                    label is the visible heading verbatim, so speech input
                    still matches what a sighted user says (WCAG 2.5.3, label
                    in name). The glyph contributes nothing either way: it is
                    `aria-hidden`, since its old `role="img"` description just
                    restated the description sentence beneath it. */}
                <Link href={phenomenon.href} aria-label={phenomenon.title} className="group block">
                  <div className="text-pillar">
                    <Glyph className="h-16 w-full" />
                  </div>
                  <h4 className="mt-3 text-base font-semibold text-foreground">{phenomenon.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{phenomenon.description}</p>
                  <span className="mt-2 inline-block text-sm font-medium text-pillar group-hover:underline">
                    See the derivation →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <PillarFooter pillar={PILLAR} />
      </Section>
    </PillarBand>
  );
}
