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
        description="Circuits as data before you ever run them, the state-vector engine underneath every simulator and the wall it hits around 30-50 qubits, and the compilation and hybrid quantum-classical loops that turn an abstract circuit into something real hardware can run. Start with Programming Quantum Computers — it builds on Quantum Gates & Circuits. Build circuits gate by gate in the Circuit Builder (the same build-then-run model real SDKs use), and watch simulated noise act on a live qubit in the Noise & Decoherence Explorer."
      />

      <div className="mt-12">
        <CourseList courses={courses} lessons={lessons} />
      </div>
    </Container>
  );
}
