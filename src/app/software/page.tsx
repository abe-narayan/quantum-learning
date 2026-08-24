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
  title: "Software",
  description: "The simulators, compilers, and SDKs used to program, test, and run quantum algorithms.",
  path: "/software",
});

export default async function SoftwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-software");
  const url = pillarUrl("quantum-software");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Software", url },
  ]);

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-accent" aria-hidden="true">
        <path
          d="M17 7 C 11 7 13 15 8 17 C 13 19 11 27 17 27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 7 C 29 7 27 15 32 17 C 27 19 29 27 23 27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <PageHeader
        eyebrow="Quantum Software"
        title="The layer between your code and a real qubit"
        description="Circuits as data before you ever run them, the state-vector engine underneath every simulator and the wall it hits around 30-50 qubits, and the compilation and hybrid quantum-classical loops that turn an abstract circuit into something real hardware can run. This is the SDK, simulation, and compilation stack — not the physics or the physical device, but the code and infrastructure layer that sits between them. Start with Programming Quantum Computers — it builds on Quantum Gates & Circuits. Build circuits gate by gate in the Circuit Builder (the same build-then-run model real SDKs use), and watch simulated noise act on a live qubit in the Noise & Decoherence Explorer."
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
