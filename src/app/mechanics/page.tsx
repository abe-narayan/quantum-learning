import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Mechanics",
  description:
    "The mathematical and physical foundation of quantum theory, from the failure of classical physics through the hydrogen atom and beyond.",
};

export default async function MechanicsPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-mechanics");

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Quantum Mechanics"
        title="The physics beneath quantum computing"
        description="Linear algebra and complex numbers first, then state vectors, operators, and the Schrödinger equation, building up through the hydrogen atom and open quantum systems. Start with Mathematical Foundations if that math isn't second nature yet. Build intuition with the Wavefunction Explorer (real wave-packet evolution and tunneling), the Rabi Explorer (driven two-level systems), and the Density Matrix Explorer (mixed states and decoherence)."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
