import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { PILLARS, COURSES, getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { buildPageMetadata, BASE_URL } from "@/lib/pageMetadata";
import { buildBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Learn",
  description:
    "The QuantumLearn curriculum — Quantum Mechanics, Quantum Computing, Quantum Hardware, and Quantum Software, from strong high-school math through advanced undergraduate material.",
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

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        eyebrow="Learn"
        title="The QuantumLearn curriculum"
        description="Four tracks, each building on strong high-school math and physics toward advanced undergraduate quantum mechanics and computing."
      />

      {rootCourse ? (
        <Card className="mt-10 border-brand/30 bg-brand/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Start here</p>
          <p className="mt-2 text-foreground">
            Every course on this platform traces back, directly or through its prerequisites, to{" "}
            <strong className="font-semibold">{rootCourse.title}</strong> — it&rsquo;s the only course
            here that needs nothing else first.
          </p>
          {firstLesson ? (
            <Button href={`/lessons/${firstLesson.slug}`} size="sm" className="mt-4">
              Start with &ldquo;{firstLesson.title}&rdquo;
            </Button>
          ) : null}
        </Card>
      ) : null}

      <div className="mt-14 space-y-16">
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
    </Container>
  );
}
