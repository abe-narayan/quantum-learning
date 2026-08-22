import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Hardware",
  description: "How qubits are physically built, controlled, read out, and scaled into real devices.",
};

export default async function HardwarePage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-hardware");

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Quantum Hardware"
        title="How qubits become real devices"
        description="The physical platforms, control systems, and engineering challenges behind working quantum computers."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
