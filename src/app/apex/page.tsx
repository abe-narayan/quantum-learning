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
  title: "Apex",
  description:
    "The summit of QuantumLearn: research-depth algorithms, fault tolerance, complexity theory, large-scale simulation and compilation, and a final course in reading and evaluating real quantum-computing research.",
  path: "/apex",
});

export default async function ApexPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("apex");
  const url = pillarUrl("apex");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Apex", url },
  ]);

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-brand" aria-hidden="true">
        <path d="M20 4 L34 32 L6 32 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <line x1="20" y1="4" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <PageHeader
        eyebrow="Apex"
        title="The summit of the curriculum"
        description="Everything earlier in QuantumLearn built toward this: the block-encoding framework that now underlies most quantum algorithms research, the real 2D surface-code lattice and its decoder (not just the conceptual 3-qubit codes), QMA and the Local Hamiltonian problem, tensor networks and the classical-simulation boundary that is the actual definition of quantum advantage, and a final course in reading and evaluating real quantum-computing papers. This is graduate-research-preparation material — dense, but built entirely on courses you've already completed. Start with Quantum Mastery's Quantum Shannon Theory course if POVMs, Stinespring dilation, and channel capacities aren't yet second nature."
        className="mt-4"
      />

      {/* See Mechanics/Computing/Hardware/Software's identical pattern: this
          sr-only h2 keeps the heading hierarchy valid (h1 above, h3s inside
          CourseList below) without an extra visible "Courses" label. */}
      <h2 className="sr-only">Courses</h2>

      <div className="mt-12">
        <CourseTimeline courses={courses} lessons={lessons} />
      </div>

      <div className="mt-8">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
