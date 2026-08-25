import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { ContinueLearning } from "@/components/curriculum/ContinueLearning";
import { LessonSearch } from "@/components/curriculum/LessonSearch";
import { PILLARS, COURSES, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Learn",
  description:
    "The QuantumLearn curriculum — Quantum Mechanics, Quantum Computing, Quantum Hardware, Quantum Software, and Quantum Mastery, from strong high-school math through graduate-level rigor.",
  path: "/learn",
});

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Learn", url: `${BASE_URL}/learn` },
]);

export default async function LearnPage() {
  const lessons = await getAllLessonsMeta();

  // Derived from the actual prerequisite graph, not hardcoded: whichever
  // course(s) require nothing else are the curriculum's true starting
  // point(s). Currently exactly one (Mathematical Foundations) — every
  // other course traces back to it, directly or transitively — but this
  // stays honest automatically if that ever changes.
  const rootCourses = COURSES.filter((course) => course.prerequisites.length === 0);
  const rootCourse = rootCourses[0];
  const firstLesson = rootCourse
    ? lessons
        .filter((lesson) => lesson.course === rootCourse.slug)
        .find((lesson) => lesson.module === rootCourse.modules[0]?.slug)
    : undefined;

  // A second, beginner-friendly entry point alongside the prerequisite-graph
  // root above. "What Is a Qubit?" needs no math background and leads with
  // physical intuition (spinning-coin analogy, a live Bloch-sphere demo)
  // before any formalism — a genuinely different, equally valid way in for a
  // reader who wants the "why" before the "how."
  const intuitionLesson = lessons.find(
    (lesson) => lesson.slug === "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
  );

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Learn"
        title="The QuantumLearn curriculum"
        description="Five tracks, each building on strong high-school math and physics, from first principles through graduate-level rigor in quantum mechanics and computing."
      />

      <ContinueLearning />

      {rootCourse || intuitionLesson ? (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Start here</p>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            New to quantum, or ready to build the rigorous foundation? Both are legitimate ways in —
            pick whichever matches how you learn best.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {intuitionLesson ? (
              <Card className="border-brand/30 bg-brand/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  New to quantum? Start here
                </p>
                <p className="mt-2 text-foreground">
                  Prefer physics intuition first?{" "}
                  <strong className="font-semibold">{intuitionLesson.title}</strong> —{" "}
                  {intuitionLesson.description}
                </p>
                <Button href={`/lessons/${intuitionLesson.slug}`} size="sm" className="mt-4">
                  Start with &ldquo;{intuitionLesson.title}&rdquo;
                </Button>
              </Card>
            ) : null}
            {rootCourse ? (
              <Card className="border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prefer the math foundation first? Start here
                </p>
                <p className="mt-2 text-foreground">
                  Every course on this platform traces back, directly or through its prerequisites,
                  to <strong className="font-semibold">{rootCourse.title}</strong> — it&rsquo;s the
                  only course here that needs nothing else first.
                </p>
                {firstLesson ? (
                  <Button href={`/lessons/${firstLesson.slug}`} size="sm" variant="secondary" className="mt-4">
                    Start with &ldquo;{firstLesson.title}&rdquo;
                  </Button>
                ) : null}
              </Card>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-14">
        <LessonSearch lessons={lessons}>
          <div className="space-y-16">
            {PILLARS.map((pillar) => {
              const pillarCourses = getCoursesByPillar(pillar.slug);
              return (
                <section key={pillar.slug} id={pillar.slug} className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{pillar.title}</h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{pillar.description}</p>
                  <div className="mt-6">
                    <CourseTimeline courses={pillarCourses} lessons={lessons} />
                  </div>
                  <div className="mt-6">
                    <CourseList courses={pillarCourses} lessons={lessons} />
                  </div>
                </section>
              );
            })}
          </div>
        </LessonSearch>
      </div>
    </Container>
  );
}
