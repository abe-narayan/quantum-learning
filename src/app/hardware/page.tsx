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
  title: "Hardware",
  description: "How qubits are physically built, controlled, read out, and scaled into real devices.",
  path: "/hardware",
});

export default async function HardwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-hardware");
  const url = pillarUrl("quantum-hardware");
  const courseListSchema = buildCourseListSchema(courses.map((course) => ({ course, url })));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Hardware", url },
  ]);

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([courseListSchema, breadcrumbSchema]) }}
      />
      <svg viewBox="0 0 40 40" className="h-10 w-10 text-brand" aria-hidden="true">
        <rect x="11" y="11" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="11" y1="16" x2="5" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="24" x2="5" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="29" y1="16" x2="35" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="29" y1="24" x2="35" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="11" x2="16" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="29" x2="24" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <PageHeader
        eyebrow="Quantum Hardware"
        title="Where the math becomes a physical machine"
        description="Every abstract qubit from Quantum Computing has to become a physical object somewhere — this is that somewhere. The five competing physical platforms used to build real qubits, then the dilution fridges, control electronics, and readout hardware that cool, drive, and measure them, and the noise and scaling limits that keep any one platform from winning outright. Start with Physical Qubit Platforms — it picks up right after Qubits & Quantum States. Drive real qubit dynamics yourself in the Rabi Explorer (the same driven two-level system behind superconducting, trapped-ion, neutral-atom, and spin-qubit gates), see a photonic qubit's state on the Bloch Sphere Explorer, and watch decoherence itself in the Noise & Decoherence Explorer."
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
