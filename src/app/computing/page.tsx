import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/curriculum/CourseList";
import { getCoursesByPillar } from "@/lib/content/curriculum";
import { getAllLessonsMeta } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "Computing",
  description:
    "Qubits, gates, and circuits, and the algorithms that give quantum computers their power.",
};

export default async function ComputingPage() {
  const lessons = await getAllLessonsMeta();
  const courses = getCoursesByPillar("quantum-computing");

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Quantum Computing"
        title="From qubits to quantum algorithms"
        description="A single qubit on the Bloch sphere, then multi-qubit circuits and entanglement, density matrices and Bell tests, the core algorithms (Deutsch-Jozsa, Grover, Shor, VQE, QAOA), and error correction. Start with Qubits & Quantum States — it only needs the linear algebra and complex numbers from Mathematical Foundations. Try it yourself in the Bloch Sphere Explorer, the Circuit Builder, Grover's Algorithm Explorer, and the Noise & Decoherence and Syndrome Explorers for how real devices fail and get corrected."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
