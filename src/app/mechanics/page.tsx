import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { BASE_URL, buildBreadcrumbSchema, buildCourseListSchema, pillarUrl } from "@/lib/structuredData";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Mechanics",
  description:
    "The mathematical and physical foundation of quantum theory, from the failure of classical physics through the hydrogen atom and beyond.",
  path: "/mechanics",
});

export default async function MechanicsPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-mechanics");
  const url = pillarUrl("quantum-mechanics");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Mechanics", url },
  ]);

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-brand" aria-hidden="true">
        <path
          d="M3 22 C 8 10, 14 10, 20 22 S 32 34, 37 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <PageHeader
        eyebrow="Quantum Mechanics"
        title="Reality, from first principles"
        description="This is quantum theory on its own terms, not a computing prerequisite: the actual mathematics reality obeys. Linear algebra and complex numbers first, then state vectors, operators, and the Schrödinger equation, built up rigorously through the hydrogen atom and open quantum systems. Start with Mathematical Foundations for Quantum Mechanics if that math isn't second nature yet. Build intuition with the Wavefunction Explorer (real wave-packet evolution and tunneling), the Rabi Explorer (driven two-level systems), and the Density Matrix Explorer (mixed states and decoherence)."
        className="mt-4"
      />

      <div className="mt-12">
        <CourseTimeline courses={courses} lessons={lessons} />
      </div>

      <div className="mt-8">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
