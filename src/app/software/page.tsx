import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Software",
  description: "The simulators, compilers, and SDKs used to program, test, and run quantum algorithms.",
};

export default async function SoftwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-software");

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Quantum Software"
        title="Programming and simulating quantum computers"
        description="From writing your first circuit to the compilers and hybrid algorithms that make quantum programs run efficiently."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
