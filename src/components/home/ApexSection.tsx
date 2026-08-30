import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { PillarBand } from "@/components/home/PillarBand";
import { PillarFooter } from "@/components/home/PillarFooter";
import { START_LEARNING_HREF } from "@/lib/nav";

const PILLAR = "apex" as const;

/**
 * Track 6 of 6, the last stop, where the field's `journey` crossfade ends on
 * `frontier`: a horizon separating dense, settled results below from sparse,
 * tentatively-linked open problems above. Deliberately the least card-like,
 * least colorful section on the page (Apex's identity is contrast and density,
 * not a louder accent) and it carries the page's closing call to action.
 *
 * That closing action is now the *same* action as the hero's: "Start learning"
 * to `START_LEARNING_HREF`, with "Browse the curriculum" beside it as the
 * secondary. It used to invert them, on the reasoning that "start" reads
 * oddly at the bottom of a page. But the site has exactly one primary action
 * and it is shared by the hero and the Navbar, and a reader who has just
 * scrolled the entire descent is the single most likely person on the site to
 * take it. Two buttons that swap roles depending on how far down the page you
 * are is not a contract, it is a coin flip. The way into Apex itself is the
 * `PillarFooter` link above, exactly as it is for the other five tracks.
 */
export function ApexSection() {
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
            <Eyebrow>06 · Apex, the summit</Eyebrow>
            <SectionTitle id="apex-heading" level={3} size="xl" className="mt-4">
              Everything before this built toward here.
            </SectionTitle>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The block-encoding framework underlying most quantum algorithms research. A real
              2D surface-code lattice and its decoder, not a toy 3-qubit code. QMA and the
              Local Hamiltonian problem. Tensor networks and the classical-simulation boundary
              that is the actual definition of quantum advantage. A final course in reading and
              evaluating real quantum-computing papers. Dense, research-depth material, built
              entirely on courses you&rsquo;ve already completed by the time you reach it.
            </p>
          </Reveal>

          <PillarFooter pillar={PILLAR} />

          <Reveal delay={200} className="mt-14 border-t border-border-strong pt-10 text-center">
            <p className="font-tech text-xs uppercase tracking-meta text-subtle-foreground">
              The curriculum ends here. For now.
            </p>
            {/* "Five tracks above this one" was off by one and pointed at the
                wrong track. Apex is 06; the lesson both buttons below open
                (`START_LEARNING_HREF`, "What Is a Qubit?") is in Quantum
                Computing, which is 02. Four tracks, not five. Worth being
                right about: it is the last sentence before the page's closing
                action, and it is describing where that action goes. */}
            <p className="mx-auto mt-5 max-w-md text-muted-foreground">
              It began four tracks above this one, at a single qubit, in a lesson that assumes
              nothing at all.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {/* The same contract as the hero and the Navbar: one primary
                  action, one destination, one label. See the note above. */}
              <Button href={START_LEARNING_HREF} size="lg">
                Start learning
              </Button>
              <Button href="/learn" size="lg" variant="secondary">
                Browse the curriculum
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PillarBand>
  );
}
