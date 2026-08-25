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
  title: "Computing",
  description:
    "Qubits, gates, and circuits, and the algorithms that give quantum computers their power.",
  path: "/computing",
});

export default async function ComputingPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-computing");
  const url = pillarUrl("quantum-computing");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Computing", url },
  ]);

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-accent" aria-hidden="true">
        <circle cx="19" cy="21" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="19" y1="21" x2="30" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="9" r="2.25" fill="currentColor" />
      </svg>
      <PageHeader
        eyebrow="Quantum Computing"
        title="Build the machines, then run the algorithms"
        description="Build a single qubit's state on the Bloch sphere, then wire multi-qubit circuits together, entangle them, and reason formally about what you've built with density matrices and Bell tests — before running the algorithms that actually use it: Deutsch-Jozsa, Grover, Shor, VQE, QAOA, and the error correction that keeps any of it working. Start with Qubits & Quantum States — it only needs the linear algebra and complex numbers from Mathematical Foundations for Quantum Mechanics. Try it yourself in the Bloch Sphere Explorer, the Circuit Builder, Grover's Algorithm Explorer, and the Noise & Decoherence and Syndrome Explorers for how real devices fail and get corrected."
        className="mt-4"
      />

      {/* See src/app/mechanics/page.tsx for why this sr-only h2 exists:
          CourseList's course titles render as <h3>, and without this the
          page would jump straight from the <h1> above to those h3s. */}
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
