import type { Metadata } from "next";
import Link from "next/link";
import { PillarScope } from "@/components/field/PillarScope";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Panel, Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { COURSES } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { getAllProblemMeta } from "@/lib/problems/registry";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: "What QuantumLearn is, and who it's built for.",
  path: "/about",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "About", url: `${BASE_URL}/about` },
]);

// Real simulator <section> count on /simulators — update this alongside that
// page if a simulator is added or removed (no shared source of truth exists
// for this one number, so it's hand-kept in sync rather than computed).
const SIMULATOR_COUNT = 14;

export default async function AboutPage() {
  const lessons = await getAllLessonsMeta();
  const problemCount = getAllProblemMeta().length;

  return (
    // No single pillar — About describes the whole site — so it gets the
    // neutral `atlas` reference environment rather than the homepage's
    // curriculum-order crossfade. See docs/UX_REVIEW.md P1-2.
    <PillarScope regime="atlas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Section width="reading" className="pt-4 sm:pt-8">
        <Reveal>
          <Eyebrow>About</Eyebrow>
          <SectionTitle level={1} size="xl" className="mt-4">
            About QuantumLearn
          </SectionTitle>
          <Lede className="mt-5 max-w-[46rem]">
            QuantumLearn is a platform for teaching quantum mechanics and quantum computing to
            advanced high-school and early-college students, from the underlying math through real
            algorithms and a real atom.
          </Lede>
        </Reveal>
        <Reveal delay={90}>
          <Readouts
            className="mt-8"
            items={[
              { label: "Lessons", value: lessons.length },
              { label: "Practice problems", value: problemCount },
              { label: "Courses", value: COURSES.length },
              { label: "Simulators", value: SIMULATOR_COUNT },
            ]}
          />
        </Reveal>
      </Section>

      <Section width="wide" tight>
        <Reveal className="grid gap-5 sm:grid-cols-2">
          <Panel className="p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Our approach</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We treat quantum mechanics and quantum computing as one connected subject, not two
              separate ones. Lessons build the underlying math and physics before introducing
              algorithms or hardware, and every concept is paired with an interactive simulator so
              intuition comes from direct experimentation, not just reading.
            </p>
          </Panel>
          <Panel className="p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Who it&rsquo;s for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Students with a solid grounding in algebra and basic calculus and an interest in
              physics or computer science — no prior quantum mechanics or linear algebra required,
              though it helps. The curriculum spans six pillars: quantum mechanics, quantum
              computing, quantum hardware, and quantum software, followed by Quantum
              Mastery&rsquo;s graduate-level rigor and Apex, the research-depth capstone for those
              who complete the rest.
            </p>
          </Panel>
        </Reveal>

        <Reveal delay={80} className="mt-5">
          <Instrument label="Verification">
            <h2 className="font-display text-lg font-semibold text-foreground">
              How this is verified
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every simulator on this platform (the Bloch sphere, the wavefunction explorer, the
              density-matrix explorer, and the rest) is backed by this platform&rsquo;s own tested
              quantum-physics engine — real linear algebra, a real numerical Schrödinger-equation
              solver, real Kraus-operator noise channels — not a scripted animation. Practice
              problems are graded against exact, worked solutions rather than approximate pattern
              matching. See{" "}
              <Link href="/simulators" className="text-pillar-text hover:underline">
                the simulators
              </Link>{" "}
              directly.
            </p>
          </Instrument>
        </Reveal>

        <Reveal delay={120} className="mt-10 flex flex-wrap justify-center gap-3 text-center">
          <Button href="/learn" size="lg">
            Start learning
          </Button>
          <Button href="/simulators" size="lg" variant="secondary">
            Try a simulator first
          </Button>
        </Reveal>
      </Section>
    </PillarScope>
  );
}
