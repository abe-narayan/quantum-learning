import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

  const stats = [
    { label: "Lessons", value: lessons.length },
    { label: "Practice problems", value: problemCount },
    { label: "Courses", value: COURSES.length },
    { label: "Simulators", value: SIMULATOR_COUNT },
  ];

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="About"
        title="About QuantumLearn"
        description="QuantumLearn is a platform for teaching quantum mechanics and quantum computing to advanced high-school and early-college students, from the underlying math through real algorithms and a real atom."
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-foreground">Our approach</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We treat quantum mechanics and quantum computing as one connected
            subject, not two separate ones. Lessons build the underlying math
            and physics before introducing algorithms or hardware, and every
            concept is paired with an interactive simulator so intuition
            comes from direct experimentation, not just reading.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-foreground">Who it&rsquo;s for</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Students with a solid grounding in algebra and basic calculus and
            an interest in physics or computer science — no prior quantum
            mechanics or linear algebra required, though it helps. The
            curriculum spans six pillars: quantum mechanics, quantum
            computing, quantum hardware, and quantum software, followed by
            Quantum Mastery&rsquo;s graduate-level rigor and Apex, the
            research-depth capstone for those who complete the rest.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-foreground">How this is verified</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Every simulator on this platform (the Bloch sphere, the wavefunction
          explorer, the density-matrix explorer, and the rest) is backed by
          this platform&rsquo;s own tested quantum-physics engine — real
          linear algebra, a real numerical Schrödinger-equation solver, real
          Kraus-operator noise channels — not a scripted animation. Practice
          problems are graded against exact, worked solutions rather than
          approximate pattern matching. See{" "}
          <Link href="/simulators" className="text-brand hover:underline">
            the simulators
          </Link>{" "}
          directly.
        </p>
      </Card>

      <div className="mt-10 flex flex-wrap justify-center gap-3 text-center">
        <Button href="/learn" size="lg">
          Start learning
        </Button>
        <Button href="/simulators" size="lg" variant="secondary">
          Try a simulator first
        </Button>
      </div>
    </Container>
  );
}
